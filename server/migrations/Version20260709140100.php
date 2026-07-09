<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260709140100 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Phase 1.1: Account — description, currency, number, created_at, M2M users';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_account ADD description LONGTEXT DEFAULT NULL');
        $this->addSql("ALTER TABLE inccom_account ADD currency VARCHAR(3) DEFAULT 'USD' NOT NULL");
        $this->addSql('ALTER TABLE inccom_account ADD number VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_account ADD created_at DATETIME DEFAULT NULL');
        $this->addSql('UPDATE inccom_account SET created_at = x_timestamp WHERE created_at IS NULL AND x_timestamp IS NOT NULL');
        $this->addSql('CREATE TABLE inccom_account_user (account_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_8F4A8F2E9B6B5FBA (account_id), INDEX IDX_8F4A8F2EA76ED395 (user_id), PRIMARY KEY(account_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE inccom_account_user ADD CONSTRAINT FK_8F4A8F2E9B6B5FBA FOREIGN KEY (account_id) REFERENCES inccom_account (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inccom_account_user ADD CONSTRAINT FK_8F4A8F2EA76ED395 FOREIGN KEY (user_id) REFERENCES main_user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_account_user DROP FOREIGN KEY FK_8F4A8F2E9B6B5FBA');
        $this->addSql('ALTER TABLE inccom_account_user DROP FOREIGN KEY FK_8F4A8F2EA76ED395');
        $this->addSql('DROP TABLE inccom_account_user');
        $this->addSql('ALTER TABLE inccom_account DROP description');
        $this->addSql('ALTER TABLE inccom_account DROP currency');
        $this->addSql('ALTER TABLE inccom_account DROP number');
        $this->addSql('ALTER TABLE inccom_account DROP created_at');
    }
}
