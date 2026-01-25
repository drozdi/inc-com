<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260125104233 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_category ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_category ADD CONSTRAINT FK_619C269B7E3C61F9 FOREIGN KEY (owner_id) REFERENCES main_user (id) ON DELETE SET NULL');
        $this->addSql('CREATE INDEX IDX_619C269B7E3C61F9 ON inccom_category (owner_id)');
        $this->addSql('ALTER TABLE inccom_transaction ADD loaded TINYINT(1) NOT NULL, CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance NUMERIC(16, 2) DEFAULT \'0.00\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_category DROP FOREIGN KEY FK_619C269B7E3C61F9');
        $this->addSql('DROP INDEX IDX_619C269B7E3C61F9 ON inccom_category');
        $this->addSql('ALTER TABLE inccom_category DROP owner_id');
        $this->addSql('ALTER TABLE inccom_transaction DROP loaded, CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0.00\' NOT NULL');
    }
}
