<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201019210847 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE run_group (id INT AUTO_INCREMENT NOT NULL, run_type_id INT NOT NULL, sequence_id INT NOT NULL, datetime DATETIME NOT NULL, preceding_precipitation DOUBLE PRECISION DEFAULT NULL, note_cz LONGTEXT NOT NULL, note_en LONGTEXT DEFAULT NULL, INDEX IDX_515F5E4B9D2EFCB3 (run_type_id), INDEX IDX_515F5E4B98FB19AE (sequence_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE run_group ADD CONSTRAINT FK_515F5E4B9D2EFCB3 FOREIGN KEY (run_type_id) REFERENCES run_type (id)');
        $this->addSql('ALTER TABLE run_group ADD CONSTRAINT FK_515F5E4B98FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id)');
        $this->addSql('INSERT INTO run_group SELECT id,run_type_id,sequence_id,datetime,preceding_precipitation,"","" FROM run');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE run_group');
    }
}
