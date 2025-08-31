<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250809121155 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
            ALTER TABLE instrument DROP files_path
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE measurement ADD methodics_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE measurement ADD CONSTRAINT FK_2CE0D81193630D13 FOREIGN KEY (methodics_id) REFERENCES methodics (id) ON DELETE SET NULL
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_2CE0D81193630D13 ON measurement (methodics_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE methodics DROP files_path, CHANGE links links LONGTEXT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE record ADD methodics_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE record ADD CONSTRAINT FK_9B349F9193630D13 FOREIGN KEY (methodics_id) REFERENCES methodics (id) ON DELETE SET NULL
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_9B349F9193630D13 ON record (methodics_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE run ADD methodics_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE run ADD CONSTRAINT FK_5076A4C093630D13 FOREIGN KEY (methodics_id) REFERENCES methodics (id) ON DELETE SET NULL
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_5076A4C093630D13 ON run (methodics_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sequence ADD methodics_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE sequence ADD CONSTRAINT FK_5286D72B93630D13 FOREIGN KEY (methodics_id) REFERENCES methodics (id) ON DELETE SET NULL
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_5286D72B93630D13 ON sequence (methodics_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE soil_sample ADD methodics_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE soil_sample ADD CONSTRAINT FK_CE7B16D693630D13 FOREIGN KEY (methodics_id) REFERENCES methodics (id) ON DELETE SET NULL
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_CE7B16D693630D13 ON soil_sample (methodics_id)
        SQL);
    }

}
