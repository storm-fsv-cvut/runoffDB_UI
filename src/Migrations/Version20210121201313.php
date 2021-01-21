<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210121201313 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE protection_measures');
        $this->addSql('ALTER TABLE protection_measure ADD name_cz VARCHAR(255) DEFAULT NULL, ADD name_en VARCHAR(255) DEFAULT NULL, ADD description_cz LONGTEXT DEFAULT NULL, ADD description_en LONGTEXT DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE protection_measures (id INT AUTO_INCREMENT NOT NULL, name_cz VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, name_en VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, description_cz LONGTEXT DEFAULT NULL COLLATE utf8mb4_unicode_ci, description_en LONGTEXT DEFAULT NULL COLLATE utf8mb4_unicode_ci, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE protection_measure DROP name_cz, DROP name_en, DROP description_cz, DROP description_en');
    }
}
