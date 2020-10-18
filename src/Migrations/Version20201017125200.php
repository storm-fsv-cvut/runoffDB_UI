<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201017125200 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D657165454');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6627354BE');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6A9F3404');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6FEF5B8B');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D657165454 FOREIGN KEY (moisture_id) REFERENCES record (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6627354BE FOREIGN KEY (corg_id) REFERENCES record (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6A9F3404 FOREIGN KEY (texture_record_id) REFERENCES record (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6FEF5B8B FOREIGN KEY (bulk_density_id) REFERENCES record (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6627354BE');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6FEF5B8B');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D657165454');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6A9F3404');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6627354BE FOREIGN KEY (corg_id) REFERENCES record (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6FEF5B8B FOREIGN KEY (bulk_density_id) REFERENCES record (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D657165454 FOREIGN KEY (moisture_id) REFERENCES record (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6A9F3404 FOREIGN KEY (texture_record_id) REFERENCES record (id)');
    }
}
