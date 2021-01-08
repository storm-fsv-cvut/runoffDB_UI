<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210108103046 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE cms CHANGE locale language VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F8988823A92');
        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F89888579EE');
        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F89C0C6DA01');
        $this->addSql('ALTER TABLE plot CHANGE crop_id crop_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F8988823A92 FOREIGN KEY (locality_id) REFERENCES locality (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F89888579EE FOREIGN KEY (crop_id) REFERENCES crop (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F89C0C6DA01 FOREIGN KEY (agrotechnology_id) REFERENCES agrotechnology (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F9172938CEE');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F91924EA134');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F91F8BD700D');
        $this->addSql('ALTER TABLE record CHANGE measurement_id measurement_id INT DEFAULT NULL, CHANGE record_type_id record_type_id INT DEFAULT NULL, CHANGE unit_id unit_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F9172938CEE FOREIGN KEY (record_type_id) REFERENCES record_type (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F91924EA134 FOREIGN KEY (measurement_id) REFERENCES measurement (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F91F8BD700D FOREIGN KEY (unit_id) REFERENCES unit (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0680D0B01');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE cms CHANGE language locale VARCHAR(255) NOT NULL COLLATE utf8mb4_unicode_ci');
        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F8988823A92');
        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F89888579EE');
        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F89C0C6DA01');
        $this->addSql('ALTER TABLE plot CHANGE crop_id crop_id INT NOT NULL');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F8988823A92 FOREIGN KEY (locality_id) REFERENCES locality (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F89888579EE FOREIGN KEY (crop_id) REFERENCES crop (id)');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F89C0C6DA01 FOREIGN KEY (agrotechnology_id) REFERENCES agrotechnology (id)');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F91924EA134');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F9172938CEE');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F91F8BD700D');
        $this->addSql('ALTER TABLE record CHANGE measurement_id measurement_id INT NOT NULL, CHANGE record_type_id record_type_id INT NOT NULL, CHANGE unit_id unit_id INT NOT NULL');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F91924EA134 FOREIGN KEY (measurement_id) REFERENCES measurement (id)');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F9172938CEE FOREIGN KEY (record_type_id) REFERENCES record_type (id)');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F91F8BD700D FOREIGN KEY (unit_id) REFERENCES unit (id)');
        $this->addSql('ALTER TABLE run DROP FOREIGN KEY FK_5076A4C0680D0B01');
        $this->addSql('ALTER TABLE run ADD CONSTRAINT FK_5076A4C0680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id)');
    }
}
