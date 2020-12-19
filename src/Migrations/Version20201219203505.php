<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201219203505 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D81188823A92');
        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D811FACA4B0');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D81188823A92 FOREIGN KEY (locality_id) REFERENCES locality (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D811FACA4B0 FOREIGN KEY (phenomenon_id) REFERENCES phenomenon (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D811FACA4B0');
        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D81188823A92');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D811FACA4B0 FOREIGN KEY (phenomenon_id) REFERENCES phenomenon (id)');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D81188823A92 FOREIGN KEY (locality_id) REFERENCES locality (id)');
    }
}
