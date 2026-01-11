<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260107125930 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_category DROP FOREIGN KEY FK_619C269B9B6B5FBA');
        $this->addSql('ALTER TABLE inccom_category ADD CONSTRAINT FK_619C269B9B6B5FBA FOREIGN KEY (account_id) REFERENCES inccom_account (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inccom_product_tag DROP FOREIGN KEY FK_5C80B0754584665A');
        $this->addSql('ALTER TABLE inccom_product_tag DROP FOREIGN KEY FK_5C80B075A76ED395');
        $this->addSql('ALTER TABLE inccom_product_tag CHANGE tag_id tag_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_product_tag ADD CONSTRAINT FK_5C80B0754584665A FOREIGN KEY (product_id) REFERENCES inccom_product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inccom_product_tag ADD CONSTRAINT FK_5C80B075A76ED395 FOREIGN KEY (user_id) REFERENCES main_user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inccom_tag DROP FOREIGN KEY FK_494593CC7E3C61F9');
        $this->addSql('ALTER TABLE inccom_tag ADD CONSTRAINT FK_494593CC7E3C61F9 FOREIGN KEY (owner_id) REFERENCES main_user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_CD11563812469DE2');
        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_CD1156387E3C61F9');
        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_CD115638ADA40271');
        $this->addSql('ALTER TABLE inccom_transaction CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_CD11563812469DE2 FOREIGN KEY (category_id) REFERENCES inccom_category (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_CD1156387E3C61F9 FOREIGN KEY (owner_id) REFERENCES main_user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_CD115638ADA40271 FOREIGN KEY (link_id) REFERENCES inccom_transaction (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_category DROP FOREIGN KEY FK_619C269B9B6B5FBA');
        $this->addSql('ALTER TABLE inccom_category ADD CONSTRAINT FK_619C269B9B6B5FBA FOREIGN KEY (account_id) REFERENCES inccom_account (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_CD11563812469DE2');
        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_CD1156387E3C61F9');
        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_CD115638ADA40271');
        $this->addSql('ALTER TABLE inccom_transaction CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0.00\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_CD11563812469DE2 FOREIGN KEY (category_id) REFERENCES inccom_category (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_CD1156387E3C61F9 FOREIGN KEY (owner_id) REFERENCES main_user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_CD115638ADA40271 FOREIGN KEY (link_id) REFERENCES inccom_transaction (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance NUMERIC(16, 2) DEFAULT \'0.00\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_tag DROP FOREIGN KEY FK_494593CC7E3C61F9');
        $this->addSql('ALTER TABLE inccom_tag ADD CONSTRAINT FK_494593CC7E3C61F9 FOREIGN KEY (owner_id) REFERENCES main_user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE inccom_product_tag DROP FOREIGN KEY FK_5C80B075A76ED395');
        $this->addSql('ALTER TABLE inccom_product_tag DROP FOREIGN KEY FK_5C80B0754584665A');
        $this->addSql('ALTER TABLE inccom_product_tag CHANGE tag_id tag_id INT NOT NULL');
        $this->addSql('ALTER TABLE inccom_product_tag ADD CONSTRAINT FK_5C80B075A76ED395 FOREIGN KEY (user_id) REFERENCES main_user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE inccom_product_tag ADD CONSTRAINT FK_5C80B0754584665A FOREIGN KEY (product_id) REFERENCES inccom_product (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
