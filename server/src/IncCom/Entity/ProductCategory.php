<?php
namespace IncCom\Entity;

use Main\Entity\User;
use IncCom\Repository\ProductCategoryRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductCategoryRepository::class)]
#[ORM\Table(name: 'inccom_product_category')]
#[ORM\HasLifecycleCallbacks]
class ProductCategory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private readonly int $id;

    #[ORM\Column(name: "x_timestamp", type: Types::DATETIME_MUTABLE, nullable: true), ORM\Version]
    private ?\DateTimeInterface $xTimestamp = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', nullable: true, onDelete: "SET NULL")]
    private ?self $parent = null;

    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: self::class)]
    private Collection $children;

    #[ORM\ManyToOne(targetEntity: Account::class)]
    #[ORM\JoinColumn(name: "owner_id", referencedColumnName: 'id')]
    private ?User $owner = null;

    #[ORM\Column(name: 'sort', type: Types::INTEGER, options: ["default" => 100])]
    private ?int $sort = 100;

    #[ORM\Column(name: 'label', length: 255)]
    private string $label;

    #[ORM\Column(name: '`level`', type: Types::INTEGER, options: ["default" => 0])]
    private ?int $level = 0;

    public function __construct() {
        $this->children = new ArrayCollection();
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
    public function getLabel(): string {
        return $this->label;
    }
    public function setLabel(string $label): self {
        $this->label = $label;
        return $this;
    }
     public function getLevel(): ?int {
        return $this->level;
    }
    public function setLevel(int $level): self {
        $this->level = $level;
        foreach ($this->children as $child) {
            $child->setLevel($this->level+1);
        }
        return $this;
    }

    public function getParent(): ?self {
        return $this->parent;
    }
    public function setParent(?self $parent = null): self {
        if ($this->parent && $this->parent !== $parent) {
            $this->parent->removeChild($this);
        }
        $this->parent = $parent;
        if ($this->parent) {
            $this->parent->addChild($this);
            $this->setOwner($this->parent->getOwner());
        }
        if ($this->parent != null) {
            $this->setLevel($this->parent->getLevel() + 1);
        }
        return $this;
    }
    public function addChild (self $child): self {
        if (!$this->children->contains($child)) {
            $this->children->add($child);
            $child->setParent($this);
            $child->setOwner($this->parent);
        }
        $child->setLevel($this->level + 1);
        return $this;
    }
    public function removeChild (self $child): self {
        if ($this->children->removeElement($child)) {
            if ($child->getParent() === $this) {
                $child->setParent(null);
                $child->setLevel(0);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Group>
     */
    public function getChildren () {
        return $this->children;
    }
}
