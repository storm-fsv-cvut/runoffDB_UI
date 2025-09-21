<?php

declare(strict_types=1);

namespace App\Services;

use App\Entity\Data;
use App\Entity\Record;
use App\Entity\Sequence;
use App\Entity\SoilSample;
use App\Repository\MeasurementRepository;
use App\Repository\PhenomenonRepository;
use App\Repository\RecordRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use ParseCsv\Csv;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class RecordsService
{
    /** @var RecordRepository */
    private $recordRepository;

    /** @var MeasurementRepository */
    private $measurementRepository;

    /** @var PhenomenonRepository */
    private $phenomenonRepository;

    /** @var EntityManagerInterface */
    private $entityManager;

    public function __construct(
        RecordRepository $recordRepository,
        MeasurementRepository $measurementRepository,
        PhenomenonRepository $phenomenonRepository,
        EntityManagerInterface $entityManager,
    ) {
        $this->recordRepository = $recordRepository;
        $this->measurementRepository = $measurementRepository;
        $this->phenomenonRepository = $phenomenonRepository;
        $this->entityManager = $entityManager;
    }

    public function getChartData(array $ids): array
    {
        $datasets = [];
        $columns = [];
        $datarow = [];

        $typeMapper = [
            'precip' => 'steppedArea',
        ];

        $records = array_map(
            function ($id): ?Record {
                return $this->recordRepository->find($id);
            },
            $ids,
        );

        $columns[] = ['timeofday', ''];
        $counter = 0;
        foreach ($records as $record) {
            if ($record === null) {
                throw new Exception('Invalid record ID');
            }
            if ($record->getMeasurement() !== null && $record->getMeasurement()->getPhenomenon() !== null) {
                $counter++;
                $phenomenon = $record->getMeasurement()->getPhenomenon()->getPhenomenonKey();
                if (!isset($datasets[$phenomenon])) {
                    $datasets[$phenomenon] = [];
                }
                if ($record->getUnit() !== null) {
                    $columns[] = ['number', $record->getUnit()->getName() . ' [' . $record->getUnit()->getUnit(
                    ) . ']', $typeMapper[$phenomenon] ?? 'line', $phenomenon];
                } else {
                    $columns[] = ['number', ' - [ - ]', $typeMapper[$phenomenon] ?? 'line', $phenomenon];
                }
                /** @var Data $data */
                foreach ($record->getData() as $data) {
                    if ($data->getTime() !== null) {
                        $datarow = [
                            0 => [(int) $data->getTime()->format('H'), (int) $data->getTime()->format(
                                'i',
                            ), (int) $data->getTime()->format('s')],
                        ];
                    } else {
                        $datarow = [
                            0 => [0, 0, 0],
                        ];
                    }
                    for ($i = 1; $i <= sizeof($records); $i++) {
                        if ($i === $counter) {
                            $datarow[$i] = (int) $data->getValue() + 0;
                        } else {
                            $datarow[$i] = null;
                        }
                    }
                    $datasets[$phenomenon][] = $datarow;
                }
            }
        }

        if (isset($datasets['precip'])) {
            $newDataSet = [];
            foreach ($datasets['precip'] as $key => $data) {
                if ($key === 0) {
                    $newDataSet[$key] = $data;
                }
                if (isset($datasets['precip'][$key + 1])) {
                    $addArray = [$datasets['precip'][$key + 1][0]];
                    for ($i = 1; $i <= sizeof($records); $i++) {
                        $addArray[$i] = $data[$i] ?? null;
                    }
                    $newDataSet[$key + 1] = $addArray;
                }
            }
            $datasets['precip'] = $newDataSet;
        }

        $modifiedDataset = [];
        foreach ($datasets as $dataset) {
            $modifiedDataset += $dataset;
        }

        return [$columns, $modifiedDataset];
    }

    public function validateDataFile(UploadedFile $file, bool $skipFirstRow, bool $firstColumnTime): array
    {
        $res = [];

        if ($file->isValid()) {
            if ($file->getClientOriginalExtension() !== 'csv') {
                $res['error'] = 'Invalid file extension';
            } else {
                $parser = new Csv($file->getPathname());
                $parser->init(0);
                if ($firstColumnTime) {
                    $parser->fields = ['time', 'value', 'related_value_X', 'related_value_Y', 'related_value_Z'];
                } else {
                    $parser->fields = ['value', 'related_value_X', 'related_value_Y', 'related_value_Z'];
                }
                if ($skipFirstRow) {
                    $parser->offset = 1;
                } else {
                    $parser->offset = 0;
                }
                $parser->auto();
                $res['data'] = $parser->data;
            }
        } else {
            $res['error'] = $file->getErrorMessage();
        }

        return $res;
    }

    public function getRecordsByPhenomenonKey(string $phenomenon_key): array
    {
        $records = [];
        $phenomenon = $this->phenomenonRepository->findByKey($phenomenon_key);
        if ($phenomenon === null) {
            throw new Exception('Phenomenon not found');
        }
        foreach ($this->measurementRepository->findByPhenomenon($phenomenon) as $measurement) {
            $records = array_merge($records, $measurement->getRecords()->toArray());
        }
        return $records;
    }

    public function deleteRecord(int $record_id): void
    {
        $record = $this->entityManager->find(Record::class, $record_id);
        if ($record !== null) {
            foreach ($record->getData() as $data) {
                $this->entityManager->remove($data);
            }
            $this->entityManager->remove($record);
            $this->entityManager->flush();
        }
    }

    public function isRecordSetAsInSequenceContext(Record $record, Sequence $sequence): bool
    {
        if ($sequence->getRuns() !== null) {
            foreach ($sequence->getRuns() as $run) {
                if ($run->getSurfaceCover() !== null && $run->getSurfaceCover()->getId() === $record->getId()) {
                    return true;
                }
                if ($run->getInitMoisture() !== null && $run->getInitMoisture()->getId() === $record->getId()) {
                    return true;
                }
                if ($run->getRainIntensity() !== null && $run->getRainIntensity()->getId() === $record->getId()) {
                    return true;
                }
            }
        }
        return false;
    }

    public function isRecordSetAsInitMoistureInSequenceContext(Record $record, Sequence $sequence): bool
    {
        if ($sequence->getRuns() !== null) {
            foreach ($sequence->getRuns() as $run) {
                if ($run->getInitMoisture() !== null && $run->getInitMoisture()->getId() === $record->getId()) {
                    return true;
                }
            }
        }
        return false;
    }

    public function isRecordSetAsRainIntenzityInSequenceContext(Record $record, Sequence $sequence): bool
    {
        if ($sequence->getRuns() !== null) {
            foreach ($sequence->getRuns() as $run) {
                if ($run->getRainIntensity() !== null && $run->getRainIntensity()->getId() === $record->getId()) {
                    return true;
                }
            }
        }
        return false;
    }

    public function isRecordSetAsInSoilSampleContext(Record $record, SoilSample $soilSample, ?string $type = null): bool
    {
        if ($soilSample->getBulkDensity() !== null && $soilSample->getBulkDensity()->getId() === $record->getId() && ($type === null || $type === 'bulk_density')) {
            return true;
        }
        if ($soilSample->getCorg() !== null && $soilSample->getCorg()->getId() === $record->getId()
            && ($type === null || $type === 'corg')
        ) {
            return true;
        }
        if ($soilSample->getMoisture() !== null && $soilSample->getMoisture()->getId() === $record->getId()
            && ($type === null || $type === 'moisture')
        ) {
            return true;
        }
        if ($soilSample->getTextureRecord() !== null && $soilSample->getTextureRecord()->getId() === $record->getId()
            && ($type === null || $type === 'texture')
        ) {
            return true;
        }

        return false;
    }
}
