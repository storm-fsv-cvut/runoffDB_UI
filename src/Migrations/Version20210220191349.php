<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210220191349 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE measurement ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D811A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_2CE0D811A76ED395 ON measurement (user_id)');
        $this->addSql('ALTER TABLE sequence ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE sequence ADD CONSTRAINT FK_5286D72BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_5286D72BA76ED395 ON sequence (user_id)');
        $this->addSql('ALTER TABLE soil_sample ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_CE7B16D6A76ED395 ON soil_sample (user_id)');
        $this->addSql('ALTER TABLE user ADD organization_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64932C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('CREATE INDEX IDX_8D93D64932C8A3DE ON user (organization_id)');

        $this->addSql('UPDATE measurement SET user_id=2');
        $this->addSql('UPDATE sequence SET user_id=2');
        $this->addSql('UPDATE soil_sample SET user_id=2');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D811A76ED395');
        $this->addSql('DROP INDEX IDX_2CE0D811A76ED395 ON measurement');
        $this->addSql('ALTER TABLE measurement DROP user_id');
        $this->addSql('ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72BA76ED395');
        $this->addSql('DROP INDEX IDX_5286D72BA76ED395 ON sequence');
        $this->addSql('ALTER TABLE sequence DROP user_id');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6A76ED395');
        $this->addSql('DROP INDEX IDX_CE7B16D6A76ED395 ON soil_sample');
        $this->addSql('ALTER TABLE soil_sample DROP user_id');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D64932C8A3DE');
        $this->addSql('DROP INDEX IDX_8D93D64932C8A3DE ON user');
        $this->addSql('ALTER TABLE user DROP organization_id');
    }
}
