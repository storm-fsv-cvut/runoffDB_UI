<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201207204036 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE phenomenon ADD model_parameter_set_id INT DEFAULT NULL, DROP model_parameter_set');
        $this->addSql('ALTER TABLE phenomenon ADD CONSTRAINT FK_2F24836A6C78085B FOREIGN KEY (model_parameter_set_id) REFERENCES model (id)');
        $this->addSql('CREATE INDEX IDX_2F24836A6C78085B ON phenomenon (model_parameter_set_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE phenomenon DROP FOREIGN KEY FK_2F24836A6C78085B');
        $this->addSql('DROP INDEX IDX_2F24836A6C78085B ON phenomenon');
        $this->addSql('ALTER TABLE phenomenon ADD model_parameter_set VARCHAR(255) DEFAULT NULL COLLATE utf8mb4_unicode_ci, DROP model_parameter_set_id');
    }
}
