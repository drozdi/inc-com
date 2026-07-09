<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260709140700 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Phase 1.7: Transfer — new table + transfer_id on Transaction';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE inccom_transfer (id INT AUTO_INCREMENT NOT NULL, from_account_id INT NOT NULL, to_account_id INT NOT NULL, author_id INT DEFAULT NULL, outgoing_transaction_id INT DEFAULT NULL, incoming_transaction_id INT DEFAULT NULL, amount NUMERIC(16, 2) NOT NULL, date DATETIME NOT NULL, comment LONGTEXT DEFAULT NULL, created_at DATETIME DEFAULT NULL, x_timestamp DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_TRANSFER_OUTGOING (outgoing_transaction_id), UNIQUE INDEX UNIQ_TRANSFER_INCOMING (incoming_transaction_id), INDEX IDX_TRANSFER_FROM (from_account_id), INDEX IDX_TRANSFER_TO (to_account_id), INDEX IDX_TRANSFER_AUTHOR (author_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE inccom_transfer ADD CONSTRAINT FK_TRANSFER_FROM FOREIGN KEY (from_account_id) REFERENCES inccom_account (id) ON DELETE RESTRICT');
        $this->addSql('ALTER TABLE inccom_transfer ADD CONSTRAINT FK_TRANSFER_TO FOREIGN KEY (to_account_id) REFERENCES inccom_account (id) ON DELETE RESTRICT');
        $this->addSql('ALTER TABLE inccom_transfer ADD CONSTRAINT FK_TRANSFER_AUTHOR FOREIGN KEY (author_id) REFERENCES main_user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE inccom_transfer ADD CONSTRAINT FK_TRANSFER_OUTGOING FOREIGN KEY (outgoing_transaction_id) REFERENCES inccom_transaction (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE inccom_transfer ADD CONSTRAINT FK_TRANSFER_INCOMING FOREIGN KEY (incoming_transaction_id) REFERENCES inccom_transaction (id) ON DELETE SET NULL');

        $this->addSql('ALTER TABLE inccom_transaction ADD transfer_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_TX_TRANSFER FOREIGN KEY (transfer_id) REFERENCES inccom_transfer (id) ON DELETE SET NULL');
        $this->addSql('CREATE INDEX IDX_TX_TRANSFER ON inccom_transaction (transfer_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_TX_TRANSFER');
        $this->addSql('DROP INDEX IDX_TX_TRANSFER ON inccom_transaction');
        $this->addSql('ALTER TABLE inccom_transaction DROP transfer_id');

        $this->addSql('ALTER TABLE inccom_transfer DROP FOREIGN KEY FK_TRANSFER_FROM');
        $this->addSql('ALTER TABLE inccom_transfer DROP FOREIGN KEY FK_TRANSFER_TO');
        $this->addSql('ALTER TABLE inccom_transfer DROP FOREIGN KEY FK_TRANSFER_AUTHOR');
        $this->addSql('ALTER TABLE inccom_transfer DROP FOREIGN KEY FK_TRANSFER_OUTGOING');
        $this->addSql('ALTER TABLE inccom_transfer DROP FOREIGN KEY FK_TRANSFER_INCOMING');
        $this->addSql('DROP TABLE inccom_transfer');
    }
}
