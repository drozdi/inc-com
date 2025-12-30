<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251011183442 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE inccom_account (id INT AUTO_INCREMENT NOT NULL, owner_id INT DEFAULT NULL, x_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, sort INT DEFAULT 100 NOT NULL, label VARCHAR(255) NOT NULL, balance INT DEFAULT 0 NOT NULL, INDEX IDX_7043C03F7E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inccom_category (id INT AUTO_INCREMENT NOT NULL, account_id INT DEFAULT NULL, x_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, sort INT DEFAULT 100 NOT NULL, label VARCHAR(255) NOT NULL, INDEX IDX_619C269B9B6B5FBA (account_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inccom_product (id INT AUTO_INCREMENT NOT NULL, transaction_id INT DEFAULT NULL, product_category_id INT DEFAULT NULL, x_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, label VARCHAR(255) NOT NULL, amount INT DEFAULT 0 NOT NULL, comment LONGTEXT DEFAULT NULL, INDEX IDX_DE3F92362FC0CB0F (transaction_id), INDEX IDX_DE3F9236BE6903FD (product_category_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inccom_product_category (id INT AUTO_INCREMENT NOT NULL, parent_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, x_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, sort INT DEFAULT 100 NOT NULL, label VARCHAR(255) NOT NULL, `level` INT DEFAULT 0 NOT NULL, INDEX IDX_6E1DFE91727ACA70 (parent_id), INDEX IDX_6E1DFE917E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inccom_transaction (id INT AUTO_INCREMENT NOT NULL, account_id INT DEFAULT NULL, category_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, link_id INT DEFAULT NULL, x_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, date DATETIME NOT NULL, amount INT DEFAULT 0 NOT NULL, comment LONGTEXT DEFAULT NULL, INDEX IDX_CD1156389B6B5FBA (account_id), INDEX IDX_CD11563812469DE2 (category_id), INDEX IDX_CD1156387E3C61F9 (owner_id), INDEX IDX_CD115638ADA40271 (link_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE main_claimant (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, code VARCHAR(191) NOT NULL, UNIQUE INDEX UNIQ_D5B7FBD377153098 (code), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE main_file (id INT AUTO_INCREMENT NOT NULL, created_by INT DEFAULT NULL, modified_by INT DEFAULT NULL, x_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, date_upload DATETIME NOT NULL, module VARCHAR(255) NOT NULL, width INT DEFAULT 0 NOT NULL, height INT DEFAULT 0 NOT NULL, file_size int(18) NOT NULL, content_type VARCHAR(255) NOT NULL, sub_dir VARCHAR(255) NOT NULL, file_name VARCHAR(255) NOT NULL, original_name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, external_id VARCHAR(191) DEFAULT NULL, UNIQUE INDEX UNIQ_6C2C04729F75D7B0 (external_id), INDEX IDX_6C2C0472DE12AB56 (created_by), INDEX IDX_6C2C047225F94802 (modified_by), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE main_group (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, ou_id INT DEFAULT NULL, parent_id INT DEFAULT NULL, x_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, anonymous TINYINT(1) DEFAULT 0 NOT NULL, active TINYINT(1) DEFAULT 1 NOT NULL, active_from DATETIME DEFAULT NULL, active_to DATETIME DEFAULT NULL, sort INT DEFAULT 100 NOT NULL, `level` INT DEFAULT 0 NOT NULL, name VARCHAR(255) NOT NULL, code VARCHAR(191) NOT NULL, description LONGTEXT DEFAULT NULL, UNIQUE INDEX UNIQ_CE9CF78377153098 (code), INDEX IDX_CE9CF783A76ED395 (user_id), INDEX IDX_CE9CF78318A15B0D (ou_id), INDEX IDX_CE9CF783727ACA70 (parent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE main_group_access (id INT AUTO_INCREMENT NOT NULL, group_id INT DEFAULT NULL, claimant_id INT DEFAULT NULL, `level` INT DEFAULT 0 NOT NULL, INDEX IDX_CC57463DFE54D947 (group_id), INDEX IDX_CC57463D9F409843 (claimant_id), UNIQUE INDEX UNIQ_CC57463DFE54D9479F409843 (group_id, claimant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE main_ou (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, x_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, code VARCHAR(191) NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, is_tutors TINYINT(1) DEFAULT 0 NOT NULL, sort INT DEFAULT 100 NOT NULL, UNIQUE INDEX UNIQ_5E9420FE77153098 (code), INDEX IDX_5E9420FEA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE main_role (id INT AUTO_INCREMENT NOT NULL, claimant_id INT DEFAULT NULL, code VARCHAR(191) NOT NULL, level INT DEFAULT 0 NOT NULL, INDEX IDX_B7DAB8089F409843 (claimant_id), UNIQUE INDEX UNIQ_B7DAB808771530989F409843 (code, claimant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE main_stored_auth (id INT AUTO_INCREMENT NOT NULL, date_reg DATETIME NOT NULL, last_auth DATETIME NOT NULL, stored_hash VARCHAR(32) NOT NULL, temp_hash TINYINT(1) DEFAULT 1 NOT NULL, ip_addr TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE main_user (id INT AUTO_INCREMENT NOT NULL, parent_id INT DEFAULT NULL, ou_id INT DEFAULT NULL, login VARCHAR(191) NOT NULL, x_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, date_register DATETIME DEFAULT NULL, last_login DATETIME DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, last_ip VARCHAR(40) DEFAULT NULL, active TINYINT(1) DEFAULT 1 NOT NULL, loocked TINYINT(1) DEFAULT 0 NOT NULL, phone VARCHAR(255) DEFAULT NULL, active_from DATETIME DEFAULT NULL, active_to DATETIME DEFAULT NULL, alias VARCHAR(255) DEFAULT NULL, first_name VARCHAR(255) DEFAULT NULL, second_name VARCHAR(255) DEFAULT NULL, patronymic VARCHAR(255) DEFAULT NULL, description LONGTEXT DEFAULT NULL, stored_hash VARCHAR(32) DEFAULT NULL, checkword VARCHAR(32) DEFAULT NULL, password VARCHAR(255) DEFAULT NULL, salt VARCHAR(255) DEFAULT NULL, gender VARCHAR(1) DEFAULT \'N\', login_attempts INT DEFAULT 0 NOT NULL, country VARCHAR(10) DEFAULT \'RU\' NOT NULL, roles JSON NOT NULL, options JSON NOT NULL, UNIQUE INDEX UNIQ_6D20E42BAA08CB10 (login), UNIQUE INDEX UNIQ_6D20E42B9E1EB3D4 (stored_hash), UNIQUE INDEX UNIQ_6D20E42BDB50E026 (checkword), INDEX IDX_6D20E42B727ACA70 (parent_id), INDEX IDX_6D20E42B18A15B0D (ou_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE main_user_access (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, claimant_id INT DEFAULT NULL, level INT DEFAULT 0 NOT NULL, INDEX IDX_B7B8F8FFA76ED395 (user_id), INDEX IDX_B7B8F8FF9F409843 (claimant_id), UNIQUE INDEX UNIQ_B7B8F8FFA76ED3959F409843 (user_id, claimant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE main_user_group (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, group_id INT NOT NULL, active_from DATETIME DEFAULT NULL, active_to DATETIME DEFAULT NULL, INDEX IDX_B7FACBFEA76ED395 (user_id), INDEX IDX_B7FACBFEFE54D947 (group_id), UNIQUE INDEX UNIQ_B7FACBFEA76ED395FE54D947 (user_id, group_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE inccom_account ADD CONSTRAINT FK_7043C03F7E3C61F9 FOREIGN KEY (owner_id) REFERENCES main_user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE inccom_category ADD CONSTRAINT FK_619C269B9B6B5FBA FOREIGN KEY (account_id) REFERENCES inccom_account (id)');
        $this->addSql('ALTER TABLE inccom_product ADD CONSTRAINT FK_DE3F92362FC0CB0F FOREIGN KEY (transaction_id) REFERENCES inccom_account (id)');
        $this->addSql('ALTER TABLE inccom_product ADD CONSTRAINT FK_DE3F9236BE6903FD FOREIGN KEY (product_category_id) REFERENCES inccom_product_category (id)');
        $this->addSql('ALTER TABLE inccom_product_category ADD CONSTRAINT FK_6E1DFE91727ACA70 FOREIGN KEY (parent_id) REFERENCES inccom_product_category (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE inccom_product_category ADD CONSTRAINT FK_6E1DFE917E3C61F9 FOREIGN KEY (owner_id) REFERENCES inccom_account (id)');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_CD1156389B6B5FBA FOREIGN KEY (account_id) REFERENCES inccom_account (id)');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_CD11563812469DE2 FOREIGN KEY (category_id) REFERENCES inccom_category (id)');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_CD1156387E3C61F9 FOREIGN KEY (owner_id) REFERENCES main_user (id)');
        $this->addSql('ALTER TABLE inccom_transaction ADD CONSTRAINT FK_CD115638ADA40271 FOREIGN KEY (link_id) REFERENCES inccom_transaction (id)');
        $this->addSql('ALTER TABLE main_file ADD CONSTRAINT FK_6C2C0472DE12AB56 FOREIGN KEY (created_by) REFERENCES main_user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE main_file ADD CONSTRAINT FK_6C2C047225F94802 FOREIGN KEY (modified_by) REFERENCES main_user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE main_group ADD CONSTRAINT FK_CE9CF783A76ED395 FOREIGN KEY (user_id) REFERENCES main_user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE main_group ADD CONSTRAINT FK_CE9CF78318A15B0D FOREIGN KEY (ou_id) REFERENCES main_ou (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE main_group ADD CONSTRAINT FK_CE9CF783727ACA70 FOREIGN KEY (parent_id) REFERENCES main_group (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE main_group_access ADD CONSTRAINT FK_CC57463DFE54D947 FOREIGN KEY (group_id) REFERENCES main_group (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE main_group_access ADD CONSTRAINT FK_CC57463D9F409843 FOREIGN KEY (claimant_id) REFERENCES main_claimant (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE main_ou ADD CONSTRAINT FK_5E9420FEA76ED395 FOREIGN KEY (user_id) REFERENCES main_user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE main_role ADD CONSTRAINT FK_B7DAB8089F409843 FOREIGN KEY (claimant_id) REFERENCES main_claimant (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE main_user ADD CONSTRAINT FK_6D20E42B727ACA70 FOREIGN KEY (parent_id) REFERENCES main_user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE main_user ADD CONSTRAINT FK_6D20E42B18A15B0D FOREIGN KEY (ou_id) REFERENCES main_ou (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE main_user_access ADD CONSTRAINT FK_B7B8F8FFA76ED395 FOREIGN KEY (user_id) REFERENCES main_user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE main_user_access ADD CONSTRAINT FK_B7B8F8FF9F409843 FOREIGN KEY (claimant_id) REFERENCES main_claimant (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE main_user_group ADD CONSTRAINT FK_B7FACBFEA76ED395 FOREIGN KEY (user_id) REFERENCES main_user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE main_user_group ADD CONSTRAINT FK_B7FACBFEFE54D947 FOREIGN KEY (group_id) REFERENCES main_group (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_account DROP FOREIGN KEY FK_7043C03F7E3C61F9');
        $this->addSql('ALTER TABLE inccom_category DROP FOREIGN KEY FK_619C269B9B6B5FBA');
        $this->addSql('ALTER TABLE inccom_product DROP FOREIGN KEY FK_DE3F92362FC0CB0F');
        $this->addSql('ALTER TABLE inccom_product DROP FOREIGN KEY FK_DE3F9236BE6903FD');
        $this->addSql('ALTER TABLE inccom_product_category DROP FOREIGN KEY FK_6E1DFE91727ACA70');
        $this->addSql('ALTER TABLE inccom_product_category DROP FOREIGN KEY FK_6E1DFE917E3C61F9');
        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_CD1156389B6B5FBA');
        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_CD11563812469DE2');
        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_CD1156387E3C61F9');
        $this->addSql('ALTER TABLE inccom_transaction DROP FOREIGN KEY FK_CD115638ADA40271');
        $this->addSql('ALTER TABLE main_file DROP FOREIGN KEY FK_6C2C0472DE12AB56');
        $this->addSql('ALTER TABLE main_file DROP FOREIGN KEY FK_6C2C047225F94802');
        $this->addSql('ALTER TABLE main_group DROP FOREIGN KEY FK_CE9CF783A76ED395');
        $this->addSql('ALTER TABLE main_group DROP FOREIGN KEY FK_CE9CF78318A15B0D');
        $this->addSql('ALTER TABLE main_group DROP FOREIGN KEY FK_CE9CF783727ACA70');
        $this->addSql('ALTER TABLE main_group_access DROP FOREIGN KEY FK_CC57463DFE54D947');
        $this->addSql('ALTER TABLE main_group_access DROP FOREIGN KEY FK_CC57463D9F409843');
        $this->addSql('ALTER TABLE main_ou DROP FOREIGN KEY FK_5E9420FEA76ED395');
        $this->addSql('ALTER TABLE main_role DROP FOREIGN KEY FK_B7DAB8089F409843');
        $this->addSql('ALTER TABLE main_user DROP FOREIGN KEY FK_6D20E42B727ACA70');
        $this->addSql('ALTER TABLE main_user DROP FOREIGN KEY FK_6D20E42B18A15B0D');
        $this->addSql('ALTER TABLE main_user_access DROP FOREIGN KEY FK_B7B8F8FFA76ED395');
        $this->addSql('ALTER TABLE main_user_access DROP FOREIGN KEY FK_B7B8F8FF9F409843');
        $this->addSql('ALTER TABLE main_user_group DROP FOREIGN KEY FK_B7FACBFEA76ED395');
        $this->addSql('ALTER TABLE main_user_group DROP FOREIGN KEY FK_B7FACBFEFE54D947');
        $this->addSql('DROP TABLE inccom_account');
        $this->addSql('DROP TABLE inccom_category');
        $this->addSql('DROP TABLE inccom_product');
        $this->addSql('DROP TABLE inccom_product_category');
        $this->addSql('DROP TABLE inccom_transaction');
        $this->addSql('DROP TABLE main_claimant');
        $this->addSql('DROP TABLE main_file');
        $this->addSql('DROP TABLE main_group');
        $this->addSql('DROP TABLE main_group_access');
        $this->addSql('DROP TABLE main_ou');
        $this->addSql('DROP TABLE main_role');
        $this->addSql('DROP TABLE main_stored_auth');
        $this->addSql('DROP TABLE main_user');
        $this->addSql('DROP TABLE main_user_access');
        $this->addSql('DROP TABLE main_user_group');
    }
}
