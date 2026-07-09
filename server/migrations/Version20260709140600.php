<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260709140600 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Phase 1.6: TransactionItem — new table inccom_transaction_item';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE inccom_transaction_item (id INT AUTO_INCREMENT NOT NULL, transaction_id INT NOT NULL, item_id INT NOT NULL, quantity NUMERIC(12, 3) NOT NULL, price NUMERIC(16, 2) NOT NULL, sum NUMERIC(16, 2) NOT NULL, created_at DATETIME DEFAULT NULL, x_timestamp DATETIME DEFAULT NULL, INDEX IDX_TX_ITEM_TRANSACTION (transaction_id), INDEX IDX_TX_ITEM_ITEM (item_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE inccom_transaction_item ADD CONSTRAINT FK_TX_ITEM_TRANSACTION FOREIGN KEY (transaction_id) REFERENCES inccom_transaction (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inccom_transaction_item ADD CONSTRAINT FK_TX_ITEM_ITEM FOREIGN KEY (item_id) REFERENCES inccom_product (id) ON DELETE RESTRICT');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_transaction_item DROP FOREIGN KEY FK_TX_ITEM_TRANSACTION');
        $this->addSql('ALTER TABLE inccom_transaction_item DROP FOREIGN KEY FK_TX_ITEM_ITEM');
        $this->addSql('DROP TABLE inccom_transaction_item');
    }
}
