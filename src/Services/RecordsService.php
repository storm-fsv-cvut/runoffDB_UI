<?php
namespace App\Services;

use App\Entity\Phenomenon;
use App\Repository\MeasurementRepository;
use App\Repository\PhenomenonRepository;
use App\Repository\RecordRepository;
use Doctrine\ORM\NoResultException;
use ParseCsv\Csv;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Encoder\CsvEncoder;

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

    public function __construct(RecordRepository $recordRepository, MeasurementRepository $measurementRepository, PhenomenonRepository $phenomenonRepository) {
        $this->recordRepository = $recordRepository;
        $this->measurementRepository = $measurementRepository;
        $this->phenomenonRepository = $phenomenonRepository;
    }

    public function getChartData(array $ids):array {

        $typeMapper = [
            'precip'=>'steppedArea'
        ];

        $columns = [];
        $dataSet = [];
        $records = array_map(function ($id) {
            return $this->recordRepository->find($id);
        }, $ids);

        $columns[] = ['timeofday', ''];
        $counter = 0;
        foreach ($records as $record) {
            $counter++;
            $phenomenon = $record->getMeasurement()->getPhenomenon()->getPhenomenonKey();
            $columns[] = ['number', $record->getUnit()->getName() . " [" . $record->getUnit()->getUnit() . "]", $typeMapper[$phenomenon] ?? 'line', $phenomenon];
            foreach ($record->getData() as $data) {
                if ($data->getTime()!=null) {
                    $datarow = [
                        0 => [(int)$data->getTime()->format('H'), (int)$data->getTime()->format('i'), (int)$data->getTime()->format('s')]
                    ];
                }
                for ($i = 1; $i <= sizeof($records); $i++) {
                    if ($i == $counter) {
                        $datarow[$i] = $data->getValue()+0;
                    } else {
                        $datarow[$i] = null;
                    }
                }
                $dataSet[] = $datarow;
            }
            if ($phenomenon=="precip") {
                end($dataSet);
                $lastIndex=key($dataSet);
                $dataSet[$lastIndex][1] = $dataSet[$lastIndex-1][1];
            }
        }
        return [$columns, $dataSet];
    }

    public function validateDataFile(UploadedFile $file):array {
        $res = [];
        if ($file->isValid()) {
            if ($file->getClientOriginalExtension()!='csv') {
                $res['error']="Invalid file extension";
            } else {
                $parser = new Csv();
                $parser->fields = ['time', 'value', 'dimension'];
                $parser->auto($file->getPathname());
                $res['data'] = $parser->data;
            }
        } else {
                $res['error']=$file->getErrorMessage();
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
}
