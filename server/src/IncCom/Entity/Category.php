<?php
namespace IncCom\Entity;

use Main\Entity\User;
use IncCom\Entity\Account;
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
    private ?int $id = null;

    #[ORM\Column(name: "x_timestamp", type: Types::DATETIME_MUTABLE, nullable: true), ORM\Version]
    private ?\DateTimeInterface $xTimestamp = null;

    #[ORM\ManyToOne(targetEntity: Account::class)]
    #[ORM\JoinColumn(name: "account_id", referencedColumnName: 'id', onDelete: "CASCADE")]
    private ?Account $account = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: "owner_id", referencedColumnName: 'id', nullable: true, onDelete: "SET NULL")]
    private ?User $owner = null;

    #[ORM\Column(name: 'sort', type: Types::INTEGER, options: ["default" => 100])]
    private ?int $sort = 100;

    #[ORM\Column(name: 'label', length: 255)]
    private string $label;

    #[ORM\Column(name: 'mcc', type: Types::INTEGER, nullable: true)]
    private ?int $mcc = null;

    #[ORM\Column(name: 'type', type: 'string')]
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
        if ($this->account) {
            //$this->account->addCategory($this);
        }
        return $this;
    }
    public function getOwner(): ?User {
        return $this->owner;
    }
    public function setOwner(?User $owner): self {
        $this->owner = $owner;
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
    public function getType(): ?string {
        return $this->type;
    }
    public function setType(string $type): self {
        $this->type = $type;
        return $this;
    }

    public function getMcc(): ?int {
        return $this->mcc;
    }

    /**
     * @param int|null $mcc
     */
    public function setMcc(?int $mcc = null): self {
        $this->mcc = $mcc;
        return $this;
    }
}
