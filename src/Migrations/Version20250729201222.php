<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250729201222 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE instrument (id INT AUTO_INCREMENT NOT NULL, name_cz VARCHAR(255) NOT NULL, name_en VARCHAR(255) NOT NULL, description_cz LONGTEXT DEFAULT NULL, description_en LONGTEXT DEFAULT NULL, link VARCHAR(512) DEFAULT NULL, files_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE methodics (id INT AUTO_INCREMENT NOT NULL, name_cz VARCHAR(255) NOT NULL, name_en VARCHAR(255) NOT NULL, description_cz LONGTEXT DEFAULT NULL, description_en LONGTEXT DEFAULT NULL, note_cz LONGTEXT DEFAULT NULL, note_en LONGTEXT DEFAULT NULL, files_path VARCHAR(255) DEFAULT NULL, links LONGTEXT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE methodics_processing_step (methodics_id INT NOT NULL, processing_step_id INT NOT NULL, INDEX IDX_8D2231C393630D13 (methodics_id), INDEX IDX_8D2231C318EA3207 (processing_step_id), PRIMARY KEY(methodics_id, processing_step_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE processing_step (id INT AUTO_INCREMENT NOT NULL, step_order INT NOT NULL, name_cz VARCHAR(255) NOT NULL, name_en VARCHAR(255) NOT NULL, description_cz LONGTEXT DEFAULT NULL, description_en LONGTEXT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE processing_step_instrument (processing_step_id INT NOT NULL, instrument_id INT NOT NULL, INDEX IDX_441C781518EA3207 (processing_step_id), INDEX IDX_441C7815CF11D9C (instrument_id), PRIMARY KEY(processing_step_id, instrument_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE methodics_processing_step ADD CONSTRAINT FK_8D2231C393630D13 FOREIGN KEY (methodics_id) REFERENCES methodics (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE methodics_processing_step ADD CONSTRAINT FK_8D2231C318EA3207 FOREIGN KEY (processing_step_id) REFERENCES processing_step (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE processing_step_instrument ADD CONSTRAINT FK_441C781518EA3207 FOREIGN KEY (processing_step_id) REFERENCES processing_step (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE processing_step_instrument ADD CONSTRAINT FK_441C7815CF11D9C FOREIGN KEY (instrument_id) REFERENCES instrument (id) ON DELETE CASCADE
        SQL);
    }

}
