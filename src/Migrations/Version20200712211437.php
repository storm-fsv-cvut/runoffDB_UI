<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200712211437 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE measurement ADD phenomenon_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D811FACA4B0 FOREIGN KEY (phenomenon_id) REFERENCES phenomenon (id)');
        $this->addSql('CREATE INDEX IDX_2CE0D811FACA4B0 ON measurement (phenomenon_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D811FACA4B0');
        $this->addSql('DROP INDEX IDX_2CE0D811FACA4B0 ON measurement');
        $this->addSql('ALTER TABLE measurement DROP phenomenon_id');
    }
}
