<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260129183029 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_category ADD type VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE inccom_transaction CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance NUMERIC(16, 2) DEFAULT \'0.00\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_category DROP type');
        $this->addSql('ALTER TABLE inccom_transaction CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0.00\' NOT NULL');
    }
}
