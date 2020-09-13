<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200628203304 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6204BC3AC');
        $this->addSql('DROP INDEX IDX_CE7B16D6204BC3AC ON soil_sample');
        $this->addSql('ALTER TABLE soil_sample DROP texture_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE soil_sample ADD texture_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6204BC3AC FOREIGN KEY (texture_id) REFERENCES texture (id)');
        $this->addSql('CREATE INDEX IDX_CE7B16D6204BC3AC ON soil_sample (texture_id)');
    }
}
