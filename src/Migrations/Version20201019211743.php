<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201019211743 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE measurement_run (measurement_id INT NOT NULL, run_id INT NOT NULL, INDEX IDX_1A847647924EA134 (measurement_id), INDEX IDX_1A84764784E3FEC4 (run_id), PRIMARY KEY(measurement_id, run_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE measurement_run ADD CONSTRAINT FK_1A847647924EA134 FOREIGN KEY (measurement_id) REFERENCES measurement (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE measurement_run ADD CONSTRAINT FK_1A84764784E3FEC4 FOREIGN KEY (run_id) REFERENCES run (id) ON DELETE CASCADE');
        $this->addSql('INSERT INTO measurement_run SELECT id, run_id FROM measurement WHERE run_id IS NOT NULL');
        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D81184E3FEC4');
        $this->addSql('DROP INDEX IDX_2CE0D81184E3FEC4 ON measurement');
        $this->addSql('ALTER TABLE measurement DROP run_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE measurement_run');
        $this->addSql('ALTER TABLE measurement ADD run_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D81184E3FEC4 FOREIGN KEY (run_id) REFERENCES run (id)');
        $this->addSql('CREATE INDEX IDX_2CE0D81184E3FEC4 ON measurement (run_id)');
    }
}
