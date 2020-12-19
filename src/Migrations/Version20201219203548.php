<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201219203548 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F8988823A92');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F8988823A92 FOREIGN KEY (locality_id) REFERENCES locality (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F8988823A92');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F8988823A92 FOREIGN KEY (locality_id) REFERENCES locality (id)');
    }
}
