<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260709140300 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Phase 1.3: ItemCategory (Tag) — add keywords, created_at; drop sort, level';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_tag ADD keywords LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_tag ADD created_at DATETIME DEFAULT NULL');
        $this->addSql('UPDATE inccom_tag SET created_at = x_timestamp WHERE created_at IS NULL AND x_timestamp IS NOT NULL');
        $this->addSql('ALTER TABLE inccom_tag DROP sort');
        $this->addSql('ALTER TABLE inccom_tag DROP `level`');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_tag ADD sort INT DEFAULT 100 NOT NULL');
        $this->addSql('ALTER TABLE inccom_tag ADD `level` INT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE inccom_tag DROP keywords');
        $this->addSql('ALTER TABLE inccom_tag DROP created_at');
    }
}
