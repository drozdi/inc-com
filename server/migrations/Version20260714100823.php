<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260714100823 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add transaction.type and align index names with Doctrine schema';
    }

    public function up(Schema $schema): void
    {
        $sm = $this->connection->createSchemaManager();

        $transaction = $sm->introspectTable('inccom_transaction');
        if (!$transaction->hasColumn('type')) {
            $this->addSql("ALTER TABLE inccom_transaction ADD type VARCHAR(255) NOT NULL DEFAULT 'expense'");
        }

        if ($this->hasIndex($sm, 'inccom_transaction', 'IDX_TX_TRANSFER')) {
            $this->addSql('ALTER TABLE inccom_transaction RENAME INDEX IDX_TX_TRANSFER TO IDX_CD115638537048AF');
        }

        if ($this->hasIndex($sm, 'inccom_transaction_item', 'IDX_TX_ITEM_TRANSACTION')) {
            $this->addSql('ALTER TABLE inccom_transaction_item CHANGE x_timestamp x_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP');
            $this->addSql('ALTER TABLE inccom_transaction_item RENAME INDEX IDX_TX_ITEM_TRANSACTION TO IDX_5EB996782FC0CB0F');
        }

        if ($this->hasIndex($sm, 'inccom_transaction_item', 'IDX_TX_ITEM_ITEM')) {
            $this->addSql('ALTER TABLE inccom_transaction_item RENAME INDEX IDX_TX_ITEM_ITEM TO IDX_5EB99678126F525E');
        }

        if ($this->hasIndex($sm, 'inccom_account_user', 'IDX_8F4A8F2E9B6B5FBA')) {
            $this->addSql('ALTER TABLE inccom_account_user RENAME INDEX IDX_8F4A8F2E9B6B5FBA TO IDX_D8692D6C9B6B5FBA');
        }

        if ($this->hasIndex($sm, 'inccom_account_user', 'IDX_8F4A8F2EA76ED395')) {
            $this->addSql('ALTER TABLE inccom_account_user RENAME INDEX IDX_8F4A8F2EA76ED395 TO IDX_D8692D6CA76ED395');
        }

        if ($this->hasIndex($sm, 'inccom_item_item_category', 'IDX_ITEM_CATEGORY_ITEM')) {
            $this->addSql('ALTER TABLE inccom_item_item_category RENAME INDEX IDX_ITEM_CATEGORY_ITEM TO IDX_915F6424126F525E');
        }

        if ($this->hasIndex($sm, 'inccom_item_item_category', 'IDX_ITEM_CATEGORY_CAT')) {
            $this->addSql('ALTER TABLE inccom_item_item_category RENAME INDEX IDX_ITEM_CATEGORY_CAT TO IDX_915F6424F22EC5D4');
        }

        if ($this->hasIndex($sm, 'inccom_transfer', 'IDX_TRANSFER_FROM')) {
            $this->addSql('ALTER TABLE inccom_transfer CHANGE x_timestamp x_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP');
            $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX IDX_TRANSFER_FROM TO IDX_27E49C9AB0CF99BD');
        }

        if ($this->hasIndex($sm, 'inccom_transfer', 'IDX_TRANSFER_TO')) {
            $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX IDX_TRANSFER_TO TO IDX_27E49C9ABC58BDC7');
        }

        if ($this->hasIndex($sm, 'inccom_transfer', 'IDX_TRANSFER_AUTHOR')) {
            $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX IDX_TRANSFER_AUTHOR TO IDX_27E49C9AF675F31B');
        }

        if ($this->hasIndex($sm, 'inccom_transfer', 'UNIQ_TRANSFER_OUTGOING')) {
            $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX UNIQ_TRANSFER_OUTGOING TO UNIQ_27E49C9AB29C5D53');
        }

        if ($this->hasIndex($sm, 'inccom_transfer', 'UNIQ_TRANSFER_INCOMING')) {
            $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX UNIQ_TRANSFER_INCOMING TO UNIQ_27E49C9ABDF6AADF');
        }
    }

    public function down(Schema $schema): void
    {
        $sm = $this->connection->createSchemaManager();

        if ($this->hasIndex($sm, 'inccom_transfer', 'UNIQ_27E49C9ABDF6AADF')) {
            $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX UNIQ_27E49C9ABDF6AADF TO UNIQ_TRANSFER_INCOMING');
        }

        if ($this->hasIndex($sm, 'inccom_transfer', 'UNIQ_27E49C9AB29C5D53')) {
            $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX UNIQ_27E49C9AB29C5D53 TO UNIQ_TRANSFER_OUTGOING');
        }

        if ($this->hasIndex($sm, 'inccom_transfer', 'IDX_27E49C9AF675F31B')) {
            $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX IDX_27E49C9AF675F31B TO IDX_TRANSFER_AUTHOR');
        }

        if ($this->hasIndex($sm, 'inccom_transfer', 'IDX_27E49C9ABC58BDC7')) {
            $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX IDX_27E49C9ABC58BDC7 TO IDX_TRANSFER_TO');
        }

        if ($this->hasIndex($sm, 'inccom_transfer', 'IDX_27E49C9AB0CF99BD')) {
            $this->addSql('ALTER TABLE inccom_transfer CHANGE x_timestamp x_timestamp DATETIME DEFAULT NULL');
            $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX IDX_27E49C9AB0CF99BD TO IDX_TRANSFER_FROM');
        }

        if ($this->hasIndex($sm, 'inccom_item_item_category', 'IDX_915F6424F22EC5D4')) {
            $this->addSql('ALTER TABLE inccom_item_item_category RENAME INDEX IDX_915F6424F22EC5D4 TO IDX_ITEM_CATEGORY_CAT');
        }

        if ($this->hasIndex($sm, 'inccom_item_item_category', 'IDX_915F6424126F525E')) {
            $this->addSql('ALTER TABLE inccom_item_item_category RENAME INDEX IDX_915F6424126F525E TO IDX_ITEM_CATEGORY_ITEM');
        }

        if ($this->hasIndex($sm, 'inccom_account_user', 'IDX_D8692D6CA76ED395')) {
            $this->addSql('ALTER TABLE inccom_account_user RENAME INDEX IDX_D8692D6CA76ED395 TO IDX_8F4A8F2EA76ED395');
        }

        if ($this->hasIndex($sm, 'inccom_account_user', 'IDX_D8692D6C9B6B5FBA')) {
            $this->addSql('ALTER TABLE inccom_account_user RENAME INDEX IDX_D8692D6C9B6B5FBA TO IDX_8F4A8F2E9B6B5FBA');
        }

        if ($this->hasIndex($sm, 'inccom_transaction_item', 'IDX_5EB99678126F525E')) {
            $this->addSql('ALTER TABLE inccom_transaction_item RENAME INDEX IDX_5EB99678126F525E TO IDX_TX_ITEM_ITEM');
        }

        if ($this->hasIndex($sm, 'inccom_transaction_item', 'IDX_5EB996782FC0CB0F')) {
            $this->addSql('ALTER TABLE inccom_transaction_item CHANGE x_timestamp x_timestamp DATETIME DEFAULT NULL');
            $this->addSql('ALTER TABLE inccom_transaction_item RENAME INDEX IDX_5EB996782FC0CB0F TO IDX_TX_ITEM_TRANSACTION');
        }

        if ($this->hasIndex($sm, 'inccom_transaction', 'IDX_CD115638537048AF')) {
            $this->addSql('ALTER TABLE inccom_transaction RENAME INDEX IDX_CD115638537048AF TO IDX_TX_TRANSFER');
        }

        $transaction = $sm->introspectTable('inccom_transaction');
        if ($transaction->hasColumn('type')) {
            $this->addSql('ALTER TABLE inccom_transaction DROP type');
        }
    }

    private function hasIndex(object $sm, string $table, string $indexName): bool
    {
        $indexes = $sm->listTableIndexes($table);
        foreach (array_keys($indexes) as $name) {
            if (strcasecmp((string) $name, $indexName) === 0) {
                return true;
            }
        }

        return false;
    }
}
