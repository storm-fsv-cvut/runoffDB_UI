<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201102193125 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72B680D0B01');
        $this->addSql('DROP INDEX IDX_5286D72B680D0B01 ON sequence');
        $this->addSql('ALTER TABLE sequence DROP plot_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE sequence ADD plot_id INT NOT NULL');
        $this->addSql('ALTER TABLE sequence ADD CONSTRAINT FK_5286D72B680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id)');
        $this->addSql('CREATE INDEX IDX_5286D72B680D0B01 ON sequence (plot_id)');
    }
}
