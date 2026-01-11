<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260107120116 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_tag DROP FOREIGN KEY FK_494593CC7E3C61F9');
        $this->addSql('ALTER TABLE inccom_tag ADD CONSTRAINT FK_494593CC7E3C61F9 FOREIGN KEY (owner_id) REFERENCES main_user (id)');
        $this->addSql('ALTER TABLE inccom_transaction CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance NUMERIC(16, 2) DEFAULT \'0.00\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_tag DROP FOREIGN KEY FK_494593CC7E3C61F9');
        $this->addSql('ALTER TABLE inccom_tag ADD CONSTRAINT FK_494593CC7E3C61F9 FOREIGN KEY (owner_id) REFERENCES inccom_account (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE inccom_transaction CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0.00\' NOT NULL');
    }
}
