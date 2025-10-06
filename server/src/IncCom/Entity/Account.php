<?php

namespace IncCom\Entity;

use Main\Entity\User;
use IncCom\Entity\Category;
use IncCom\Entity\AccountType;
use IncCom\Repository\AccountRepository;


use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AccountRepository::class)]
#[ORM\Table(name: 'inccom_account')]
#[ORM\HasLifecycleCallbacks]
class Account
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private readonly int $id;

    #[ORM\Column(name: "x_timestamp", type: Types::DATETIME_MUTABLE, nullable: true), ORM\Version]
    private ?\DateTimeInterface $xTimestamp = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: "owner_id", referencedColumnName: 'id', nullable: true, onDelete: "SET NULL")]
    private ?User $owner = null;

    #[ORM\OneToMany(mappedBy: 'account', targetEntity: Category::class)]
    private Collection $categories;

    #[ORM\Column(name: 'sort', type: Types::INTEGER, options: ["default" => 100])]
    private int $sort = 100;

    #[ORM\Column(name: 'label', length: 255, require: true)]
    private string $label;

    #[ORM\Column(name: 'balance', type: Types::INTEGER, options: ["default" => 0])]
    private int $balance = 100;

    #[Column(type: 'string', enumType: AccountType::class, required: true)]
    private ?string $type;

    public function __construct() {
        $this->categories = new ArrayCollection();
    }

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
    public function getOwner(): ?User {
        return $this->user;
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
    public function getBalance(): ?int {
        return $this->balance;
    }
    public function setBalance(int $balance): self {
        $this->balance = $balance;
        return $this;
    }
    public function getLabel(): ?string {
        return $this->label;
    }
    public function setLabel(string $name): self {
        $this->label = $label;
        return $this;
    }

    public function addCategory (Category $category): self {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
            $category->setAccount($this);
        }
        return $this;
    }
    public function removeCategory (Category $category): self {
        if ($this->categories->removeElement($category)) {
            if ($category->getAccount() === $this) {
                $category->setAccount(null);
            }
        }
        return $this;
    }
    public function newCategory (?string $label): Category {
        $category = new Category();
        if (null!==$label) {
            $category->setLabel($label);
        }
        $this->addCategory($category);
        return $category;
    }
    /**
     * @return Collection<int, Category>
     */
    public function getCategories () {
        return $this->categories;
    }

    public function getType(): ?string {
        return $this->type;
    }
    public function setType(AccountType $type): self {
        $this->type = $type;
        return $this;
    }
}
