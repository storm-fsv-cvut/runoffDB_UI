<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210121201137 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE protection_measures (id INT AUTO_INCREMENT NOT NULL, name_cz VARCHAR(255) DEFAULT NULL, name_en VARCHAR(255) DEFAULT NULL, description_cz LONGTEXT DEFAULT NULL, description_en LONGTEXT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE quality_index ADD name_cz VARCHAR(255) DEFAULT NULL, ADD name_en VARCHAR(255) DEFAULT NULL, ADD description_cz LONGTEXT DEFAULT NULL, ADD description_en LONGTEXT DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE protection_measures');
        $this->addSql('ALTER TABLE quality_index DROP name_cz, DROP name_en, DROP description_cz, DROP description_en');
    }
}
