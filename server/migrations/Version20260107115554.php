<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260107115554 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_product DROP FOREIGN KEY FK_DE3F9236BE6903FD');
        $this->addSql('CREATE TABLE inccom_product_tag (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, product_id INT DEFAULT NULL, INDEX IDX_5C80B075A76ED395 (user_id), INDEX IDX_5C80B0754584665A (product_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inccom_tag (id INT AUTO_INCREMENT NOT NULL, parent_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, x_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, sort INT DEFAULT 100 NOT NULL, label VARCHAR(255) NOT NULL, `level` INT DEFAULT 0 NOT NULL, INDEX IDX_494593CC727ACA70 (parent_id), INDEX IDX_494593CC7E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE inccom_product_tag ADD CONSTRAINT FK_5C80B075A76ED395 FOREIGN KEY (user_id) REFERENCES main_user (id)');
        $this->addSql('ALTER TABLE inccom_product_tag ADD CONSTRAINT FK_5C80B0754584665A FOREIGN KEY (product_id) REFERENCES inccom_product (id)');
        $this->addSql('ALTER TABLE inccom_tag ADD CONSTRAINT FK_494593CC727ACA70 FOREIGN KEY (parent_id) REFERENCES inccom_tag (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE inccom_tag ADD CONSTRAINT FK_494593CC7E3C61F9 FOREIGN KEY (owner_id) REFERENCES inccom_account (id)');
        $this->addSql('ALTER TABLE inccom_product_category DROP FOREIGN KEY FK_6E1DFE91727ACA70');
        $this->addSql('ALTER TABLE inccom_product_category DROP FOREIGN KEY FK_6E1DFE917E3C61F9');
        $this->addSql('DROP TABLE inccom_product_category');
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
        $this->addSql('DROP INDEX IDX_DE3F9236BE6903FD ON inccom_product');
        $this->addSql('ALTER TABLE inccom_product DROP product_category_id');
        $this->addSql('ALTER TABLE inccom_transaction CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE inccom_product_category (id INT AUTO_INCREMENT NOT NULL, parent_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, x_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, sort INT DEFAULT 100 NOT NULL, label VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, level INT DEFAULT 0 NOT NULL, INDEX IDX_6E1DFE91727ACA70 (parent_id), INDEX IDX_6E1DFE917E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE inccom_product_category ADD CONSTRAINT FK_6E1DFE91727ACA70 FOREIGN KEY (parent_id) REFERENCES inccom_product_category (id) ON UPDATE NO ACTION ON DELETE SET NULL');
        $this->addSql('ALTER TABLE inccom_product_category ADD CONSTRAINT FK_6E1DFE917E3C61F9 FOREIGN KEY (owner_id) REFERENCES inccom_account (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE inccom_product_tag DROP FOREIGN KEY FK_5C80B075A76ED395');
        $this->addSql('ALTER TABLE inccom_product_tag DROP FOREIGN KEY FK_5C80B0754584665A');
        $this->addSql('ALTER TABLE inccom_tag DROP FOREIGN KEY FK_494593CC727ACA70');
        $this->addSql('ALTER TABLE inccom_tag DROP FOREIGN KEY FK_494593CC7E3C61F9');
        $this->addSql('DROP TABLE inccom_product_tag');
        $this->addSql('DROP TABLE inccom_tag');
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance INT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE inccom_transaction CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0.00\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_product ADD product_category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_product ADD CONSTRAINT FK_DE3F9236BE6903FD FOREIGN KEY (product_category_id) REFERENCES inccom_product_category (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_DE3F9236BE6903FD ON inccom_product (product_category_id)');
    }
}
