<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260709140500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Phase 1.5: Transaction — add mcc, fpd, isManualAmount, created_at; drop link_id, loaded';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_transaction ADD mcc VARCHAR(10) DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_transaction ADD fpd VARCHAR(20) DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_transaction ADD is_manual_amount TINYINT(1) DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE inccom_transaction ADD created_at DATETIME DEFAULT NULL');
        $this->addSql('UPDATE inccom_transaction SET created_at = x_timestamp WHERE created_at IS NULL AND x_timestamp IS NOT NULL');

        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_CD115638ADA40271');
        $this->addSql('DROP INDEX IDX_CD115638ADA40271 ON inccom_transaction');
        $this->addSql('ALTER TABLE inccom_transaction DROP link_id');
        $this->addSql('ALTER TABLE inccom_transaction DROP loaded');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_transaction ADD link_id INT DEFAULT NULL, ADD loaded TINYINT(1) NOT NULL');
        $this->addSql('CREATE INDEX IDX_CD115638ADA40271 ON inccom_transaction (link_id)');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_CD115638ADA40271 FOREIGN KEY (link_id) REFERENCES inccom_transaction (id) ON DELETE CASCADE');

        $this->addSql('ALTER TABLE inccom_transaction DROP mcc');
        $this->addSql('ALTER TABLE inccom_transaction DROP fpd');
        $this->addSql('ALTER TABLE inccom_transaction DROP is_manual_amount');
        $this->addSql('ALTER TABLE inccom_transaction DROP created_at');
    }
}
