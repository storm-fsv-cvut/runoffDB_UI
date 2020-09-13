<?php


namespace App\Services;


use App\Entity\Run;
use App\Entity\Sequence;
use App\Entity\SoilSample;
use App\Repository\SoilSampleRepository;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;

class SoilSampleService {

    /**
     * @var TranslatorInterface
     */
    private $translator;

    /**
     * @var RequestStack
     */
    private $requestStack;

    /**
     * @var string
     */
    private $locale;
    /**
     * @var SoilSampleRepository
     */
    private $soilSampleRepository;

    public function __construct(TranslatorInterface $translator, RequestStack $requestStack, SoilSampleRepository $soilSampleRepository) {
        $this->translator = $translator;
        $this->requestStack = $requestStack;
        $this->locale = $this->requestStack->getCurrentRequest()->getLocale() ? $this->requestStack->getCurrentRequest()->getLocale() : $this->requestStack->getCurrentRequest()->getDefaultLocale();
        $this->soilSampleRepository = $soilSampleRepository;
    }

    public function getMeasurementsArray(SoilSample $soilSample):array {
        $measurements = $soilSample->getMeasurements();
        $measurementsArray = [];
        foreach ($measurements as $measurement) {
            $measurementArray = [
                'id' => $measurement->getId(),
                'note' => $measurement->getNote(),
                'description' => $measurement->getDescription(),
                'records' => $measurement->getRecords()
            ];
            $measurementsArray[$measurement->getId()] = $measurementArray;
        }
        return $measurementsArray;
    }


    public function getSoilSampleById(int $id): SoilSample {
        return $this->soilSampleRepository->find($id);
    }

    public function uploadFile(UploadedFile $file, SoilSample $soilSample) {
        $dir = $this->parameterBag->get('kernel.project_dir')."/public/data/soil-sample/".$soilSample->getId();
        if (!$this->filesystem->exists($dir)) {
            $this->filesystem->mkdir($dir);
        }
        $file->move($dir, $file->getClientOriginalName());
    }
}
