<?php

namespace IncCom\DTO\Request;

use IncCom\Enum\AccountType;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Request body for POST /api/accounts.
 */
class CreateAccountRequest
{
    #[Assert\NotBlank(message: 'Name is required')]
    public ?string $name = null;

    #[Assert\NotBlank(message: 'Type is required')]
    #[Assert\Choice(
        callback: [AccountType::class, 'values'],
        message: 'Invalid account type',
    )]
    public ?string $type = null;

    #[Assert\NotBlank(message: 'Currency is required')]
    #[Assert\Length(exactly: 3, exactMessage: 'Currency must be exactly 3 characters')]
    public ?string $currency = null;

    public ?int $order = null;
}
