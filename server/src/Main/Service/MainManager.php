<?php

namespace Main\Service;

use AbstractManager;

use Main\Entity\OU;
use Main\Entity\User;
use Main\Entity\Group;
use Main\Entity\Claimant;

use Main\Repository\OURepository;
use Main\Repository\UserRepository;
use Main\Repository\GroupRepository;
use Main\Repository\ClaimantRepository;

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


class MainManager extends AbstractManager  {
    public function __construct (ValidatorInterface $Validator) {
        parent::__construct($Validator);
    }
    public function getUserRepository (): ?UserRepository {
        return $this->getEntityManager()->getRepository(User::class);
        //return $this->container->getService(UserRepository::class);
    }
    protected function getPasswordHasher (): ?UserPasswordHasherInterface {
        return $this->container->get('security.user_password_hasher');
    }

    /**
     * @param mixed|null $user
     * @param array|null $arUser
     *
     * @throws ValidationFailedException
     *
     * @return User
     */
    public function user (mixed $user = null, ?array $arUser = null): User {
        if (is_int($user) && $user > 0) {
            $user = $this->getUserRepository()->find($user);
        } elseif (is_array($user)) {
            $user = $this->getUserRepository()->findOneBy($user);
        }
        if (!($user instanceof User)) {
            $user = new User();
        }
        if (empty($arUser)) {
            return $user;
        }
        if (array_key_exists('active', $arUser)) {
            $user->setActive((bool)$arUser['active']);
        }
        if (array_key_exists('loocked', $arUser)) {
            $user->setLoocked((bool)$arUser['loocked']);
        }
        if (array_key_exists('activeFrom', $arUser)) {
            $user->setActiveFrom($arUser['activeFrom']? new \DateTime($arUser['activeFrom']): null);
        }
        if (array_key_exists('activeTo', $arUser)) {
            $user->setActiveTo($arUser['activeTo']? new \DateTime($arUser['activeTo']): null);
        }
        if (array_key_exists('login', $arUser)) {
            $user->setLogin((string)$arUser['login']);
        }
        if (array_key_exists('password', $arUser)) {
            $user->setPassword((string)$arUser['password']);
        }
        if (array_key_exists('email', $arUser)) {
            $user->setEmail((string)$arUser['email']);
        }
        if (array_key_exists('alias', $arUser)) {
            $user->setAlias((string)$arUser['alias']);
        }
        if (array_key_exists('secondName', $arUser)) {
            $user->setSecondName((string)$arUser['secondName']);
        }
        if (array_key_exists('firstName', $arUser)) {
            $user->setFirstName((string)$arUser['firstName']);
        }
        if (array_key_exists('patronymic', $arUser)) {
            $user->setPatronymic((string)$arUser['patronymic']);
        }
        if (array_key_exists('gender', $arUser)) {
            $user->setGender((string)$arUser['gender']);
        }
        if (array_key_exists('description', $arUser)) {
            $user->setDescription((string)$arUser['description']);
        }
        if (array_key_exists('roles', $arUser)) {
            $user->setRoles((array)$arUser['roles']);
        }
        if (array_key_exists('ou', $arUser) && $arUser['ou'] instanceof OU) {
            $user->setOu($arUser['ou']);
        } elseif (array_key_exists('ou_id', $arUser) && (int)$arUser['ou_id'] > 0) {
            $user->setOu($this->ou((int)$arUser['ou_id']));
        }
        if (array_key_exists('parent', $arUser) && $arUser['parent'] instanceof User) {
            $user->setParent($arUser['parent']);
        } elseif (array_key_exists('parent_id', $arUser) && (int)$arUser['parent_id'] > 0) {
            $user->setParent($this->user((int)$arUser['parent_id']));
        }


        if (array_key_exists('accesses', $arUser)) {
            foreach ($user->getAccesses() as $access) {
                $arAccess = !empty($arUser['accesses'][$access->getId()])? $arUser['accesses'][$access->getId()]: null;
                if ($arAccess && (int)$arAccess['level'] > 0) {
                    $access->setLevel($arAccess['level']);
                } else {
                    $user->removeAccess($access);
                    $this->getEntityManager()->remove($access);
                }
                unset($arUser['accesses'][$access->getId()]);
            }
            foreach (($arUser['accesses'] ?: array()) as $arAccess) {
                if ($arAccess && (int)$arAccess['level'] > 0) {
                    $this->getEntityManager()->persist($access = $user->newAccess($this->claimant((int)$arAccess['claimant_id'])));
                    $access->setLevel($arAccess['level']);
                }
            }
        }

        if (array_key_exists('groups', $arUser)) {
            foreach ($user->getGroups() as $gu) {
                $arGu = !empty($arUser['groups'][$gu->getId()])? $arUser['groups'][$gu->getId()]: null;
                if ($arGu) {
                    if (array_key_exists('activeFrom', $arGu)) {
                        $gu->setActiveFrom($arGu['activeFrom'] ? new \DateTime($arGu['activeFrom']) : null);
                    }
                    if (array_key_exists('activeTo', $arGu)) {
                        $gu->setActiveTo($arGu['activeTo'] ? new \DateTime($arGu['activeTo']) : null);
                    }
                } else {
                    $user->removeGroup($gu);
                    $this->getEntityManager()->remove($gu);
                }
                unset($arUser['groups'][$gu->getId()]);
            }
            foreach (($arUser['groups'] ?: array()) as $arGu) {
                $this->getEntityManager()->persist($gu = $user->newGroup($this->group((int)$arGu['group_id'])));
                if (array_key_exists('activeFrom', $arGu)) {
                    $gu->setActiveFrom($arGu['activeFrom'] ? new \DateTime($arGu['activeFrom']) : null);
                }
                if (array_key_exists('activeTo', $arGu)) {
                    $gu->setActiveTo($arGu['activeTo'] ? new \DateTime($arGu['activeTo']) : null);
                }
            }
        }


        $errors = $this->getValidator()->validate($user);
        if ((isset($arUser['password']) || isset($arUser['confirm_password'])) && $arUser['confirm_password'] != $arUser['password']) {
            $errors->add(new ConstraintViolation("Пароли не совподают", "", [$arUser['password'], $arUser['confirm_password']], "", "password"));
        }
        if (count($errors) > 0) {
            throw new ValidationFailedException($arUser, $errors);
        }
        $this->getUserRepository()->save($user, true);
        if (isset($arUser['password']) && $arUser['confirm_password'] == $arUser['password']) {
            $hashedPassword = $this->getPasswordHasher()->hashPassword($user, $arUser['password']);
            $this->getUserRepository()->upgradePassword($user, $hashedPassword);
        }
        return $user;
    }
}
