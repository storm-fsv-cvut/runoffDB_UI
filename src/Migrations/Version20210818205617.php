<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210818205617 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf(
            $this->connection->getDatabasePlatform()->getName() !== 'mysql',
            'Migration can only be executed safely on \'mysql\'.'
        );
        $this->addSql(
            'ALTER TABLE run ADD surface_cover_id INT DEFAULT NULL, ADD crop_bbch INT DEFAULT NULL, ADD crop_condition_cz VARCHAR(255) DEFAULT NULL, ADD crop_condition_en VARCHAR(255) DEFAULT NULL'
        );
        $this->addSql(
            'ALTER TABLE run ADD CONSTRAINT FK_5076A4C09D3832BF FOREIGN KEY (surface_cover_id) REFERENCES record (id) ON DELETE SET NULL'
        );
        $this->addSql('CREATE INDEX IDX_5076A4C09D3832BF ON run (surface_cover_id)');

        $this->addSql(
            'UPDATE run
    JOIN run_group ON (run_group.id = run.run_group_id)
    JOIN sequence ON (run_group.sequence_id = sequence.id)
    SET
    run.crop_condition_cz = sequence.crop_condition_cz,
    run.crop_condition_en = sequence.crop_condition_en,
    run.surface_cover_id = sequence.surface_cover_id,
    run.crop_bbch = sequence.crop_bbch'
        );

        $this->addSql('ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72B9D3832BF');
        $this->addSql('DROP INDEX IDX_5286D72B9D3832BF ON sequence');
        $this->addSql(
            'ALTER TABLE sequence DROP surface_cover_id, DROP crop_bbch, DROP crop_condition_cz, DROP crop_condition_en'
        );

    }

    public function down(Schema $schema): void
    {

    }
}
