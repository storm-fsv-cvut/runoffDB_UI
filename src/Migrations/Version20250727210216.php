<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250727210216 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(
            <<<'SQL'
            CREATE TABLE plot_protection_measure (plot_id INT NOT NULL, protection_measure_id INT NOT NULL, INDEX IDX_B0D15DB8680D0B01 (plot_id), INDEX IDX_B0D15DB82F01CFE (protection_measure_id), PRIMARY KEY(plot_id, protection_measure_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL
        );
        $this->addSql(
            <<<'SQL'
            ALTER TABLE plot_protection_measure ADD CONSTRAINT FK_B0D15DB8680D0B01 FOREIGN KEY (plot_id) REFERENCES plot (id) ON DELETE CASCADE
        SQL
        );
        $this->addSql(
            <<<'SQL'
            ALTER TABLE plot_protection_measure ADD CONSTRAINT FK_B0D15DB82F01CFE FOREIGN KEY (protection_measure_id) REFERENCES protection_measure (id) ON DELETE CASCADE
        SQL
        );
        $this->addSql(
            <<<'SQL'
        INSERT INTO plot_protection_measure (SELECT plot.id, plot.protection_measure_id from plot where protection_measure_id is not null)
 SQL
        );
    }
}
