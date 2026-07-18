<?php

declare(strict_types=1);

namespace App\Tests\IncCom\Service;

use Doctrine\ORM\EntityManagerInterface;
use IncCom\Entity\Account;
use IncCom\Entity\Category;
use IncCom\Entity\Transfer;
use IncCom\Enum\TransactionType;
use IncCom\Repository\AccountRepository;
use IncCom\Repository\CategoryRepository;
use IncCom\Service\BalanceService;
use IncCom\Service\TransferService;
use Main\Entity\User;
use PHPUnit\Framework\TestCase;

final class TransferServiceTest extends TestCase
{
    public function testCreateBuildsTransferWithPairedTransactions(): void
    {
        $fromAccount = $this->createAccount(1);
        $toAccount = $this->createAccount(2);
        $author = $this->createUser(10);

        $balanceService = $this->createMock(BalanceService::class);
        $balanceService->expects($this->exactly(2))
            ->method('applyDelta')
            ->willReturnCallback(function (Account $account, string $delta): void {
                static $calls = 0;
                ++$calls;

                if ($calls === 1) {
                    $this->assertSame(1, $account->getId());
                    $this->assertSame('-50.00', $delta);
                }

                if ($calls === 2) {
                    $this->assertSame(2, $account->getId());
                    $this->assertSame('50.00', $delta);
                }
            });

        $accountRepository = $this->createMock(AccountRepository::class);
        $accountRepository->method('find')->willReturnMap([
            [1, $fromAccount],
            [2, $toAccount],
        ]);

        $persisted = [];
        $em = $this->createMock(EntityManagerInterface::class);
        $em->method('wrapInTransaction')
            ->willReturnCallback(static fn (callable $callback) => $callback());
        $em->expects($this->once())
            ->method('persist')
            ->with($this->callback(function (Transfer $transfer) use (&$persisted): bool {
                $persisted[] = $transfer;

                return true;
            }));
        $em->expects($this->once())->method('flush');

        $service = new TransferService(
            $em,
            $balanceService,
            $accountRepository,
            $this->createCategoryRepositoryMock(),
        );
        $transfer = $service->create([
            'fromAccountId' => 1,
            'toAccountId' => 2,
            'amount' => '50.00',
            'date' => '2026-02-01 14:30:00',
            'comment' => 'Test transfer',
        ], $author);

        $this->assertInstanceOf(Transfer::class, $transfer);
        $this->assertSame('50.00', $transfer->getAmount());
        $this->assertSame('Test transfer', $transfer->getComment());
        $this->assertSame($fromAccount, $transfer->getFromAccount());
        $this->assertSame($toAccount, $transfer->getToAccount());
        $this->assertSame($author, $transfer->getAuthor());

        $outgoing = $transfer->getOutgoingTransaction();
        $incoming = $transfer->getIncomingTransaction();

        $this->assertNotNull($outgoing);
        $this->assertNotNull($incoming);
        $this->assertSame(TransactionType::Expense, $outgoing->getType());
        $this->assertSame(TransactionType::Income, $incoming->getType());
        $this->assertSame('50.00', $outgoing->getAmount());
        $this->assertSame('50.00', $incoming->getAmount());
        $this->assertTrue($outgoing->isManualAmount());
        $this->assertTrue($incoming->isManualAmount());
        $this->assertSame($transfer, $outgoing->getTransfer());
        $this->assertSame($transfer, $incoming->getTransfer());
        $this->assertCount(1, $persisted);
    }

    public function testCreateRejectsNonPositiveAmount(): void
    {
        $fromAccount = $this->createAccount(1);
        $toAccount = $this->createAccount(2);

        $accountRepository = $this->createMock(AccountRepository::class);
        $accountRepository->method('find')->willReturnMap([
            [1, $fromAccount],
            [2, $toAccount],
        ]);

        $em = $this->createMock(EntityManagerInterface::class);
        $em->method('wrapInTransaction')
            ->willReturnCallback(static fn (callable $callback) => $callback());

        $service = new TransferService(
            $em,
            $this->createMock(BalanceService::class),
            $accountRepository,
            $this->createCategoryRepositoryMock(),
        );

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Transfer amount must be greater than zero.');

        $service->create([
            'fromAccountId' => 1,
            'toAccountId' => 2,
            'amount' => '0',
            'date' => '2026-02-01',
        ], $this->createUser(1));
    }

    public function testCreateRejectsDifferentCurrencies(): void
    {
        $fromAccount = $this->createAccount(1, 'RUB');
        $toAccount = $this->createAccount(2, 'USD');

        $accountRepository = $this->createMock(AccountRepository::class);
        $accountRepository->method('find')->willReturnMap([
            [1, $fromAccount],
            [2, $toAccount],
        ]);

        $em = $this->createMock(EntityManagerInterface::class);
        $em->method('wrapInTransaction')
            ->willReturnCallback(static fn (callable $callback) => $callback());

        $service = new TransferService(
            $em,
            $this->createMock(BalanceService::class),
            $accountRepository,
            $this->createCategoryRepositoryMock(),
        );

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Transfer is only allowed between accounts with the same currency.');

        $service->create([
            'fromAccountId' => 1,
            'toAccountId' => 2,
            'amount' => '50.00',
            'date' => '2026-02-01',
        ], $this->createUser(1));
    }

    public function testCreateAssignsTransferCategoriesToPairedTransactions(): void
    {
        $fromAccount = $this->createAccount(1);
        $toAccount = $this->createAccount(2);
        $author = $this->createUser(10);
        $outgoingCategory = $this->createCategory(5, $fromAccount, 'transfer');
        $incomingCategory = $this->createCategory(6, $toAccount, 'transfer');

        $accountRepository = $this->createMock(AccountRepository::class);
        $accountRepository->method('find')->willReturnMap([
            [1, $fromAccount],
            [2, $toAccount],
        ]);

        $categoryRepository = $this->createMock(CategoryRepository::class);
        $categoryRepository->method('find')->willReturnMap([
            [5, $outgoingCategory],
            [6, $incomingCategory],
        ]);

        $em = $this->createMock(EntityManagerInterface::class);
        $em->method('wrapInTransaction')
            ->willReturnCallback(static fn (callable $callback) => $callback());
        $em->expects($this->once())->method('persist');
        $em->expects($this->once())->method('flush');

        $service = new TransferService(
            $em,
            $this->createMock(BalanceService::class),
            $accountRepository,
            $categoryRepository,
        );

        $transfer = $service->create([
            'fromAccountId' => 1,
            'toAccountId' => 2,
            'amount' => '50.00',
            'date' => '2026-02-01 14:30:00',
            'outgoingCategoryId' => 5,
            'incomingCategoryId' => 6,
        ], $author);

        $this->assertSame($outgoingCategory, $transfer->getOutgoingTransaction()?->getCategory());
        $this->assertSame($incomingCategory, $transfer->getIncomingTransaction()?->getCategory());
    }

    public function testCreateRejectsCategoryFromWrongAccount(): void
    {
        $fromAccount = $this->createAccount(1);
        $toAccount = $this->createAccount(2);
        $wrongCategory = $this->createCategory(5, $toAccount, 'transfer');

        $accountRepository = $this->createMock(AccountRepository::class);
        $accountRepository->method('find')->willReturnMap([
            [1, $fromAccount],
            [2, $toAccount],
        ]);

        $categoryRepository = $this->createMock(CategoryRepository::class);
        $categoryRepository->method('find')->willReturn($wrongCategory);

        $em = $this->createMock(EntityManagerInterface::class);
        $em->method('wrapInTransaction')
            ->willReturnCallback(static fn (callable $callback) => $callback());

        $service = new TransferService(
            $em,
            $this->createMock(BalanceService::class),
            $accountRepository,
            $categoryRepository,
        );

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Category does not belong to the account.');

        $service->create([
            'fromAccountId' => 1,
            'toAccountId' => 2,
            'amount' => '50.00',
            'date' => '2026-02-01',
            'outgoingCategoryId' => 5,
        ], $this->createUser(1));
    }

    private function createCategoryRepositoryMock(): CategoryRepository
    {
        return $this->createMock(CategoryRepository::class);
    }

    private function createCategory(int $id, Account $account, string $type): Category
    {
        $category = new Category();
        $category->setLabel('Category '.$id);
        $category->setType($type);
        $category->setAccount($account);
        $this->setEntityId($category, $id);

        return $category;
    }

    private function createAccount(int $id, string $currency = 'RUB'): Account
    {
        $account = new Account();
        $account->setLabel('Account '.$id);
        $account->setType('cash');
        $account->setIcon('wallet');
        $account->setColor('#000000');
        $account->setCurrency($currency);
        $this->setEntityId($account, $id);

        return $account;
    }

    private function createUser(int $id): User
    {
        $user = new User();
        $this->setEntityId($user, $id);

        return $user;
    }

    private function setEntityId(object $entity, int $id): void
    {
        $reflection = new \ReflectionProperty($entity, 'id');
        $reflection->setAccessible(true);
        $reflection->setValue($entity, $id);
    }
}
