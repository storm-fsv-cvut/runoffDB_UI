<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201004112625 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE texture_data DROP FOREIGN KEY FK_C441A551204BC3AC');
        $this->addSql('DROP TABLE texture');
        $this->addSql('DROP TABLE texture_data');
        $this->addSql('ALTER TABLE measurement ADD plot_id INT DEFAULT NULL, ADD locality_id INT DEFAULT NULL, ADD date DATE DEFAULT NULL');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D811680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id)');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D81188823A92 FOREIGN KEY (locality_id) REFERENCES locality (id)');
        $this->addSql('CREATE INDEX IDX_2CE0D811680D0B01 ON measurement (plot_id)');
        $this->addSql('CREATE INDEX IDX_2CE0D81188823A92 ON measurement (locality_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE texture (id INT AUTO_INCREMENT NOT NULL, date_processed DATE NOT NULL, description_cz VARCHAR(512) DEFAULT NULL COLLATE utf8mb4_unicode_ci, description_en VARCHAR(512) DEFAULT NULL COLLATE utf8mb4_unicode_ci, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE texture_data (id INT AUTO_INCREMENT NOT NULL, texture_id INT NOT NULL, up_class_limit DOUBLE PRECISION NOT NULL, mass DOUBLE PRECISION NOT NULL, cumul_mass DOUBLE PRECISION NOT NULL, INDEX IDX_C441A551204BC3AC (texture_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE texture_data ADD CONSTRAINT FK_C441A551204BC3AC FOREIGN KEY (texture_id) REFERENCES texture (id)');
        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D811680D0B01');
        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D81188823A92');
        $this->addSql('DROP INDEX IDX_2CE0D811680D0B01 ON measurement');
        $this->addSql('DROP INDEX IDX_2CE0D81188823A92 ON measurement');
        $this->addSql('ALTER TABLE measurement DROP plot_id, DROP locality_id, DROP date');
    }
}
