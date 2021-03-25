<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210315223319 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE data CHANGE record_id record_id INT NOT NULL');
        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D811680D0B01');
        $this->addSql('ALTER TABLE measurement DROP is_timeline');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D811680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F91F8BD700D');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F91F8BD700D FOREIGN KEY (unit_id) REFERENCES unit (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE data CHANGE record_id record_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE measurement DROP FOREIGN KEY FK_2CE0D811680D0B01');
        $this->addSql('ALTER TABLE measurement ADD is_timeline TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D811680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id)');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F91F8BD700D');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F91F8BD700D FOREIGN KEY (unit_id) REFERENCES unit (id) ON DELETE SET NULL');
    }
}
