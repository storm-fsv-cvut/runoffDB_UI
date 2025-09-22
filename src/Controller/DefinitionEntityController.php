<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\FileStorageEntityInterface;
use App\Form\AgrotechnologyType;
use App\Form\CropFilterType;
use App\Form\DefinitionEntityType;
use App\Form\InstrumentType;
use App\Form\MethodicsType;
use App\Form\PlotFilterType;
use App\Form\PlotType;
use App\Form\ProjectType;
use App\Form\SimulatorType;
use App\Repository\CropRepository;
use App\Repository\PlotRepository;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

class DefinitionEntityController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TranslatorInterface $translator,
        private readonly PaginatorInterface $paginator,
        private readonly CropRepository $cropRepository,
        private readonly PlotRepository $plotRepository,
        private ParameterBagInterface $parameterBag,
        private Filesystem $filesystem,
    ) {
    }

    #[Route('/{_locale}/settings/{class}', name: 'settings')]
    public function list(Request $request, string $class): Response
    {
        $this->denyAccessUnlessGranted('edit');

        $params = [
            'class' => $class,
            'class_name' => $this->translator->trans($class),
        ];

        if ($class === 'App\Entity\Crop') {
            $filter = $this->createForm(
                CropFilterType::class,
                null,
                ['method' => 'get', 'action' => $this->generateUrl('settings', ['class' => $class])],
            );
            $filter->handleRequest($request);

            $pagination = $this->paginator->paginate(
                $this->cropRepository->getPaginatorQuery(
                    $filter->getData(),
                    $request->get('order', 'nameCZ'),
                    $request->get('direction', 'DESC'),
                ),
                $request->query->getInt('page', 1),
                20,
            );

            $params['filter'] = $filter->createView();
            $params['pagination'] = $pagination;
            $params['sort_columns']['name'] = $this->translator->getLocale() === 'en' ? 'crop.nameEN' : 'crop.nameCZ';

            return $this->render('crop/list.html.twig', $params);
        }

        if ($class === 'App\Entity\Plot') {
            $filter = $this->createForm(
                PlotFilterType::class,
                null,
                ['method' => 'get', 'action' => $this->generateUrl('settings', ['class' => $class])],
            );
            $filter->handleRequest($request);

            $pagination = $this->paginator->paginate(
                $this->plotRepository->getPaginatorQuery(
                    $filter->getData(),
                    $request->get('order', 'nameCZ'),
                    $request->get('direction', 'DESC'),
                ),
                $request->query->getInt('page', 1),
                20,
            );

            $params['pagination'] = $pagination;
            $params['filter'] = $filter->createView();
            $params['sort_columns']['crop'] = $this->translator->getLocale() === 'en' ? 'c.nameEN' : 'c.nameCZ';
            $params['sort_columns']['protectionMeasure'] = $this->translator->getLocale(
            ) === 'en' ? 'pm.nameEN' : 'pm.nameCZ';

            return $this->render('plot/list.html.twig', $params);
        }

        $repo = $this->entityManager->getRepository($class);
        $builder = $repo->createQueryBuilder('e');

        $pagination = $this->paginator->paginate(
            $builder,
            $request->query->getInt('page', 1),
            20,
        );

        $params['pagination'] = $pagination;

        return $this->render('definitionEntity/list.html.twig', $params);
    }

    #[Route('/{_locale}/setting/{id?}', name: 'setting')]
    public function edit(Request $request, ?int $id = null): Response
    {
        $this->denyAccessUnlessGranted('edit');
        $class = $request->get('class');
        $dataClass = $id !== null ? $this->entityManager->find($class, $id) : null;

        if ($class === 'App\Entity\Agrotechnology') {
            $form = $this->createForm(AgrotechnologyType::class, $dataClass, ['data_class' => $class]);
        } elseif ($class === 'App\Entity\Project') {
            $form = $this->createForm(ProjectType::class, $dataClass, ['data_class' => $class]);
        } elseif ($class === 'App\Entity\Simulator') {
            $form = $this->createForm(SimulatorType::class, $dataClass, ['data_class' => $class]);
        } elseif ($class === 'App\Entity\Plot') {
            $form = $this->createForm(PlotType::class, $dataClass, ['data_class' => $class]);
        } elseif ($class === 'App\Entity\Instrument') {
            $form = $this->createForm(InstrumentType::class, $dataClass, ['data_class' => $class]);
        } elseif ($class === 'App\Entity\Methodics') {
            $form = $this->createForm(MethodicsType::class, $dataClass, ['data_class' => $class]);
        } else {
            $form = $this->createForm(DefinitionEntityType::class, $dataClass, ['data_class' => $class]);
        }
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entity = $form->getData();
            if ($form->has('uploadedFiles')) {
                $files = $form->get('uploadedFiles')->getData();

                if (sizeof($files) > 0) {
                    if (!is_array($files)) {
                        $files = [$files];
                    }

                    foreach ($files as $file) {
                        if ($file instanceof UploadedFile) {
                            $dir = $this->parameterBag->get(
                                'kernel.project_dir',
                            ) . '/public/' . $entity->getFilesPath();
                            if (!$this->filesystem->exists($dir)) {
                                $this->filesystem->mkdir($dir);
                            }
                            $file->move($dir, $file->getClientOriginalName());
                        }
                    }
                }
            }

            $this->entityManager->persist($entity);
            $this->entityManager->flush();
            return $this->redirectToRoute('settings', ['class' => $class, 'id' => $entity->getId()]);
        }

        return $this->render('definitionEntity/edit.html.twig', [
            'form' => $form->createView(),
            'class_name' => $this->translator->trans($class),
            'class' => $class,
            'entity' => $dataClass,
            'hasFiles' => $dataClass instanceof FileStorageEntityInterface,
            'id' => $id,
        ]);
    }

    #[Route('/{_locale}/settings/delete/{id}', name: 'delete_setting')]
    public function delete(Request $request, int $id)
    {
        $this->denyAccessUnlessGranted('edit');
        $class = $request->get('class');
        $dataClass = $this->entityManager->find($class, $id);
        if ($dataClass) {
            $this->entityManager->remove($dataClass);
            $this->entityManager->flush();
        }
        return $this->redirectToRoute('settings', ['class' => $class]);
    }

    #[Route('/{_locale}/settings/{id}/download-file', name: 'downloadSettingsFile')]
    public function downloadFile(Request $request, int $id): BinaryFileResponse
    {
        $this->denyAccessUnlessGranted('edit');
        $class = $request->get('class');
        $entity = $this->entityManager->find($class, $id);

        $filename = $request->get('filename');
        $path = $this->parameterBag->get('kernel.project_dir') . '/public/' . $entity->getFilesPath() . '/' . $filename;

        $response = new BinaryFileResponse($path);
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $filename,
        );

        return $response;
    }

    #[Route('/{_locale}/settings/{id}/delete-file', name: 'deleteSettingsFile')]
    public function deleteFile(Request $request, int $id): ?RedirectResponse
    {
        $this->denyAccessUnlessGranted('edit');
        $class = $request->get('class');
        $entity = $this->entityManager->find($class, $id);

        $filename = $request->get('filename');
        $entity->removeFile($filename);

        return $this->redirectToRoute('settings', ['id' => $id, 'class' => $class]);
    }
}
