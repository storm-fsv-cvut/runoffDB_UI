<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190313205000 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE agrotechnology (id INT AUTO_INCREMENT NOT NULL, description_cz VARCHAR(255) NOT NULL, description_en VARCHAR(255) NOT NULL, operation_sequence VARCHAR(100) DEFAULT NULL, note VARCHAR(500) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE operation (id INT AUTO_INCREMENT NOT NULL, operation_intensity_id INT NOT NULL, operation_type_id INT NOT NULL, name_cz VARCHAR(50) NOT NULL, name_en VARCHAR(50) NOT NULL, operation_depth_m DOUBLE PRECISION NOT NULL, note VARCHAR(500) DEFAULT NULL, INDEX IDX_1981A66D783ED65B (operation_intensity_id), INDEX IDX_1981A66D668D0C5E (operation_type_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE operation_intensity (id INT AUTO_INCREMENT NOT NULL, description_cz VARCHAR(255) NOT NULL, description_en VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE operation_type (id INT AUTO_INCREMENT NOT NULL, name_cz VARCHAR(50) NOT NULL, name_en VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE plot (id INT AUTO_INCREMENT NOT NULL, locality_id INT DEFAULT NULL, crop_id INT NOT NULL, agrotechnology_id INT DEFAULT NULL, name VARCHAR(128) NOT NULL, established DATE NOT NULL, plot_width DOUBLE PRECISION NOT NULL, plot_length DOUBLE PRECISION NOT NULL, plot_slope DOUBLE PRECISION NOT NULL, note VARCHAR(500) DEFAULT NULL, INDEX IDX_BEBB8F8988823A92 (locality_id), INDEX IDX_BEBB8F89888579EE (crop_id), INDEX IDX_BEBB8F89C0C6DA01 (agrotechnology_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE soil_sample (id INT AUTO_INCREMENT NOT NULL, texture_id INT DEFAULT NULL, plot_id INT DEFAULT NULL, soil_type_id INT DEFAULT NULL, locality_id INT DEFAULT NULL, date_sampled DATE NOT NULL, processed_at VARCHAR(50) NOT NULL, corg DOUBLE PRECISION DEFAULT NULL, bulk_density DOUBLE PRECISION DEFAULT NULL, sample_location VARCHAR(500) DEFAULT NULL, moisture_gkg DOUBLE PRECISION DEFAULT NULL, note VARCHAR(500) DEFAULT NULL, INDEX IDX_CE7B16D6204BC3AC (texture_id), INDEX IDX_CE7B16D6680D0B01 (plot_id), INDEX IDX_CE7B16D6A8AE1818 (soil_type_id), INDEX IDX_CE7B16D688823A92 (locality_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE texture (id INT AUTO_INCREMENT NOT NULL, date_processed DATE NOT NULL, class_ka4 VARCHAR(50) NOT NULL, class_wrb VARCHAR(50) NOT NULL, class_novak VARCHAR(50) NOT NULL, texture_record VARCHAR(50) NOT NULL, note VARCHAR(500) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE operation ADD CONSTRAINT FK_1981A66D783ED65B FOREIGN KEY (operation_intensity_id) REFERENCES operation_intensity (id)');
        $this->addSql('ALTER TABLE operation ADD CONSTRAINT FK_1981A66D668D0C5E FOREIGN KEY (operation_type_id) REFERENCES operation_type (id)');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F8988823A92 FOREIGN KEY (locality_id) REFERENCES locality (id)');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F89888579EE FOREIGN KEY (crop_id) REFERENCES crop (id)');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F89C0C6DA01 FOREIGN KEY (agrotechnology_id) REFERENCES agrotechnology (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6204BC3AC FOREIGN KEY (texture_id) REFERENCES texture (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6A8AE1818 FOREIGN KEY (soil_type_id) REFERENCES soil_type (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D688823A92 FOREIGN KEY (locality_id) REFERENCES locality (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F89C0C6DA01');
        $this->addSql('ALTER TABLE operation DROP FOREIGN KEY FK_1981A66D783ED65B');
        $this->addSql('ALTER TABLE operation DROP FOREIGN KEY FK_1981A66D668D0C5E');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6680D0B01');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6204BC3AC');
        $this->addSql('DROP TABLE agrotechnology');
        $this->addSql('DROP TABLE operation');
        $this->addSql('DROP TABLE operation_intensity');
        $this->addSql('DROP TABLE operation_type');
        $this->addSql('DROP TABLE plot');
        $this->addSql('DROP TABLE soil_sample');
        $this->addSql('DROP TABLE texture');
    }
}
