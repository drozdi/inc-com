<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260709140200 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Phase 1.2: TransactionCategory — drop mcc, add created_at';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_category DROP mcc');
        $this->addSql('ALTER TABLE inccom_category ADD created_at DATETIME DEFAULT NULL');
        $this->addSql('UPDATE inccom_category SET created_at = x_timestamp WHERE created_at IS NULL AND x_timestamp IS NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_category DROP created_at');
        $this->addSql('ALTER TABLE inccom_category ADD mcc INT DEFAULT NULL');
    }
}
