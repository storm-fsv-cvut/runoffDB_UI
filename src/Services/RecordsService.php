<?php
namespace App\Services;

use App\Repository\RecordRepository;
use ParseCsv\Csv;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Encoder\CsvEncoder;

class RecordsService {
    /**
     * @var RecordRepository
     */
    private $recordRepository;

    public function __construct(RecordRepository $recordRepository) {
        $this->recordRepository = $recordRepository;
    }

    public function getChartData(array $ids):array {
        $columns = [];
        $dataSet = [];
        $records = array_map(function ($id) {
            return $this->recordRepository->find($id);
        }, $ids);

        $columns[] = ['timeofday', ''];
        $counter = 0;
        foreach ($records as $record) {
            $counter++;
            $columns[] = ['number', $record->getUnit()->getNameCZ() . " [" . $record->getUnit()->getUnit() . "]"];
            foreach ($record->getData() as $data) {
                $datarow = [
                    0 => [(int)$data->getTime()->format('H'), (int)$data->getTime()->format('i'), (int)$data->getTime()->format('s')]
                ];
                for ($i = 1; $i <= sizeof($records); $i++) {
                    if ($i == $counter) {
                        $datarow[$i] = $data->getValue()+0;
                    } else {
                        $datarow[$i] = null;
                    }
                }
                $dataSet[] = $datarow;
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
}
