<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201017124911 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72B9D3832BF');
        $this->addSql('ALTER TABLE sequence ADD CONSTRAINT FK_5286D72B9D3832BF FOREIGN KEY (surface_cover_id) REFERENCES record (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72B9D3832BF');
        $this->addSql('ALTER TABLE sequence ADD CONSTRAINT FK_5286D72B9D3832BF FOREIGN KEY (surface_cover_id) REFERENCES record (id)');
    }
}
