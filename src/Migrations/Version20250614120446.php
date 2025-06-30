<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250614120446 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {

        $this->addSql(<<<'SQL'
            CREATE TABLE project_publication (project_id INT NOT NULL, publication_id INT NOT NULL, INDEX IDX_67F39082166D1F9C (project_id), INDEX IDX_67F3908238B217A7 (publication_id), PRIMARY KEY(project_id, publication_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE publication (id INT AUTO_INCREMENT NOT NULL, title_cz VARCHAR(512) NOT NULL, title_en VARCHAR(512) DEFAULT NULL, authors VARCHAR(512) DEFAULT NULL, doi VARCHAR(512) DEFAULT NULL, journal_name VARCHAR(512) DEFAULT NULL, publication_year VARCHAR(512) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE simulator_publication (simulator_id INT NOT NULL, publication_id INT NOT NULL, INDEX IDX_C31BA296E4D71D57 (simulator_id), INDEX IDX_C31BA29638B217A7 (publication_id), PRIMARY KEY(simulator_id, publication_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE project_publication ADD CONSTRAINT FK_67F39082166D1F9C FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE project_publication ADD CONSTRAINT FK_67F3908238B217A7 FOREIGN KEY (publication_id) REFERENCES publication (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE simulator_publication ADD CONSTRAINT FK_C31BA296E4D71D57 FOREIGN KEY (simulator_id) REFERENCES simulator (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE simulator_publication ADD CONSTRAINT FK_C31BA29638B217A7 FOREIGN KEY (publication_id) REFERENCES publication (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
    }
}
