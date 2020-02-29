<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200229111035 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE texture_data DROP FOREIGN KEY FK_C441A551340A911F');
        $this->addSql('DROP INDEX IDX_C441A551340A911F ON texture_data');
        $this->addSql('ALTER TABLE texture_data DROP soil_sample_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE texture_data ADD soil_sample_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE texture_data ADD CONSTRAINT FK_C441A551340A911F FOREIGN KEY (soil_sample_id) REFERENCES soil_sample (id)');
        $this->addSql('CREATE INDEX IDX_C441A551340A911F ON texture_data (soil_sample_id)');
    }
}
