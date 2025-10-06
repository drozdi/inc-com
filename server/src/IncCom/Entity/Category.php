<?php
namespace IncCom\Entity;

use Main\Entity\User;
use IncCom\Entity\Account;
use IncCom\Entity\CategoryType;
use IncCom\Repository\CategoryRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[ORM\Table(name: 'inccom_category')]
#[ORM\HasLifecycleCallbacks]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private readonly int $id;

    #[ORM\Column(name: "x_timestamp", type: Types::DATETIME_MUTABLE, nullable: true), ORM\Version]
    private ?\DateTimeInterface $xTimestamp = null;

    #[ORM\ManyToOne(targetEntity: Account::class)]
    #[ORM\JoinColumn(name: "account_id", referencedColumnName: 'id')]
    private ?Account $account = null;

    #[ORM\Column(name: 'sort', type: Types::INTEGER, options: ["default" => 100])]
    private ?int $sort = 100;

    #[ORM\Column(name: 'label', length: 255, require: true)]
    private string $label;

    #[Column(type: 'string', enumType: CategoryType::class, required: true)]
    private string $type;


    public function getId(): ?int {
        return $this->id;
    }
    public function getXTimestamp(?string $format = null): \DateTimeInterface|string|null {
        if (null != $format && null != $this->xTimestamp) {
            return $this->xTimestamp->format($format);
        }
        return $this->xTimestamp;
    }
    public function setXTimestamp(?\DateTimeInterface $xTimestamp): self {
        $this->xTimestamp = $xTimestamp;
        return $this;
    }
    public function getAccount(): ?Account {
        return $this->account;
    }
    public function setAccount(?Account $account): self {
        if ($this->account) {
            $this->account->removeCategory($this);
        }
        $this->account = $account;
        $this->account->addCategory($this);
        return $this;
    }
    public function getSort(): ?int {
        return $this->sort;
    }
    public function setSort(int $sort): self {
        $this->sort = $sort;
        return $this;
    }
    public function getLabel(): string {
        return $this->label;
    }
    public function setLabel(string $label): self {
        $this->label = $label;
        return $this;
    }
    public function getType(): ?CategoryType {
        return $this->type;
    }
    public function setType(CategoryType $type): self {
        $this->type = $type;
        return $this;
    }
}
