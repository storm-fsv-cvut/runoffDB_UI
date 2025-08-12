<?php

namespace App\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="methodics_processing_step")
 */
class MethodicsProcessingStep extends BaseEntity
{
    /** @ORM\Id @ORM\GeneratedValue @ORM\Column(type="integer") */
    private int $id;

    /**
     * @ORM\ManyToOne(targetEntity=Methodics::class, inversedBy="methodicsProcessingSteps")
     * @ORM\JoinColumn(name="methodics_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     */
    private Methodics $methodics;

    /**
     * @ORM\ManyToOne(targetEntity=ProcessingStep::class)
     * @ORM\JoinColumn(name="processing_step_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     */
    private ProcessingStep $processingStep;

    /**
     * @ORM\Column(type="integer", options={"default":0})
     */
    private int $sort = 0;

    public function __construct()
    {
        $this->sort = 0;
    }

    public function getMethodics(): Methodics
    {
        return $this->methodics;
    }

    public function setMethodics(Methodics $methodics): self
    {
        $this->methodics = $methodics;
        return $this;
    }

    public function getProcessingStep(): ProcessingStep
    {
        return $this->processingStep;
    }

    public function setProcessingStep(ProcessingStep $processingStep): self
    {
        $this->processingStep = $processingStep;
        return $this;
    }

    public function getSort(): int
    {
        return $this->sort;
    }

    public function setSort(int $sort): self
    {
        $this->sort = $sort;
        return $this;
    }

    public function __toString(): string
    {
        return sprintf('%s → %s (#%d)',
                       (string) $this->methodics,
                       (string) $this->processingStep,
                       $this->sort
        );
    }
}

