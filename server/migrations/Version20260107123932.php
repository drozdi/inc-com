<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260107123932 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_product_tag ADD tag_id INT NOT NULL');
        $this->addSql('ALTER TABLE inccom_product_tag ADD CONSTRAINT FK_5C80B075BAD26311 FOREIGN KEY (tag_id) REFERENCES inccom_tag (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_5C80B075BAD26311 ON inccom_product_tag (tag_id)');
        $this->addSql('ALTER TABLE inccom_transaction CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inccom_product_tag DROP FOREIGN KEY FK_5C80B075BAD26311');
        $this->addSql('DROP INDEX IDX_5C80B075BAD26311 ON inccom_product_tag');
        $this->addSql('ALTER TABLE inccom_product_tag DROP tag_id');
        $this->addSql('ALTER TABLE inccom_account CHANGE balance balance NUMERIC(16, 2) DEFAULT \'0.00\' NOT NULL');
        $this->addSql('ALTER TABLE inccom_transaction CHANGE amount amount NUMERIC(16, 2) DEFAULT \'0.00\' NOT NULL');
    }
}
