<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201219203313 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE crop DROP FOREIGN KEY FK_EDC23D9B62F62D90');
        $this->addSql('ALTER TABLE crop DROP FOREIGN KEY FK_EDC23D9B863EBD0A');
        $this->addSql('ALTER TABLE crop ADD CONSTRAINT FK_EDC23D9B62F62D90 FOREIGN KEY (croper_type_id) REFERENCES crop_er_type (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE crop ADD CONSTRAINT FK_EDC23D9B863EBD0A FOREIGN KEY (crop_type_id) REFERENCES crop_type (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE data DROP FOREIGN KEY FK_ADF3F3634DFD750C');
        $this->addSql('ALTER TABLE data CHANGE record_id record_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE data ADD CONSTRAINT FK_ADF3F3634DFD750C FOREIGN KEY (record_id) REFERENCES record (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE locality DROP FOREIGN KEY FK_E1D6B8E632C8A3DE');
        $this->addSql('ALTER TABLE locality ADD CONSTRAINT FK_E1D6B8E632C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE operation DROP FOREIGN KEY FK_1981A66D668D0C5E');
        $this->addSql('ALTER TABLE operation CHANGE operation_type_id operation_type_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE operation ADD CONSTRAINT FK_1981A66D668D0C5E FOREIGN KEY (operation_type_id) REFERENCES operation_type (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE phenomenon DROP FOREIGN KEY FK_2F24836A6C78085B');
        $this->addSql('ALTER TABLE phenomenon ADD CONSTRAINT FK_2F24836A6C78085B FOREIGN KEY (model_parameter_set_id) REFERENCES model (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F8943F85AAA');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F8943F85AAA FOREIGN KEY (soil_origin_locality_id) REFERENCES locality (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F911062E270');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F915247E50D');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F919EEDE593');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F911062E270 FOREIGN KEY (related_value_zunit_id) REFERENCES unit (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F915247E50D FOREIGN KEY (related_value_xunit_id) REFERENCES unit (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F919EEDE593 FOREIGN KEY (related_value_yunit_id) REFERENCES unit (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C043D4C368');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C074BB7406');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C09380E88E');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0AD5EAFCA');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0E587C814');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0F6E9C619');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C043D4C368 FOREIGN KEY (corg_assignment_type_id) REFERENCES assignment_type (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C074BB7406 FOREIGN KEY (soil_sample_bulk_id) REFERENCES soil_sample (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C09380E88E FOREIGN KEY (soil_sample_texture_id) REFERENCES soil_sample (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0AD5EAFCA FOREIGN KEY (bulk_assignment_type_id) REFERENCES assignment_type (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0E587C814 FOREIGN KEY (soil_sample_corg_id) REFERENCES soil_sample (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0F6E9C619 FOREIGN KEY (texture_assignment_type_id) REFERENCES assignment_type (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE run_group DROP FOREIGN KEY FK_515F5E4B98FB19AE');
        $this->addSql('ALTER TABLE run_group DROP FOREIGN KEY FK_515F5E4B9D2EFCB3');
        $this->addSql('ALTER TABLE run_group CHANGE run_type_id run_type_id INT DEFAULT NULL, CHANGE sequence_id sequence_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE run_group ADD CONSTRAINT FK_515F5E4B98FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE run_group ADD CONSTRAINT FK_515F5E4B9D2EFCB3 FOREIGN KEY (run_type_id) REFERENCES run_type (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72BE4D71D57');
        $this->addSql('ALTER TABLE sequence CHANGE simulator_id simulator_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE sequence ADD CONSTRAINT FK_5286D72BE4D71D57 FOREIGN KEY (simulator_id) REFERENCES simulator (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE simulator DROP FOREIGN KEY FK_81C34CA732C8A3DE');
        $this->addSql('ALTER TABLE simulator ADD CONSTRAINT FK_81C34CA732C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6680D0B01');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D684E3FEC4');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D688823A92');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D69A37EDDE');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6D15BAB48');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D684E3FEC4 FOREIGN KEY (run_id) REFERENCES run (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D688823A92 FOREIGN KEY (locality_id) REFERENCES locality (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D69A37EDDE FOREIGN KEY (processed_at_id) REFERENCES organization (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6D15BAB48 FOREIGN KEY (wrb_soil_class_id) REFERENCES wrb_soil_class (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE crop DROP FOREIGN KEY FK_EDC23D9B863EBD0A');
        $this->addSql('ALTER TABLE crop DROP FOREIGN KEY FK_EDC23D9B62F62D90');
        $this->addSql('ALTER TABLE crop ADD CONSTRAINT FK_EDC23D9B863EBD0A FOREIGN KEY (crop_type_id) REFERENCES crop_type (id)');
        $this->addSql('ALTER TABLE crop ADD CONSTRAINT FK_EDC23D9B62F62D90 FOREIGN KEY (croper_type_id) REFERENCES crop_er_type (id)');
        $this->addSql('ALTER TABLE data DROP FOREIGN KEY FK_ADF3F3634DFD750C');
        $this->addSql('ALTER TABLE data CHANGE record_id record_id INT NOT NULL');
        $this->addSql('ALTER TABLE data ADD CONSTRAINT FK_ADF3F3634DFD750C FOREIGN KEY (record_id) REFERENCES record (id)');
        $this->addSql('ALTER TABLE locality DROP FOREIGN KEY FK_E1D6B8E632C8A3DE');
        $this->addSql('ALTER TABLE locality ADD CONSTRAINT FK_E1D6B8E632C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE operation DROP FOREIGN KEY FK_1981A66D668D0C5E');
        $this->addSql('ALTER TABLE operation CHANGE operation_type_id operation_type_id INT NOT NULL');
        $this->addSql('ALTER TABLE operation ADD CONSTRAINT FK_1981A66D668D0C5E FOREIGN KEY (operation_type_id) REFERENCES operation_type (id)');
        $this->addSql('ALTER TABLE phenomenon DROP FOREIGN KEY FK_2F24836A6C78085B');
        $this->addSql('ALTER TABLE phenomenon ADD CONSTRAINT FK_2F24836A6C78085B FOREIGN KEY (model_parameter_set_id) REFERENCES model (id)');
        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F8943F85AAA');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F8943F85AAA FOREIGN KEY (soil_origin_locality_id) REFERENCES locality (id)');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F915247E50D');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F919EEDE593');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F911062E270');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F915247E50D FOREIGN KEY (related_value_xunit_id) REFERENCES unit (id)');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F919EEDE593 FOREIGN KEY (related_value_yunit_id) REFERENCES unit (id)');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F911062E270 FOREIGN KEY (related_value_zunit_id) REFERENCES unit (id)');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C074BB7406');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0AD5EAFCA');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C09380E88E');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0F6E9C619');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0E587C814');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C043D4C368');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C074BB7406 FOREIGN KEY (soil_sample_bulk_id) REFERENCES soil_sample (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0AD5EAFCA FOREIGN KEY (bulk_assignment_type_id) REFERENCES assignment_type (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C09380E88E FOREIGN KEY (soil_sample_texture_id) REFERENCES soil_sample (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0F6E9C619 FOREIGN KEY (texture_assignment_type_id) REFERENCES assignment_type (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0E587C814 FOREIGN KEY (soil_sample_corg_id) REFERENCES soil_sample (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C043D4C368 FOREIGN KEY (corg_assignment_type_id) REFERENCES assignment_type (id)');
        $this->addSql('ALTER TABLE run_group DROP FOREIGN KEY FK_515F5E4B9D2EFCB3');
        $this->addSql('ALTER TABLE run_group DROP FOREIGN KEY FK_515F5E4B98FB19AE');
        $this->addSql('ALTER TABLE run_group CHANGE run_type_id run_type_id INT NOT NULL, CHANGE sequence_id sequence_id INT NOT NULL');
        $this->addSql('ALTER TABLE run_group ADD CONSTRAINT FK_515F5E4B9D2EFCB3 FOREIGN KEY (run_type_id) REFERENCES run_type (id)');
        $this->addSql('ALTER TABLE run_group ADD CONSTRAINT FK_515F5E4B98FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id)');
        $this->addSql('ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72BE4D71D57');
        $this->addSql('ALTER TABLE sequence CHANGE simulator_id simulator_id INT NOT NULL');
        $this->addSql('ALTER TABLE sequence ADD CONSTRAINT FK_5286D72BE4D71D57 FOREIGN KEY (simulator_id) REFERENCES simulator (id)');
        $this->addSql('ALTER TABLE simulator DROP FOREIGN KEY FK_81C34CA732C8A3DE');
        $this->addSql('ALTER TABLE simulator ADD CONSTRAINT FK_81C34CA732C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D69A37EDDE');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6680D0B01');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D6D15BAB48');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D688823A92');
        $this->addSql('ALTER TABLE soil_sample DROP FOREIGN KEY FK_CE7B16D684E3FEC4');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D69A37EDDE FOREIGN KEY (processed_at_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D6D15BAB48 FOREIGN KEY (wrb_soil_class_id) REFERENCES wrb_soil_class (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D688823A92 FOREIGN KEY (locality_id) REFERENCES locality (id)');
        $this->addSql('ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D684E3FEC4 FOREIGN KEY (run_id) REFERENCES run (id)');
    }
}
