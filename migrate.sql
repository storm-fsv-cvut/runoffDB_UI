
/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.agrotechnology;
SET FOREIGN_KEY_CHECKS=0;
INSERT IGNORE INTO rainsimulator.agrotechnology
(SELECT
agrotechnology_ID,
nameCZ,
nameEN,
descriptionCZ,
descriptionEN,
managTyp,
note,
NULL
FROM agrotechnologies);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.assignment_type;
SET FOREIGN_KEY_CHECKS=0;
INSERT IGNORE INTO rainsimulator.assignment_type
(SELECT
assignmentType_ID as id,
descriptionCZ as description_cz,
descriptionEN as description_en
FROM assignmenttypes);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.crop_type;
SET FOREIGN_KEY_CHECKS=0;
INSERT IGNORE INTO rainsimulator.crop_type
(SELECT
cropType_ID as id,
nameCZ as name_cz,
nameEN as name_en,
descriptionCZ as description_cz,
descriptionEN as description_en
FROM croptypes);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.crop_er_type;
SET FOREIGN_KEY_CHECKS=0;
INSERT IGNORE INTO rainsimulator.crop_er_type
(SELECT
cropErType_ID,
nameCZ,
nameEN
FROM cropertypes);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.crop;
SET FOREIGN_KEY_CHECKS=0;
INSERT IGNORE INTO rainsimulator.crop
(SELECT
crop_ID,
cropType_ID,
cropErType_ID,
nameCZ,
nameEN,
variety,
isCatchCrop,
descriptionCZ,
descriptionEN
FROM crops);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.organization;
SET FOREIGN_KEY_CHECKS=0;
INSERT IGNORE INTO rainsimulator.organization
(SELECT
organization_ID,
`name`,
contactPerson,
contactNumber,
contactEmail,
nameCode
FROM organizations);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.wrb_soil_class;
SET FOREIGN_KEY_CHECKS=0;
INSERT IGNORE INTO rainsimulator.wrb_soil_class (
SELECT
WRBclass_ID,
WRBclassName,
WRBclassCode
FROM wrbsoilclasses
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.locality;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.locality (
SELECT
locality_ID,
organization_ID,
WRBclass_ID,
`name`,
ST_X(location),
ST_Y(location),
descriptionCZ,
descriptionEN
FROM localities
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.plot;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.plot (
SELECT
plot_ID,
locality_ID,
soilOrigin_ID,
crop_ID,
agrotechnology_ID,
`name`,
established,
plotWidth,
plotLength,
plotSlope,
noteCZ,
noteEN
FROM plots
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.project;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.project (
SELECT
project_ID,
projectName,
descriptionCZ,
descriptionEN,
fundingAgency,
projectCode
FROM
projects
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.operation_intensity;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.operation_intensity (
SELECT
operationIntensity_ID,
descriptionCZ,
descriptionEN
FROM
operationintensities
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.operation_type;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.operation_type (
SELECT
operationType_ID,
descriptionCZ,
descriptionEN
FROM
operationtypes
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.operation;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.operation (
SELECT
operation_ID,
operationIntensity_ID,
operationType_ID,
nameCZ,
nameEN,
operationDepth_m,
descriptionCZ,
descriptionEN,
machineryTypeCZ,
machineryTypeEN
FROM
operations
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.simulator;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.simulator (
SELECT
simulator_ID,
organization_ID,
nameCZ,
nameEN,
descriptionCZ,
descriptionEN,
reference
FROM
simulators
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.soil_sample;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.soil_sample (
SELECT
soilSample_ID,
processedAt_ID,
plot_ID,
WRBclass_ID,
locality_ID,
run_ID,
Corg,
bulkDensity,
moisture,
dateSampled,
sampleLocation,
descriptionCZ,
descriptionEN,
sampleDepth_m,
dateProcessed,
texture,
rawDataPath
FROM
soilsamples
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.sequence;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.sequence (
SELECT
sequence_ID,
simulator_ID,
plot_ID,
surfaceCover,
date,
cropBBCH,
CropConditionCZ,
CropConditionEN
FROM
sequences
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.unit;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.unit (
SELECT
unit_ID,
3,
nameCZ,
nameEN,
unit,
descriptionCZ,
descriptionEN
FROM
units
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.run_type;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.run_type (
SELECT
runType_ID,
runTypeCZ,
runTypeEN,
descriptionCZ,
descriptionEN
FROM
runtypes
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.run;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.`run` (
SELECT
run_ID,
sequence_ID,
runType_ID,
soilSampleBulk_ID,
bulkAssignment_ID,
soilSampleTexture_ID,
textureAssignment_ID,
initMoisture,
rainIntensity,
datetime,
precedingPrecipitation,
runoffStart,
cropPictures,
plotPictures,
rawDataPath,
noteCZ,
noteEN,
pondingStart,
soilSampleCorg_ID,
CorgAssignment_ID
FROM
runs
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.measurement;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.`measurement` (
SELECT
measurement_ID,
run_ID,
descriptionCZ,
descriptionEN,
noteCZ,
noteEN,
soilSample_ID,
phenomen_ID,
isTimeline
FROM
measurements
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.record_type;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.`record_type` (
SELECT
recordType_ID,
recordTypeCZ,
recordTypeEN,
descriptionEN,
descriptionCZ
FROM
recordtypes
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.record;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.`record` (
SELECT
record_ID,
measurement_ID,
recordType_ID,
unit_ID,
noteCZ,
noteEN,
relValX_unit_ID,
relValY_unit_ID,
relValZ_unit_ID
FROM
records
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.data;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.`data` (
SELECT
data_ID,
record_ID,
time,
`value`,
relValX,
relValY,
relValZ
FROM
data
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.tillage_sequence;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.`tillage_sequence` (
SELECT
tillage_ID,
agrotechnology_ID,
operation_ID,
date
FROM
tillagesequences
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.record_record;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.`record_record` (
SELECT
record_ID,
derivedFrom_ID
FROM
record_record_relations
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.project_sequence;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.`project_sequence` (
SELECT
project_ID,
sequence_ID
FROM
simulation_project_relations
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.project_organization;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.`project_organization` (
SELECT
project_ID,
organization_ID
FROM
organization_project_relations
);

/*OK*/
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE rainsimulator.phenomenon;
SET FOREIGN_KEY_CHECKS=0;
INSERT INTO rainsimulator.`phenomenon` (
SELECT
phenomen_ID,
nameCZ,
nameEN,
descriptionCZ,
descriptionEN,
parameterSet_model_ID,
phenomen_key
FROM
phenomena
);
