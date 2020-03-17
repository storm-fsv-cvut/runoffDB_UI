<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200307212906 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C031D372FA');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C065701CFD');
        $this->addSql('DROP INDEX IDX_5076A4C031D372FA ON run');
        $this->addSql('DROP INDEX IDX_5076A4C065701CFD ON run');
        $this->addSql('ALTER TABLE run ADD rain_intensity_mesurement_id INT DEFAULT NULL, ADD init_moisture_mesurement_id INT DEFAULT NULL, DROP rain_intensity_measurement_id, DROP init_moisture_measurement_id');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C072491D85 FOREIGN KEY (rain_intensity_mesurement_id) REFERENCES measurement (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0F703373 FOREIGN KEY (init_moisture_mesurement_id) REFERENCES measurement (id) ON DELETE SET NULL');
        $this->addSql('CREATE INDEX IDX_5076A4C072491D85 ON run (rain_intensity_mesurement_id)');
        $this->addSql('CREATE INDEX IDX_5076A4C0F703373 ON run (init_moisture_mesurement_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C072491D85');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0F703373');
        $this->addSql('DROP INDEX IDX_5076A4C072491D85 ON run');
        $this->addSql('DROP INDEX IDX_5076A4C0F703373 ON run');
        $this->addSql('ALTER TABLE run ADD rain_intensity_measurement_id INT DEFAULT NULL, ADD init_moisture_measurement_id INT DEFAULT NULL, DROP rain_intensity_mesurement_id, DROP init_moisture_mesurement_id');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C031D372FA FOREIGN KEY (init_moisture_measurement_id) REFERENCES measurement (id)');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C065701CFD FOREIGN KEY (rain_intensity_measurement_id) REFERENCES measurement (id)');
        $this->addSql('CREATE INDEX IDX_5076A4C031D372FA ON run (init_moisture_measurement_id)');
        $this->addSql('CREATE INDEX IDX_5076A4C065701CFD ON run (rain_intensity_measurement_id)');
    }
}
