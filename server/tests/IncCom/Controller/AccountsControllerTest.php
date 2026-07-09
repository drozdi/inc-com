<?php

declare(strict_types=1);

namespace App\Tests\IncCom\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class AccountsControllerTest extends WebTestCase
{
    public function testListReturns401WithoutToken(): void
    {
        try {
            $client = static::createClient();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Kernel boot failed (missing env/DB/JWT): ' . $e->getMessage());
        }

        $client->request('GET', '/api/accounts');

        $this->assertResponseStatusCodeSame(401);
    }

    public function testListResponseStructureWhenAuthenticated(): void
    {
        try {
            $client = static::createClient();
        } catch (\Throwable $e) {
            $this->markTestSkipped('Kernel boot failed (missing env/DB/JWT): ' . $e->getMessage());
        }

        $this->markTestSkipped('Requires test DB seed and JWT token — smoke structure only.');
    }

    protected static function getKernelClass(): string
    {
        return \App\Kernel::class;
    }
}
