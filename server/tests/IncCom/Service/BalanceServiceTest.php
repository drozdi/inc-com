<?php

declare(strict_types=1);

namespace App\Tests\IncCom\Service;

use Doctrine\DBAL\LockMode;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use IncCom\Entity\Account;
use IncCom\Service\BalanceService;
use PHPUnit\Framework\TestCase;

final class BalanceServiceTest extends TestCase
{
    public function testApplyDeltaIncreasesBalance(): void
    {
        $account = $this->createAccount(1, '100.00');
        $em = $this->createEntityManagerForApplyDelta($account);

        $service = new BalanceService($em);
        $service->applyDelta($account, '25.50');

        $this->assertSame('125.50', $account->getBalance());
    }

    public function testApplyDeltaDecreasesBalance(): void
    {
        $account = $this->createAccount(1, '100.00');
        $em = $this->createEntityManagerForApplyDelta($account);

        $service = new BalanceService($em);
        $service->applyDelta($account, '-30.25');

        $this->assertSame('69.75', $account->getBalance());
    }

    public function testApplyDeltaThrowsWhenAccountIsNotPersisted(): void
    {
        $account = new Account();
        $em = $this->createMock(EntityManagerInterface::class);

        $service = new BalanceService($em);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Account must be persisted before updating balance.');

        $service->applyDelta($account, '10.00');
    }

    public function testRecalculateSetsBalanceFromTransactions(): void
    {
        $account = $this->createAccount(1, '0.00');
        $em = $this->createEntityManagerForRecalculate($account, '300.00', '100.00');

        $service = new BalanceService($em);
        $balance = $service->recalculate($account);

        $this->assertSame('200.00', $balance);
        $this->assertSame('200.00', $account->getBalance());
    }

    public function testRecalculateRetriesAfterOptimisticLockException(): void
    {
        $account = $this->createAccount(1, '50.00');
        $freshAccount = $this->createAccount(1, '50.00');

        $em = $this->createMock(EntityManagerInterface::class);
        $em->method('contains')->willReturn(true);
        $em->expects($this->exactly(2))->method('lock')->with(
            $this->logicalOr($account, $freshAccount),
            LockMode::PESSIMISTIC_WRITE,
        );

        $flushCalls = 0;
        $em->method('flush')->willReturnCallback(function () use (&$flushCalls): void {
            ++$flushCalls;
            if ($flushCalls === 1) {
                throw new OptimisticLockException('version conflict', null);
            }
        });

        $em->expects($this->once())->method('detach')->with($account);
        $em->expects($this->once())->method('find')->with(Account::class, 1)->willReturn($freshAccount);

        $service = new BalanceService($em);
        $service->applyDelta($account, '10.00');

        $this->assertSame('60.00', $freshAccount->getBalance());
    }

    private function createAccount(int $id, string $balance): Account
    {
        $account = new Account();
        $this->setEntityId($account, $id);
        $account->setBalance($balance);

        return $account;
    }

    private function createEntityManagerForApplyDelta(Account $account): EntityManagerInterface
    {
        $em = $this->createMock(EntityManagerInterface::class);
        $em->method('contains')->willReturn(true);
        $em->expects($this->once())->method('lock')->with($account, LockMode::PESSIMISTIC_WRITE);
        $em->expects($this->once())->method('flush');

        return $em;
    }

    private function createEntityManagerForRecalculate(
        Account $account,
        string $incomeSum,
        string $expenseSum,
    ): EntityManagerInterface {
        $incomeQuery = $this->createQueryReturningScalar($incomeSum);
        $expenseQuery = $this->createQueryReturningScalar($expenseSum);

        $incomeQb = $this->createQueryBuilderReturningQuery($incomeQuery);
        $expenseQb = $this->createQueryBuilderReturningQuery($expenseQuery);

        $em = $this->createMock(EntityManagerInterface::class);
        $em->method('contains')->willReturn(true);
        $em->expects($this->once())->method('lock')->with($account, LockMode::PESSIMISTIC_WRITE);
        $em->expects($this->once())->method('flush');
        $em->method('createQueryBuilder')
            ->willReturnOnConsecutiveCalls($incomeQb, $expenseQb);

        return $em;
    }

    private function createQueryReturningScalar(string $value): Query
    {
        $query = $this->createMock(Query::class);
        $query->method('getSingleScalarResult')->willReturn($value);

        return $query;
    }

    private function createQueryBuilderReturningQuery(Query $query): QueryBuilder
    {
        $qb = $this->createMock(QueryBuilder::class);
        $qb->method('select')->willReturnSelf();
        $qb->method('from')->willReturnSelf();
        $qb->method('where')->willReturnSelf();
        $qb->method('andWhere')->willReturnSelf();
        $qb->method('setParameter')->willReturnSelf();
        $qb->method('getQuery')->willReturn($query);

        return $qb;
    }

    private function setEntityId(object $entity, int $id): void
    {
        $reflection = new \ReflectionProperty($entity, 'id');
        $reflection->setAccessible(true);
        $reflection->setValue($entity, $id);
    }
}
