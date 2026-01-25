<?php

namespace IncCom\Service;

use AbstractManager;

use Main\Entity\User;
use Main\Repository\UserRepository;

use IncCom\Entity\Account;
use IncCom\Entity\Category;
use IncCom\Repository\AccountRepository;
use IncCom\Repository\CategoryRepository;

use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Validator\TraceableValidator;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\DependencyInjection\ReverseContainer;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Contracts\Service\ServiceSubscriberInterface;

use Symfony\Component\Validator\Exception\ValidationFailedException;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationListInterface;


class IncComManager extends AbstractManager  {
    public function __construct (ValidatorInterface $Validator) {
        parent::__construct($Validator);
    }
    public function getUserRepository (): ?UserRepository {
        return $this->getEntityManager()->getRepository(User::class);
        //return $this->container->getService(UserRepository::class);
    }
    public function getAccountRepository (): ?AccountRepository {
        return $this->getEntityManager()->getRepository(Account::class);
        //return $this->container->getService(UserRepository::class);
    }

    public function getCategoryRepository (): ?CategoryRepository {
        return $this->getEntityManager()->getRepository(Category::class);
        //return $this->container->getService(UserRepository::class);
    }

    /**
     * @param mixed|null $account
     * @param array|null $arAccount
     *
     * @throws ValidationFailedException
     *
     * @return Account
     */
    public function account (mixed $account = null, ?array $arAccount = null): Account {
        if (is_int($account) && $account > 0) {
            $account = $this->getAccountRepository()->find($account);
        } elseif (is_array($account)) {
            $account = $this->getAccountRepository()->findOneBy($account);
        }
        if (!($account instanceof Account)) {
            $account = new Account();
        }
        if (empty($arAccount)) {
            return $account;
        }
        if (array_key_exists('label', $arAccount)) {
            $account->setLabel($arAccount['label']);
        }
        if (array_key_exists('balance', $arAccount)) {
            $account->setBalance($arAccount['balance']);
        }
        if (array_key_exists('sort', $arAccount)) {
            $account->setSort($arAccount['sort']);
        }
        if (array_key_exists('type', $arAccount)) {
            $account->setType($arAccount['type']);
        }
        if (array_key_exists('owner_id', $arAccount)) {
            $account->setOwner($this->getUserRepository()->find($arAccount['owner_id']));
        }

        $errors = $this->getValidator()->validate($account);
        if (count($errors) > 0) {
            throw new ValidationFailedException($arAccount, $errors);
        }
        $this->getAccountRepository()->save($account, true);

        return $account;
    }

    /**
     * @param mixed|null $category
     * @param array|null $arCategory
     *
     * @throws ValidationFailedException
     *
     * @return Category
     */
    public function category (mixed $category = null, ?array $arCategory = null): Category {
        if (is_int($category) && $category > 0) {
            $category = $this->getCategoryRepository()->find($category);
        } elseif (is_array($category)) {
            $category = $this->getCategoryRepository()->findOneBy($category);
        }
        if (!($category instanceof Category)) {
            $category = new Category();
        }
        if (empty($arCategory)) {
            return $category;
        }
        if (array_key_exists('label', $arCategory)) {
            $category->setLabel($arCategory['label']);
        }
        if (array_key_exists('sort', $arCategory)) {
            $category->setSort($arCategory['sort']);
        }
        if (array_key_exists('type', $arCategory)) {
            $category->setType($arCategory['type']);
        }
        if (array_key_exists('account_id', $arCategory)) {
            $category->setOwner($this->getAccountRepository()->find($arCategory['account_id']));
        }
        if (array_key_exists('owner_id', $arCategory)) {
            $category->setOwner($this->getUserRepository()->find($arCategory['owner_id']));
        } elseif (!$category->getOwner()) {
            $category->setOwner($category->getAccount()->getOwner());
        }

        $errors = $this->getValidator()->validate($category);
        if (count($errors) > 0) {
            throw new ValidationFailedException($arCategory, $errors);
        }
        $this->getCategoryRepository()->save($category, true);

        return $category;
    }
}
