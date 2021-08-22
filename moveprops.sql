ALTER TABLE run
    ADD surface_cover_id INT DEFAULT NULL, ADD crop_bbch INT DEFAULT NULL, ADD crop_condition_cz VARCHAR(255) DEFAULT NULL,
    ADD crop_condition_en VARCHAR(255) DEFAULT NULL;

ALTER TABLE run ADD CONSTRAINT FK_5076A4C09D3832BF FOREIGN KEY (surface_cover_id) REFERENCES record (id) ON DELETE SET NULL;

CREATE INDEX IDX_5076A4C09D3832BF ON run (surface_cover_id);

UPDATE run
    JOIN run_group ON (run_group.id = run.run_group_id)
    JOIN sequence ON (run_group.sequence_id = sequence.id)
SET
    run.crop_condition_cz = sequence.crop_condition_cz,
    run.crop_condition_en = sequence.crop_condition_en,
    run.surface_cover_id = sequence.surface_cover_id,
    run.crop_bbch = sequence.crop_bbch;

ALTER TABLE sequence DROP FOREIGN KEY FK_5286D72B9D3832BF;

ALTER TABLE sequence DROP surface_cover_id, DROP crop_bbch, DROP crop_condition_cz, DROP crop_condition_en;




