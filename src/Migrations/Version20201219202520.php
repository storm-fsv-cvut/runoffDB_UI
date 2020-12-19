<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201219202520 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE tillage_sequence DROP FOREIGN KEY FK_865871EB44AC3583');
        $this->addSql('ALTER TABLE tillage_sequence DROP FOREIGN KEY FK_865871EBC0C6DA01');
        $this->addSql('ALTER TABLE tillage_sequence CHANGE agrotechnology_id agrotechnology_id INT DEFAULT NULL, CHANGE operation_id operation_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE tillage_sequence ADD CONSTRAINT FK_865871EB44AC3583 FOREIGN KEY (operation_id) REFERENCES operation (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE tillage_sequence ADD CONSTRAINT FK_865871EBC0C6DA01 FOREIGN KEY (agrotechnology_id) REFERENCES agrotechnology (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE tillage_sequence DROP FOREIGN KEY FK_865871EBC0C6DA01');
        $this->addSql('ALTER TABLE tillage_sequence DROP FOREIGN KEY FK_865871EB44AC3583');
        $this->addSql('ALTER TABLE tillage_sequence CHANGE agrotechnology_id agrotechnology_id INT NOT NULL, CHANGE operation_id operation_id INT NOT NULL');
        $this->addSql('ALTER TABLE tillage_sequence ADD CONSTRAINT FK_865871EBC0C6DA01 FOREIGN KEY (agrotechnology_id) REFERENCES agrotechnology (id)');
        $this->addSql('ALTER TABLE tillage_sequence ADD CONSTRAINT FK_865871EB44AC3583 FOREIGN KEY (operation_id) REFERENCES operation (id)');
    }
}
