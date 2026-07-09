<?php

namespace App\Controller;

use App\Entity\RefreshToken;
use Doctrine\ORM\EntityManagerInterface;
use IncCom\DTO\DtoValidator;
use IncCom\DTO\Request\RegisterUserRequest;
use Main\Entity\User;
use Main\Service\MainManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Exception\ValidationFailedException;

#[Route('/api/auth', name: 'api_auth_')]
class ApiAuthController extends AbstractController
{
    public function __construct(
        private readonly DtoValidator $dtoValidator,
    ) {
    }

    /**
     * Register a new user (public).
     */
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, MainManager $mainManager): JsonResponse
    {
        try {
            $dto = $this->dtoValidator->validate($request->toArray(), RegisterUserRequest::class);
        } catch (ValidationFailedException $e) {
            return $this->dtoValidator->toJsonResponse($e);
        }

        $arUser = [
            'login' => $dto->login,
            'email' => $dto->email,
            'password' => $dto->password,
            'confirm_password' => $dto->password,
            'alias' => $dto->name ?? $dto->login,
        ];

        $mainManager->getEntityManager()->getConnection()->beginTransaction();
        try {
            $user = $mainManager->user(0, $arUser);
            $mainManager->getEntityManager()->getConnection()->commit();
        } catch (ValidationFailedException $e) {
            $mainManager->getEntityManager()->getConnection()->rollBack();

            return $this->json([
                'error' => 'Validation failed',
                'violations' => $mainManager->parseViolation($e->getViolations()),
            ], Response::HTTP_BAD_REQUEST);
        }

        return $this->json($this->mapUser($user), Response::HTTP_CREATED);
    }

    /**
     * Return the currently authenticated user.
     */
    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if ($user === null) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            ...$this->mapUser($user),
            'roles' => $user->getRoles(),
        ]);
    }

    /**
     * Documenting alias: real login is POST /api/login.
     */
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        return $this->json([
            'error' => 'Use POST /api/login',
            'hint' => 'Send JSON body with "username" and "password" fields',
        ], Response::HTTP_BAD_REQUEST);
    }

    /**
     * Documenting alias: real refresh is POST /api/token/refresh.
     */
    #[Route('/refresh', name: 'refresh', methods: ['POST'])]
    public function refresh(): JsonResponse
    {
        return $this->json([
            'error' => 'Use POST /api/token/refresh',
            'hint' => 'Send JSON body with "refresh_token" field',
        ], Response::HTTP_BAD_REQUEST);
    }

    /**
     * Invalidate a refresh token (stateless logout).
     */
    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = $request->toArray();
        $refreshTokenValue = $data['refresh_token'] ?? null;

        if (!is_string($refreshTokenValue) || $refreshTokenValue === '') {
            return $this->json([
                'error' => 'Validation failed',
                'violations' => ['refresh_token' => 'Refresh token is required'],
            ], Response::HTTP_BAD_REQUEST);
        }

        $refreshToken = $entityManager->getRepository(RefreshToken::class)
            ->findOneBy(['refreshToken' => $refreshTokenValue]);

        if ($refreshToken !== null) {
            $entityManager->remove($refreshToken);
            $entityManager->flush();
        }

        return $this->json(['success' => true]);
    }

    /**
     * @return array{id: int|null, login: string|null, email: string|null, name: string|null}
     */
    private function mapUser(User $user): array
    {
        return [
            'id' => $user->getId(),
            'login' => $user->getLogin(),
            'email' => $user->getEmail(),
            'name' => $user->getAlias(),
        ];
    }
}
