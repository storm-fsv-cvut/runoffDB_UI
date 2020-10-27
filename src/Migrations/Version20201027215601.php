<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201027215601 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C098FB19AE');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C09D2EFCB3');
        $this->addSql('DROP INDEX IDX_5076A4C098FB19AE ON run');
        $this->addSql('DROP INDEX IDX_5076A4C09D2EFCB3 ON run');
        $this->addSql('ALTER TABLE run DROP sequence_id, DROP run_type_id, DROP preceding_precipitation');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE run ADD sequence_id INT NOT NULL, ADD run_type_id INT NOT NULL, ADD preceding_precipitation DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C098FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C09D2EFCB3 FOREIGN KEY (run_type_id) REFERENCES run_type (id)');
        $this->addSql('CREATE INDEX IDX_5076A4C098FB19AE ON run (sequence_id)');
        $this->addSql('CREATE INDEX IDX_5076A4C09D2EFCB3 ON run (run_type_id)');
    }
}
