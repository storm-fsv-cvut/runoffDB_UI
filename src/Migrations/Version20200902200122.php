<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200902200122 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE locality DROP FOREIGN KEY FK_E1D6B8E6976039CC');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6976039CC');
        $this->addSql('CREATE TABLE model (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) DEFAULT NULL, description_cz VARCHAR(1024) DEFAULT NULL, description_en VARCHAR(1024) DEFAULT NULL, homepage VARCHAR(255) DEFAULT NULL, reference VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE wrb_soil_class (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, code VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('DROP TABLE wrbsoil_class');
        $this->addSql('ALTER TABLE agrotechnology ADD note_cz VARCHAR(500) DEFAULT NULL, ADD note_en VARCHAR(500) DEFAULT NULL');
        $this->addSql('DROP INDEX IDX_E1D6B8E6976039CC ON locality');
        $this->addSql('ALTER TABLE locality CHANGE w_rbsoil_class_id wrb_soil_class_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE locality ADD CONSTRAINT FK_E1D6B8E6D15BAB48 FOREIGN KEY (wrb_soil_class_id) REFERENCES wrb_soil_class (id)');
        $this->addSql('CREATE INDEX IDX_E1D6B8E6D15BAB48 ON locality (wrb_soil_class_id)');
        $this->addSql('ALTER TABLE measurement ADD is_timeline TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C02731F598');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C090F5C057');
        $this->addSql('DROP INDEX IDX_5076A4C090F5C057 ON run');
        $this->addSql('DROP INDEX IDX_5076A4C02731F598 ON run');
        $this->addSql('ALTER TABLE run ADD soil_sample_corg_id INT DEFAULT NULL, ADD corg_assignment_type_id INT DEFAULT NULL, DROP soil_sample_corq_id, DROP corq_assignment_type_id');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0E587C814 FOREIGN KEY (soil_sample_corg_id) REFERENCES soil_sample (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C043D4C368 FOREIGN KEY (corg_assignment_type_id) REFERENCES assignment_type (id)');
        $this->addSql('CREATE INDEX IDX_5076A4C0E587C814 ON run (soil_sample_corg_id)');
        $this->addSql('CREATE INDEX IDX_5076A4C043D4C368 ON run (corg_assignment_type_id)');
        $this->addSql('DROP INDEX IDX_CE7B16D6976039CC ON soil_sample');
        $this->addSql('ALTER TABLE soil_sample CHANGE w_rbsoil_class_id wrb_soil_class_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6D15BAB48 FOREIGN KEY (wrb_soil_class_id) REFERENCES wrb_soil_class (id)');
        $this->addSql('CREATE INDEX IDX_CE7B16D6D15BAB48 ON soil_sample (wrb_soil_class_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE locality DROP FOREIGN KEY FK_E1D6B8E6D15BAB48');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6D15BAB48');
        $this->addSql('CREATE TABLE wrbsoil_class (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL COLLATE utf8mb4_unicode_ci, code VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('DROP TABLE model');
        $this->addSql('DROP TABLE wrb_soil_class');
        $this->addSql('ALTER TABLE agrotechnology DROP note_cz, DROP note_en');
        $this->addSql('DROP INDEX IDX_E1D6B8E6D15BAB48 ON locality');
        $this->addSql('ALTER TABLE locality CHANGE wrb_soil_class_id w_rbsoil_class_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE locality ADD CONSTRAINT FK_E1D6B8E6976039CC FOREIGN KEY (w_rbsoil_class_id) REFERENCES wrbsoil_class (id)');
        $this->addSql('CREATE INDEX IDX_E1D6B8E6976039CC ON locality (w_rbsoil_class_id)');
        $this->addSql('ALTER TABLE measurement DROP is_timeline');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0E587C814');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C043D4C368');
        $this->addSql('DROP INDEX IDX_5076A4C0E587C814 ON run');
        $this->addSql('DROP INDEX IDX_5076A4C043D4C368 ON run');
        $this->addSql('ALTER TABLE run ADD soil_sample_corq_id INT DEFAULT NULL, ADD corq_assignment_type_id INT DEFAULT NULL, DROP soil_sample_corg_id, DROP corg_assignment_type_id');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C02731F598 FOREIGN KEY (corq_assignment_type_id) REFERENCES assignment_type (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C090F5C057 FOREIGN KEY (soil_sample_corq_id) REFERENCES soil_sample (id)');
        $this->addSql('CREATE INDEX IDX_5076A4C090F5C057 ON run (soil_sample_corq_id)');
        $this->addSql('CREATE INDEX IDX_5076A4C02731F598 ON run (corq_assignment_type_id)');
        $this->addSql('DROP INDEX IDX_CE7B16D6D15BAB48 ON soil_sample');
        $this->addSql('ALTER TABLE soil_sample CHANGE wrb_soil_class_id w_rbsoil_class_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6976039CC FOREIGN KEY (w_rbsoil_class_id) REFERENCES wrbsoil_class (id)');
        $this->addSql('CREATE INDEX IDX_CE7B16D6976039CC ON soil_sample (w_rbsoil_class_id)');
    }
}
