<?php

namespace IncCom\Entity;

use Main\Entity\User;
use IncCom\Entity\Account;
use IncCom\Entity\Category;
use IncCom\Repository\ProductRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ORM\Table(name: 'inccom_product')]
#[ORM\HasLifecycleCallbacks]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private readonly int $id;

    #[ORM\Column(name: "x_timestamp", type: Types::DATETIME_MUTABLE, nullable: true), ORM\Version]
    private ?\DateTimeInterface $xTimestamp = null;

    #[ORM\ManyToOne(targetEntity: Account::class)]
    #[ORM\JoinColumn(name: "account_id", referencedColumnName: 'id')]
    private Account $account;

    #[ORM\ManyToOne(targetEntity: Category::class)]
    #[ORM\JoinColumn(name: "category_id", referencedColumnName: 'id')]
    private Category $category;

    #[ORM\Column(name: 'label', length: 255)]
    private string $label;

    #[ORM\Column(name: 'amount', type: Types::INTEGER, options: ["default" => 0])]
    private int $amount = 0;

    #[ORM\Column(name: 'comment', type: Types::TEXT, nullable: true)]
    private ?string $comment = null;


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
    public function getAccount(): Account {
        return $this->account;
    }
    public function setAccount(Account $account): self {
        $this->account = $account;
        return $this;
    }
    public function getCategory(): Category {
        return $this->category;
    }
    public function setCategory(Category $category): self {
        $this->category = $category;
        return $this;
    }
    public function getLabel(): string {
        return $this->label;
    }
    public function setLabel(string $label): self {
        $this->label = $label;
        return $this;
    }
    public function getAmount(): int {
        return $this->amount;
    }
    public function setAmount(int $amount): self {
        $this->amount = $amount;
        return $this;
    }
    public function getComment(): ?string {
        return $this->comment;
    }
    public function setComment(int $comment): self {
        $this->comment = $comment;
        return $this;
    }
}
