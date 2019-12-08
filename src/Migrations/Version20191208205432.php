<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20191208205432 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE agrotechnology (id INT AUTO_INCREMENT NOT NULL, name_cz VARCHAR(255) DEFAULT NULL, name_en VARCHAR(255) DEFAULT NULL, description_cz VARCHAR(255) NOT NULL, description_en VARCHAR(255) NOT NULL, note VARCHAR(500) DEFAULT NULL, manag_typ VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE assignment_type (id INT AUTO_INCREMENT NOT NULL, description_cz VARCHAR(255) DEFAULT NULL, description_en VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE crop (id INT AUTO_INCREMENT NOT NULL, crop_type_id INT DEFAULT NULL, croper_type_id INT DEFAULT NULL, name_cz VARCHAR(50) NOT NULL, name_en VARCHAR(50) DEFAULT NULL, variety VARCHAR(100) DEFAULT NULL, is_catch_crop TINYINT(1) DEFAULT NULL, description_cz VARCHAR(255) DEFAULT NULL, description_en VARCHAR(255) DEFAULT NULL, INDEX IDX_EDC23D9B863EBD0A (crop_type_id), INDEX IDX_EDC23D9B62F62D90 (croper_type_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE crop_er_type (id INT AUTO_INCREMENT NOT NULL, name_cz VARCHAR(255) DEFAULT NULL, name_en VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE crop_type (id INT AUTO_INCREMENT NOT NULL, name_cz VARCHAR(50) NOT NULL, name_en VARCHAR(50) DEFAULT NULL, description_cz VARCHAR(255) DEFAULT NULL, description_en VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE data (id INT AUTO_INCREMENT NOT NULL, dimension_unit_id INT DEFAULT NULL, time TIME DEFAULT NULL, dimension_value VARCHAR(255) DEFAULT NULL, value VARCHAR(255) NOT NULL, INDEX IDX_ADF3F3634AB4B20B (dimension_unit_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE locality (id INT AUTO_INCREMENT NOT NULL, organization_id INT DEFAULT NULL, w_rbsoil_class_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, lat DOUBLE PRECISION NOT NULL, lng DOUBLE PRECISION NOT NULL, description_cz VARCHAR(512) DEFAULT NULL, description_en VARCHAR(512) DEFAULT NULL, INDEX IDX_E1D6B8E632C8A3DE (organization_id), INDEX IDX_E1D6B8E6976039CC (w_rbsoil_class_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE measurement (id INT AUTO_INCREMENT NOT NULL, run_id INT NOT NULL, model_id INT DEFAULT NULL, description_cz VARCHAR(255) DEFAULT NULL, description_en VARCHAR(255) DEFAULT NULL, note_cz VARCHAR(255) DEFAULT NULL, note_en VARCHAR(255) DEFAULT NULL, INDEX IDX_2CE0D81184E3FEC4 (run_id), INDEX IDX_2CE0D8117975B7E7 (model_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE model (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE operation (id INT AUTO_INCREMENT NOT NULL, operation_intensity_id INT NOT NULL, operation_type_id INT NOT NULL, name_cz VARCHAR(50) NOT NULL, name_en VARCHAR(50) NOT NULL, operation_depth_m DOUBLE PRECISION NOT NULL, description_cz VARCHAR(512) DEFAULT NULL, description_en VARCHAR(512) DEFAULT NULL, INDEX IDX_1981A66D783ED65B (operation_intensity_id), INDEX IDX_1981A66D668D0C5E (operation_type_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE operation_intensity (id INT AUTO_INCREMENT NOT NULL, description_cz VARCHAR(255) NOT NULL, description_en VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE operation_type (id INT AUTO_INCREMENT NOT NULL, description_cz VARCHAR(512) DEFAULT NULL, description_en VARCHAR(512) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE organization (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, contact_person VARCHAR(255) DEFAULT NULL, contact_number VARCHAR(10) DEFAULT NULL, contact_email VARCHAR(50) DEFAULT NULL, name_code VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE plot (id INT AUTO_INCREMENT NOT NULL, locality_id INT DEFAULT NULL, soil_origin_locality_id INT DEFAULT NULL, crop_id INT NOT NULL, agrotechnology_id INT DEFAULT NULL, name VARCHAR(128) NOT NULL, established DATE NOT NULL, plot_width DOUBLE PRECISION NOT NULL, plot_length DOUBLE PRECISION NOT NULL, plot_slope DOUBLE PRECISION NOT NULL, note_cz VARCHAR(512) DEFAULT NULL, note_en VARCHAR(512) DEFAULT NULL, INDEX IDX_BEBB8F8988823A92 (locality_id), INDEX IDX_BEBB8F8943F85AAA (soil_origin_locality_id), INDEX IDX_BEBB8F89888579EE (crop_id), INDEX IDX_BEBB8F89C0C6DA01 (agrotechnology_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project (id INT AUTO_INCREMENT NOT NULL, project_name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE project_sequence (project_id INT NOT NULL, sequence_id INT NOT NULL, INDEX IDX_6FC85CF0166D1F9C (project_id), INDEX IDX_6FC85CF098FB19AE (sequence_id), PRIMARY KEY(project_id, sequence_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE record (id INT AUTO_INCREMENT NOT NULL, measurement_id INT NOT NULL, value_id INT NOT NULL, record_type_id INT NOT NULL, note_cz VARCHAR(255) DEFAULT NULL, note_en VARCHAR(255) DEFAULT NULL, INDEX IDX_9B349F91924EA134 (measurement_id), INDEX IDX_9B349F91F920BBA2 (value_id), INDEX IDX_9B349F9172938CEE (record_type_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE record_type (id INT AUTO_INCREMENT NOT NULL, name_cz VARCHAR(255) DEFAULT NULL, name_en VARCHAR(255) DEFAULT NULL, description_en VARCHAR(255) DEFAULT NULL, description_cz VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE run (id INT AUTO_INCREMENT NOT NULL, sequence_id INT NOT NULL, run_type_id INT NOT NULL, soil_sample_bulk_id INT DEFAULT NULL, bulk_assignment_type_id INT DEFAULT NULL, soil_sample_texture_id INT DEFAULT NULL, texture_assignment_type_id INT DEFAULT NULL, soil_sample_corq_id INT DEFAULT NULL, corq_assignment_type_id INT DEFAULT NULL, rain_intensity_measurement_id INT DEFAULT NULL, datetime DATETIME NOT NULL, init_moisture INT DEFAULT NULL, preceding_precipitation DOUBLE PRECISION NOT NULL, runoff_start TIME NOT NULL, crop_pictures VARCHAR(255) DEFAULT NULL, plot_pictures VARCHAR(255) DEFAULT NULL, raw_data_path VARCHAR(255) DEFAULT NULL, note_cz VARCHAR(255) DEFAULT NULL, note_en VARCHAR(255) DEFAULT NULL, INDEX IDX_5076A4C098FB19AE (sequence_id), INDEX IDX_5076A4C09D2EFCB3 (run_type_id), INDEX IDX_5076A4C074BB7406 (soil_sample_bulk_id), INDEX IDX_5076A4C0AD5EAFCA (bulk_assignment_type_id), INDEX IDX_5076A4C09380E88E (soil_sample_texture_id), INDEX IDX_5076A4C0F6E9C619 (texture_assignment_type_id), INDEX IDX_5076A4C090F5C057 (soil_sample_corq_id), INDEX IDX_5076A4C02731F598 (corq_assignment_type_id), INDEX IDX_5076A4C065701CFD (rain_intensity_measurement_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE run_type (id INT AUTO_INCREMENT NOT NULL, name_cz VARCHAR(255) DEFAULT NULL, name_en VARCHAR(255) DEFAULT NULL, description_cz VARCHAR(255) DEFAULT NULL, description_en VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sequence (id INT AUTO_INCREMENT NOT NULL, simulator_id INT NOT NULL, plot_id INT NOT NULL, date DATE NOT NULL, crop_bbch INT DEFAULT NULL, canopy_cover INT DEFAULT NULL, crop_condition VARCHAR(255) DEFAULT NULL, INDEX IDX_5286D72BE4D71D57 (simulator_id), INDEX IDX_5286D72B680D0B01 (plot_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE simulator (id INT AUTO_INCREMENT NOT NULL, organization_id INT DEFAULT NULL, name_cz VARCHAR(255) DEFAULT NULL, name_en VARCHAR(255) DEFAULT NULL, description_cz VARCHAR(255) DEFAULT NULL, description_en VARCHAR(255) DEFAULT NULL, INDEX IDX_81C34CA732C8A3DE (organization_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE soil_sample (id INT AUTO_INCREMENT NOT NULL, processed_at_id INT DEFAULT NULL, texture_id INT DEFAULT NULL, plot_id INT DEFAULT NULL, w_rbsoil_class_id INT DEFAULT NULL, locality_id INT DEFAULT NULL, run_id INT DEFAULT NULL, date_sampled DATE NOT NULL, corg DOUBLE PRECISION DEFAULT NULL, bulk_density DOUBLE PRECISION DEFAULT NULL, sample_location VARCHAR(500) DEFAULT NULL, moisture_vperc DOUBLE PRECISION DEFAULT NULL, description_cz VARCHAR(512) DEFAULT NULL, description_en VARCHAR(512) DEFAULT NULL, sample_depth_m DOUBLE PRECISION DEFAULT NULL, INDEX IDX_CE7B16D69A37EDDE (processed_at_id), INDEX IDX_CE7B16D6204BC3AC (texture_id), INDEX IDX_CE7B16D6680D0B01 (plot_id), INDEX IDX_CE7B16D6976039CC (w_rbsoil_class_id), INDEX IDX_CE7B16D688823A92 (locality_id), INDEX IDX_CE7B16D684E3FEC4 (run_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE texture (id INT AUTO_INCREMENT NOT NULL, date_processed DATE NOT NULL, description_cz VARCHAR(512) DEFAULT NULL, description_en VARCHAR(512) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE texture_data (id INT AUTO_INCREMENT NOT NULL, texture_id INT NOT NULL, soil_sample_id INT DEFAULT NULL, up_class_limit DOUBLE PRECISION NOT NULL, mass DOUBLE PRECISION NOT NULL, cumul_mass DOUBLE PRECISION NOT NULL, INDEX IDX_C441A551204BC3AC (texture_id), INDEX IDX_C441A551340A911F (soil_sample_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tillage_sequence (id INT AUTO_INCREMENT NOT NULL, agrotechnology_id INT NOT NULL, operation_id INT NOT NULL, date DATE NOT NULL, INDEX IDX_865871EBC0C6DA01 (agrotechnology_id), INDEX IDX_865871EB44AC3583 (operation_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE timeline_data (id INT AUTO_INCREMENT NOT NULL, time TIME NOT NULL, value DOUBLE PRECISION NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE unit (id INT AUTO_INCREMENT NOT NULL, name_cz VARCHAR(255) DEFAULT NULL, name_en VARCHAR(255) DEFAULT NULL, unit VARCHAR(255) NOT NULL, description_cz VARCHAR(255) DEFAULT NULL, description_en VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, fullname VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE wrbsoil_class (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE crop ADD CONSTRAINT FK_EDC23D9B863EBD0A FOREIGN KEY (crop_type_id) REFERENCES crop_type (id)');
        $this->addSql('ALTER TABLE crop ADD CONSTRAINT FK_EDC23D9B62F62D90 FOREIGN KEY (croper_type_id) REFERENCES crop_er_type (id)');
        $this->addSql('ALTER TABLE data ADD CONSTRAINT FK_ADF3F3634AB4B20B FOREIGN KEY (dimension_unit_id) REFERENCES unit (id)');
        $this->addSql('ALTER TABLE locality ADD CONSTRAINT FK_E1D6B8E632C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE locality ADD CONSTRAINT FK_E1D6B8E6976039CC FOREIGN KEY (w_rbsoil_class_id) REFERENCES wrbsoil_class (id)');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D81184E3FEC4 FOREIGN KEY (run_id) REFERENCES run (id)');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D8117975B7E7 FOREIGN KEY (model_id) REFERENCES model (id)');
        $this->addSql('ALTER TABLE operation ADD CONSTRAINT FK_1981A66D783ED65B FOREIGN KEY (operation_intensity_id) REFERENCES operation_intensity (id)');
        $this->addSql('ALTER TABLE operation ADD CONSTRAINT FK_1981A66D668D0C5E FOREIGN KEY (operation_type_id) REFERENCES operation_type (id)');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F8988823A92 FOREIGN KEY (locality_id) REFERENCES locality (id)');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F8943F85AAA FOREIGN KEY (soil_origin_locality_id) REFERENCES locality (id)');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F89888579EE FOREIGN KEY (crop_id) REFERENCES crop (id)');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F89C0C6DA01 FOREIGN KEY (agrotechnology_id) REFERENCES agrotechnology (id)');
        $this->addSql('ALTER TABLE project_sequence ADD CONSTRAINT FK_6FC85CF0166D1F9C FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_sequence ADD CONSTRAINT FK_6FC85CF098FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F91924EA134 FOREIGN KEY (measurement_id) REFERENCES measurement (id)');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F91F920BBA2 FOREIGN KEY (value_id) REFERENCES unit (id)');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F9172938CEE FOREIGN KEY (record_type_id) REFERENCES record_type (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C098FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C09D2EFCB3 FOREIGN KEY (run_type_id) REFERENCES run_type (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C074BB7406 FOREIGN KEY (soil_sample_bulk_id) REFERENCES soil_sample (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0AD5EAFCA FOREIGN KEY (bulk_assignment_type_id) REFERENCES assignment_type (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C09380E88E FOREIGN KEY (soil_sample_texture_id) REFERENCES soil_sample (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0F6E9C619 FOREIGN KEY (texture_assignment_type_id) REFERENCES assignment_type (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C090F5C057 FOREIGN KEY (soil_sample_corq_id) REFERENCES soil_sample (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C02731F598 FOREIGN KEY (corq_assignment_type_id) REFERENCES assignment_type (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C065701CFD FOREIGN KEY (rain_intensity_measurement_id) REFERENCES measurement (id)');
        $this->addSql('ALTER TABLE sequence ADD CONSTRAINT FK_5286D72BE4D71D57 FOREIGN KEY (simulator_id) REFERENCES simulator (id)');
        $this->addSql('ALTER TABLE sequence ADD CONSTRAINT FK_5286D72B680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id)');
        $this->addSql('ALTER TABLE simulator ADD CONSTRAINT FK_81C34CA732C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D69A37EDDE FOREIGN KEY (processed_at_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6204BC3AC FOREIGN KEY (texture_id) REFERENCES texture (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6976039CC FOREIGN KEY (w_rbsoil_class_id) REFERENCES wrbsoil_class (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D688823A92 FOREIGN KEY (locality_id) REFERENCES locality (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D684E3FEC4 FOREIGN KEY (run_id) REFERENCES run (id)');
        $this->addSql('ALTER TABLE texture_data ADD CONSTRAINT FK_C441A551204BC3AC FOREIGN KEY (texture_id) REFERENCES texture (id)');
        $this->addSql('ALTER TABLE texture_data ADD CONSTRAINT FK_C441A551340A911F FOREIGN KEY (soil_sample_id) REFERENCES soil_sample (id)');
        $this->addSql('ALTER TABLE tillage_sequence ADD CONSTRAINT FK_865871EBC0C6DA01 FOREIGN KEY (agrotechnology_id) REFERENCES agrotechnology (id)');
        $this->addSql('ALTER TABLE tillage_sequence ADD CONSTRAINT FK_865871EB44AC3583 FOREIGN KEY (operation_id) REFERENCES operation (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F89C0C6DA01');
        $this->addSql('ALTER TABLE tillage_sequence DROP FOREIGN KEY FK_865871EBC0C6DA01');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0AD5EAFCA');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0F6E9C619');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C02731F598');
        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F89888579EE');
        $this->addSql('ALTER TABLE crop DROP FOREIGN KEY FK_EDC23D9B62F62D90');
        $this->addSql('ALTER TABLE crop DROP FOREIGN KEY FK_EDC23D9B863EBD0A');
        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F8988823A92');
        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F8943F85AAA');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D688823A92');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F91924EA134');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C065701CFD');
        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D8117975B7E7');
        $this->addSql('ALTER TABLE tillage_sequence DROP FOREIGN KEY FK_865871EB44AC3583');
        $this->addSql('ALTER TABLE operation DROP FOREIGN KEY FK_1981A66D783ED65B');
        $this->addSql('ALTER TABLE operation DROP FOREIGN KEY FK_1981A66D668D0C5E');
        $this->addSql('ALTER TABLE locality DROP FOREIGN KEY FK_E1D6B8E632C8A3DE');
        $this->addSql('ALTER TABLE simulator DROP FOREIGN KEY FK_81C34CA732C8A3DE');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D69A37EDDE');
        $this->addSql('ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72B680D0B01');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6680D0B01');
        $this->addSql('ALTER TABLE project_sequence DROP FOREIGN KEY FK_6FC85CF0166D1F9C');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F9172938CEE');
        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D81184E3FEC4');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D684E3FEC4');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C09D2EFCB3');
        $this->addSql('ALTER TABLE project_sequence DROP FOREIGN KEY FK_6FC85CF098FB19AE');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C098FB19AE');
        $this->addSql('ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72BE4D71D57');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C074BB7406');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C09380E88E');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C090F5C057');
        $this->addSql('ALTER TABLE texture_data DROP FOREIGN KEY FK_C441A551340A911F');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6204BC3AC');
        $this->addSql('ALTER TABLE texture_data DROP FOREIGN KEY FK_C441A551204BC3AC');
        $this->addSql('ALTER TABLE data DROP FOREIGN KEY FK_ADF3F3634AB4B20B');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F91F920BBA2');
        $this->addSql('ALTER TABLE locality DROP FOREIGN KEY FK_E1D6B8E6976039CC');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6976039CC');
        $this->addSql('DROP TABLE agrotechnology');
        $this->addSql('DROP TABLE assignment_type');
        $this->addSql('DROP TABLE crop');
        $this->addSql('DROP TABLE crop_er_type');
        $this->addSql('DROP TABLE crop_type');
        $this->addSql('DROP TABLE data');
        $this->addSql('DROP TABLE locality');
        $this->addSql('DROP TABLE measurement');
        $this->addSql('DROP TABLE model');
        $this->addSql('DROP TABLE operation');
        $this->addSql('DROP TABLE operation_intensity');
        $this->addSql('DROP TABLE operation_type');
        $this->addSql('DROP TABLE organization');
        $this->addSql('DROP TABLE plot');
        $this->addSql('DROP TABLE project');
        $this->addSql('DROP TABLE project_sequence');
        $this->addSql('DROP TABLE record');
        $this->addSql('DROP TABLE record_type');
        $this->addSql('DROP TABLE run');
        $this->addSql('DROP TABLE run_type');
        $this->addSql('DROP TABLE sequence');
        $this->addSql('DROP TABLE simulator');
        $this->addSql('DROP TABLE soil_sample');
        $this->addSql('DROP TABLE texture');
        $this->addSql('DROP TABLE texture_data');
        $this->addSql('DROP TABLE tillage_sequence');
        $this->addSql('DROP TABLE timeline_data');
        $this->addSql('DROP TABLE unit');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE wrbsoil_class');
    }
}
