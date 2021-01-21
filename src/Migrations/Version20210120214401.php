<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210120214401 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE protection_measure (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE quality_index (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE plot ADD protection_measure_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE plot ADD CONSTRAINT FK_BEBB8F892F01CFE FOREIGN KEY (protection_measure_id) REFERENCES protection_measure (id)');
        $this->addSql('CREATE INDEX IDX_BEBB8F892F01CFE ON plot (protection_measure_id)');
        $this->addSql('ALTER TABLE record ADD quality_index_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE record ADD CONSTRAINT FK_9B349F919053FA15 FOREIGN KEY (quality_index_id) REFERENCES quality_index (id)');
        $this->addSql('CREATE INDEX IDX_9B349F919053FA15 ON record (quality_index_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE plot DROP FOREIGN KEY FK_BEBB8F892F01CFE');
        $this->addSql('ALTER TABLE record DROP FOREIGN KEY FK_9B349F919053FA15');
        $this->addSql('DROP TABLE protection_measure');
        $this->addSql('DROP TABLE quality_index');
        $this->addSql('DROP INDEX IDX_BEBB8F892F01CFE ON plot');
        $this->addSql('ALTER TABLE plot DROP protection_measure_id');
        $this->addSql('DROP INDEX IDX_9B349F919053FA15 ON record');
        $this->addSql('ALTER TABLE record DROP quality_index_id');
    }
}
