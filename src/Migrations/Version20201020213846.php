<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201020213846 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE run ADD plot_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id)');
        $this->addSql('CREATE INDEX IDX_5076A4C0680D0B01 ON run (plot_id)');
        $this->addSql('UPDATE run JOIN sequence ON (sequence.id=run.sequence_id) SET run.plot_id=sequence.plot_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0680D0B01');
        $this->addSql('DROP INDEX IDX_5076A4C0680D0B01 ON run');
        $this->addSql('ALTER TABLE run DROP plot_id');
    }
}
