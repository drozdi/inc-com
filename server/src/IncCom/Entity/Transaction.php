<?php

namespace IncCom\Entity;

use Main\Entity\User;
use IncCom\Entity\Account;
use IncCom\Entity\Category;
use IncCom\Entity\CategoryType;
use IncCom\Repository\TransactionRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TransactionRepository::class)]
#[ORM\Table(name: 'inccom_transaction')]
#[ORM\HasLifecycleCallbacks]
class Transaction
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
    #[ORM\JoinColumn(name: "category_id", referencedColumnName: 'id', nullable: true, onDelete: "SET NULL")]
    private Category $category;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: "owner_id", referencedColumnName: 'id', nullable: true, onDelete: "SET NULL")]
    private User $owner;

    #[Column(type: 'string', enumType: CategoryType::class)]
    private string $type;

    #[ORM\ManyToOne(targetEntity: self::class)]
    #[ORM\JoinColumn(name: "link_id", referencedColumnName: 'id', nullable: true, onDelete: "CASCADE")]
    private ?self $link = null;

    #[ORM\Column(name: 'date', type: Types::DATETIME_MUTABLE)]
    private \DateTimeInterface $date;

    #[ORM\Column(name: 'amount', type: Types::DECIMAL, precision: 16, scale: 2, options: ["default" => 0.0])]
    private int $amount = 0;

    #[ORM\Column(name: 'comment', type: Types::TEXT, nullable: true)]
    private ?string $comment = null;

    #[ORM\Column(name: 'fn', length: 20, nullable: true)]
    private ?string $fn = null;

    #[ORM\Column(name: 'fp', length: 20, nullable: true)]
    private ?string $fp = null;

    #[ORM\Column(name: 'fd', length: 20, nullable: true)]
    private ?string $fd = null;


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
    public function getOwner(): ?User {
        return $this->user;
    }
    public function setOwner(?User $owner): self {
        $this->owner = $owner;
        return $this;
    }
    public function getLink(): ?self {
        return $this->link;
    }
    public function setLink(?self $owner): self {
        $this->link = $link;
        return $this;
    }
    public function getDate (?string $format = null): \DateTimeInterface|string|null {
        if (null != $format && null != $this->date) {
            return $this->date->format($format);
        }
        return $this->date;
    }
    public function setDate (\DateTimeInterface $date): self {
        $this->date = $date;
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

    public function getType(): ?CategoryType {
        return $this->type;
    }
    public function setType(CategoryType $type): self {
        $this->type = $type;
        return $this;
    }

    public function getFn(): ?string {
        return $this->fn;
    }
    public function setFn(?string $fn = null): self {
        $this->fn = $fn;
        return $this;
    }

    public function getFd(): ?string {
        return $this->fd;
    }
    public function setFd(?string $fd = null): self {
        $this->fd = $fd;
        return $this;
    }

    public function getFp(): ?string {
        return $this->fp;
    }
    public function setFp(?string $fp = null): self {
        $this->fp = $fp;
        return $this;
    }
}
