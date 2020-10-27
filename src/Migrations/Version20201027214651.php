<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201027214651 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE run ADD run_group_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0C5629BFF FOREIGN KEY (run_group_id) REFERENCES run_group (id)');
        $this->addSql('CREATE INDEX IDX_5076A4C0C5629BFF ON run (run_group_id)');
        $this->addSql('UPDATE run SET run_group_id=id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0C5629BFF');
        $this->addSql('DROP INDEX IDX_5076A4C0C5629BFF ON run');
        $this->addSql('ALTER TABLE run DROP run_group_id');
    }
}
