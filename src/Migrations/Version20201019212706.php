<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201019212706 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE measurement_soil_sample (measurement_id INT NOT NULL, soil_sample_id INT NOT NULL, INDEX IDX_E1C07083924EA134 (measurement_id), INDEX IDX_E1C07083340A911F (soil_sample_id), PRIMARY KEY(measurement_id, soil_sample_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE measurement_soil_sample ADD CONSTRAINT FK_E1C07083924EA134 FOREIGN KEY (measurement_id) REFERENCES measurement (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE measurement_soil_sample ADD CONSTRAINT FK_E1C07083340A911F FOREIGN KEY (soil_sample_id) REFERENCES soil_sample (id) ON DELETE CASCADE');
        $this->addSql('INSERT INTO measurement_soil_sample SELECT id, soil_sample_id FROM measurement WHERE soil_sample_id IS NOT NULL');
        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D811340A911F');
        $this->addSql('DROP INDEX IDX_2CE0D811340A911F ON measurement');
        $this->addSql('ALTER TABLE measurement DROP soil_sample_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE measurement_soil_sample');
        $this->addSql('ALTER TABLE measurement ADD soil_sample_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D811340A911F FOREIGN KEY (soil_sample_id) REFERENCES soil_sample (id)');
        $this->addSql('CREATE INDEX IDX_2CE0D811340A911F ON measurement (soil_sample_id)');
    }
}
