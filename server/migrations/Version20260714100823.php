<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260714100823 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_account CHANGE currency currency VARCHAR(3) DEFAULT \'RUB\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_account_user RENAME INDEX idx_8f4a8f2e9b6b5fba TO IDX_D8692D6C9B6B5FBA');
        $this->addSql('ALTER TABLE inccom_account_user RENAME INDEX idx_8f4a8f2ea76ed395 TO IDX_D8692D6CA76ED395');
        $this->addSql('ALTER TABLE inccom_item_item_category RENAME INDEX idx_item_category_item TO IDX_915F6424126F525E');
        $this->addSql('ALTER TABLE inccom_item_item_category RENAME INDEX idx_item_category_cat TO IDX_915F6424F22EC5D4');
        $this->addSql('ALTER TABLE inccom_transaction ADD type VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE inccom_transaction RENAME INDEX idx_tx_transfer TO IDX_CD115638537048AF');
        $this->addSql('ALTER TABLE inccom_transaction_item CHANGE x_timestamp x_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE inccom_transaction_item RENAME INDEX idx_tx_item_transaction TO IDX_5EB996782FC0CB0F');
        $this->addSql('ALTER TABLE inccom_transaction_item RENAME INDEX idx_tx_item_item TO IDX_5EB99678126F525E');
        $this->addSql('ALTER TABLE inccom_transfer CHANGE x_timestamp x_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX idx_transfer_from TO IDX_27E49C9AB0CF99BD');
        $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX idx_transfer_to TO IDX_27E49C9ABC58BDC7');
        $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX idx_transfer_author TO IDX_27E49C9AF675F31B');
        $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX uniq_transfer_outgoing TO UNIQ_27E49C9AB29C5D53');
        $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX uniq_transfer_incoming TO UNIQ_27E49C9ABDF6AADF');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_account CHANGE currency currency VARCHAR(3) DEFAULT \'USD\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_account_user RENAME INDEX idx_d8692d6c9b6b5fba TO IDX_8F4A8F2E9B6B5FBA');
        $this->addSql('ALTER TABLE inccom_account_user RENAME INDEX idx_d8692d6ca76ed395 TO IDX_8F4A8F2EA76ED395');
        $this->addSql('ALTER TABLE inccom_item_item_category RENAME INDEX idx_915f6424f22ec5d4 TO IDX_ITEM_CATEGORY_CAT');
        $this->addSql('ALTER TABLE inccom_item_item_category RENAME INDEX idx_915f6424126f525e TO IDX_ITEM_CATEGORY_ITEM');
        $this->addSql('ALTER TABLE inccom_transaction DROP type');
        $this->addSql('ALTER TABLE inccom_transaction RENAME INDEX idx_cd115638537048af TO IDX_TX_TRANSFER');
        $this->addSql('ALTER TABLE inccom_transaction_item CHANGE x_timestamp x_timestamp DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_transaction_item RENAME INDEX idx_5eb99678126f525e TO IDX_TX_ITEM_ITEM');
        $this->addSql('ALTER TABLE inccom_transaction_item RENAME INDEX idx_5eb996782fc0cb0f TO IDX_TX_ITEM_TRANSACTION');
        $this->addSql('ALTER TABLE inccom_transfer CHANGE x_timestamp x_timestamp DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX idx_27e49c9af675f31b TO IDX_TRANSFER_AUTHOR');
        $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX idx_27e49c9ab0cf99bd TO IDX_TRANSFER_FROM');
        $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX idx_27e49c9abc58bdc7 TO IDX_TRANSFER_TO');
        $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX uniq_27e49c9abdf6aadf TO UNIQ_TRANSFER_INCOMING');
        $this->addSql('ALTER TABLE inccom_transfer RENAME INDEX uniq_27e49c9ab29c5d53 TO UNIQ_TRANSFER_OUTGOING');
    }
}
