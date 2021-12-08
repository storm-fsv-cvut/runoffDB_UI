<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211207212955 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE project_sequence (project_id INT NOT NULL, sequence_id INT NOT NULL, INDEX IDX_6FC85CF0166D1F9C (project_id), INDEX IDX_6FC85CF098FB19AE (sequence_id), PRIMARY KEY(project_id, sequence_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE project_sequence ADD CONSTRAINT FK_6FC85CF0166D1F9C FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_sequence ADD CONSTRAINT FK_6FC85CF098FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE sequence_project DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE sequence_project DROP FOREIGN KEY FK_6FC85CF0166D1F9C');
        $this->addSql('ALTER TABLE sequence_project DROP FOREIGN KEY FK_6FC85CF098FB19AE');
        $this->addSql('ALTER TABLE sequence_project ADD PRIMARY KEY (sequence_id, project_id)');
        $this->addSql('DROP INDEX idx_6fc85cf098fb19ae ON sequence_project');
        $this->addSql('CREATE INDEX IDX_1BB9193698FB19AE ON sequence_project (sequence_id)');
        $this->addSql('DROP INDEX idx_6fc85cf0166d1f9c ON sequence_project');
        $this->addSql('CREATE INDEX IDX_1BB91936166D1F9C ON sequence_project (project_id)');
        $this->addSql('ALTER TABLE sequence_project ADD CONSTRAINT FK_6FC85CF0166D1F9C FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE sequence_project ADD CONSTRAINT FK_6FC85CF098FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE project_sequence');
        $this->addSql('ALTER TABLE sequence_project DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE sequence_project DROP FOREIGN KEY FK_1BB9193698FB19AE');
        $this->addSql('ALTER TABLE sequence_project DROP FOREIGN KEY FK_1BB91936166D1F9C');
        $this->addSql('ALTER TABLE sequence_project ADD PRIMARY KEY (project_id, sequence_id)');
        $this->addSql('DROP INDEX idx_1bb91936166d1f9c ON sequence_project');
        $this->addSql('CREATE INDEX IDX_6FC85CF0166D1F9C ON sequence_project (project_id)');
        $this->addSql('DROP INDEX idx_1bb9193698fb19ae ON sequence_project');
        $this->addSql('CREATE INDEX IDX_6FC85CF098FB19AE ON sequence_project (sequence_id)');
        $this->addSql('ALTER TABLE sequence_project ADD CONSTRAINT FK_1BB9193698FB19AE FOREIGN KEY (sequence_id) REFERENCES sequence (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE sequence_project ADD CONSTRAINT FK_1BB91936166D1F9C FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE');
    }
}
