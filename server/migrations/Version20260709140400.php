<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260709140400 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Phase 1.4: Item (Product) — user instead of transaction, description, unit, M2M categories';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_product ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_product ADD description LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_product ADD unit VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE inccom_product ADD created_at DATETIME DEFAULT NULL');
        $this->addSql('UPDATE inccom_product SET created_at = x_timestamp WHERE created_at IS NULL AND x_timestamp IS NOT NULL');
        $this->addSql('UPDATE inccom_product p INNER JOIN inccom_product_tag pt ON pt.product_id = p.id SET p.user_id = pt.user_id WHERE p.user_id IS NULL AND pt.user_id IS NOT NULL');
        $this->addSql('UPDATE inccom_product p INNER JOIN inccom_account a ON p.transaction_id = a.id SET p.user_id = a.owner_id WHERE p.user_id IS NULL AND a.owner_id IS NOT NULL');

        $this->addSql('ALTER TABLE inccom_product DROP FOREIGN KEY FK_DE3F92362FC0CB0F');
        $this->addSql('DROP INDEX IDX_DE3F92362FC0CB0F ON inccom_product');
        $this->addSql('ALTER TABLE inccom_product DROP transaction_id, DROP amount, DROP comment');

        $this->addSql('CREATE TABLE inccom_item_item_category (item_id INT NOT NULL, item_category_id INT NOT NULL, INDEX IDX_ITEM_CATEGORY_ITEM (item_id), INDEX IDX_ITEM_CATEGORY_CAT (item_category_id), PRIMARY KEY(item_id, item_category_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE inccom_item_item_category ADD CONSTRAINT FK_ITEM_CATEGORY_ITEM FOREIGN KEY (item_id) REFERENCES inccom_product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inccom_item_item_category ADD CONSTRAINT FK_ITEM_CATEGORY_CAT FOREIGN KEY (item_category_id) REFERENCES inccom_tag (id) ON DELETE CASCADE');
        $this->addSql('INSERT IGNORE INTO inccom_item_item_category (item_id, item_category_id) SELECT product_id, tag_id FROM inccom_product_tag WHERE tag_id IS NOT NULL');

        $this->addSql('UPDATE inccom_product p INNER JOIN (SELECT user_id, label, MIN(id) AS keep_id FROM inccom_product WHERE user_id IS NOT NULL GROUP BY user_id, label HAVING COUNT(*) > 1) d ON p.user_id = d.user_id AND p.label = d.label AND p.id <> d.keep_id SET p.label = CONCAT(p.label, \' #\', p.id)');

        $this->addSql('ALTER TABLE inccom_product ADD CONSTRAINT FK_DE3F9236A76ED395 FOREIGN KEY (user_id) REFERENCES main_user (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_DE3F9236A76ED395 ON inccom_product (user_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_item_user_name ON inccom_product (user_id, label)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE inccom_item_item_category DROP FOREIGN KEY FK_ITEM_CATEGORY_ITEM');
        $this->addSql('ALTER TABLE inccom_item_item_category DROP FOREIGN KEY FK_ITEM_CATEGORY_CAT');
        $this->addSql('DROP TABLE inccom_item_item_category');

        $this->addSql('ALTER TABLE inccom_product DROP FOREIGN KEY FK_DE3F9236A76ED395');
        $this->addSql('DROP INDEX IDX_DE3F9236A76ED395 ON inccom_product');
        $this->addSql('DROP INDEX uniq_item_user_name ON inccom_product');

        $this->addSql('ALTER TABLE inccom_product ADD transaction_id INT DEFAULT NULL, ADD amount INT DEFAULT 0 NOT NULL, ADD comment LONGTEXT DEFAULT NULL');
        $this->addSql('CREATE INDEX IDX_DE3F92362FC0CB0F ON inccom_product (transaction_id)');
        $this->addSql('ALTER TABLE inccom_product ADD CONSTRAINT FK_DE3F92362FC0CB0F FOREIGN KEY (transaction_id) REFERENCES inccom_account (id)');

        $this->addSql('ALTER TABLE inccom_product DROP user_id');
        $this->addSql('ALTER TABLE inccom_product DROP description');
        $this->addSql('ALTER TABLE inccom_product DROP unit');
        $this->addSql('ALTER TABLE inccom_product DROP created_at');
    }
}
