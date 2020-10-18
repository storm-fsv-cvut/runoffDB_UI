<?php

namespace App\Services;

use App\Entity\Record;
use App\Repository\MeasurementRepository;
use App\Repository\PhenomenonRepository;
use App\Repository\RecordRepository;
use App\Repository\SequenceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NoResultException;
use ParseCsv\Csv;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class RecordsService {
    /**
     * @var RecordRepository
     */
    private $recordRepository;
    /**
     * @var MeasurementRepository
     */
    private $measurementRepository;
    /**
     * @var PhenomenonRepository
     */
    private $phenomenonRepository;
    /**
     * @var SequenceRepository
     */
    private $sequenceRepository;
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(RecordRepository $recordRepository, MeasurementRepository $measurementRepository, PhenomenonRepository $phenomenonRepository, SequenceRepository $sequenceRepository, EntityManagerInterface $entityManager) {
        $this->recordRepository = $recordRepository;
        $this->measurementRepository = $measurementRepository;
        $this->phenomenonRepository = $phenomenonRepository;
        $this->sequenceRepository = $sequenceRepository;
        $this->entityManager = $entityManager;
    }

    public function getChartData(array $ids): array {

        $typeMapper = [
            'precip' => 'steppedArea'
        ];

        $columns = [];
        $dataSet = [];
        $records = array_map(function ($id) {
            return $this->recordRepository->find($id);
        }, $ids);

        $columns[] = ['timeofday', ''];
        $counter = 0;
        $datasets = [];
        foreach ($records as $record) {
            $counter++;
            $phenomenon = $record->getMeasurement()->getPhenomenon()->getPhenomenonKey();
            if (!isset($datasets[$phenomenon])) {
                $datasets[$phenomenon] = [];
            }
            $columns[] = ['number', $record->getUnit()->getName() . " [" . $record->getUnit()->getUnit() . "]", $typeMapper[$phenomenon] ?? 'line', $phenomenon];

            foreach ($record->getData() as $data) {
                if ($data->getTime() != null) {
                    $datarow = [
                        0 => [(int)$data->getTime()->format('H'), (int)$data->getTime()->format('i'), (int)$data->getTime()->format('s')]
                    ];
                }
                for ($i = 1; $i <= sizeof($records); $i++) {
                    if ($i == $counter) {
                        $datarow[$i] = $data->getValue() + 0;
                    } else {
                        $datarow[$i] = null;
                    }
                }
                $datasets[$phenomenon][] = $datarow;
            }

        }

        if (isset($datasets['precip'])) {
            $newDataSet = [];
            foreach ($datasets['precip'] as $key => $data) {
                if ($key == 0) {
                    $newDataSet[$key] = $data;
                }
                if (isset($datasets['precip'][$key + 1])) {
                    $addArray = [$datasets['precip'][$key + 1][0]];
                    for ($i = 1; $i <= sizeof($records); $i++) {
                        $addArray[$i] = $data[$i] ?? NULL;
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

    public function validateDataFile(UploadedFile $file): array {
        $res = [];
        if ($file->isValid()) {
            if ($file->getClientOriginalExtension() != 'csv') {
                $res['error'] = "Invalid file extension";
            } else {
                $parser = new Csv();
                $parser->fields = ['time', 'value', 'dimension'];
                $parser->auto($file->getPathname());
                $res['data'] = $parser->data;
            }
        } else {
            $res['error'] = $file->getErrorMessage();
        }

        return $res;
    }

    public function getRecordsByPhenomenonKey(string $phenomenon_key): array {
        $records = [];
        $phenomenon = $this->phenomenonRepository->findByKey($phenomenon_key);
        if (!$phenomenon) {
            throw new NoResultException("Phenomenon not found");
        }
        foreach ($this->measurementRepository->findByPhenomenon($phenomenon) as $measurement) {
            $records = array_merge($records, $measurement->getRecords()->toArray());
        }
        return $records;
    }

    public function deleteRecord(int $record_id) {
        $record = $this->entityManager->find(Record::class, $record_id);
        foreach ($record->getData() as $data) {
            $this->entityManager->remove($data);
        }
        $this->entityManager->remove($record);
        $this->entityManager->flush();
    }
}
