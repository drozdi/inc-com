<?php
namespace IncCom\Controller;

use Main\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Exception\ValidationFailedException;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;

use IncCom\Entity\Account;
use IncCom\Entity\Category;
use IncCom\Repository\AccountRepository;
use IncCom\Repository\CategoryRepository;
use IncCom\Service\IncComManager;
use Main\Repository\UserRepository;

#[Route('/api/inc-com/category', name: 'api_inccom_category_')]
class CategoryController extends AbstractController {
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list (Request $request, #[CurrentUser] ?User $user, CategoryRepository $CategoryRepository, AccountRepository $AccountRepository): JsonResponse {
        $req = [
            'limit' => -1,
            'offset' => 0,
            'sortBy' => [[
                'key' => "sort",
                'order' => "ASC"
            ]],
            'filters' => [
                'account' => array_map(function ($account) {
                    return $account->getId();
                }, $AccountRepository->findFilter([
                    'owner' => $user->getId()
                ]))
            ]
        ];
        $req['limit'] = (int)$req['limit'];
        $req['offset'] = (int)$req['offset'];
        $totalItems = $CategoryRepository->cnt($req['filters']);
        $query = $CategoryRepository->getQueryBuilder($req['filters'], $req['sortBy'], $req['limit'], $req['offset']);
        $query = $query->getQuery();
        $items = [];

        foreach ($query->execute() as $category) {
            $items[] = [
                'id' => $category->getId(),
                'x_timestamp' => $category->getXTimestamp('Y-m-d H:i:s'),
                'account' => $category->getAccount()->getLabel() ?? '',
                'account_id' => $category->getAccount()->getId() ?? '',
                'label'=> $category->getLabel() ?? '',
                'sort'=> $category->getSort() ?? 100,
                'type'=> $category->getType() ?? '',
                'owner' => $category->getOwner()->getAlias() ?? '',
                'owner_id' => $category->getOwner()->getId() ?? '',
                'mcc' => $category->getMcc() ?? '',
            ];
        }

        $start = $req['limit']*($req['offset']-1);
        $end = ($req['limit'] > 0? $req['limit']*$req['offset']: $totalItems)-1;
        $end = $end > $totalItems - 1? $totalItems - 1: $end;

        return $this->json([
            'items' => $items,
            'countItems' => count($items),
            'totalItems' => $totalItems,
            'limit' => $req['limit'],
            'offset' => $req['offset'],
            'next' => $req['offset'] + 1,
            'prev' => $req['offset'] - 1,
            'total' => (int)($totalItems / $req['limit']),
        ], Response::HTTP_OK, [
            'Content-Range' => sprintf("items %d-%d/%d", $start, $end, $totalItems),
            'Content-Page' => sprintf("page %d/%d", $req['offset'], (int)($totalItems / $req['limit']))
        ]);
    }
    #[Route('/', name: 'create', methods: ['POST'])]
    public function create (Request $request, #[CurrentUser] ?User $user, IncComManager $IncComManager): JsonResponse {
        $req = $request->toArray();
        $IncComManager->getEntityManager()->getConnection()->beginTransaction();
        try {
            $req['owner_id'] = $user->getId();
            $category = $IncComManager->category(0, $req);
            $IncComManager->getEntityManager()->getConnection()->commit();
        } catch (ValidationFailedException $e) {
            $IncComManager->getEntityManager()->getConnection()->rollBack();
            return $this->json($IncComManager->parseViolation($e->getViolations()), Response::HTTP_BAD_REQUEST);
        }
        return $this->json([
            'id' => $category->getId(),
            'x_timestamp' => $category->getXTimestamp('Y-m-d H:i:s'),
            'account' => $category->getAccount()->getLabel() ?? '',
            'account_id' => $category->getAccount()->getId() ?? '',
            'owner' => $category->getOwner()->getAlias() ?? '',
            'owner_id' => $category->getOwner()->getId() ?? '',
            'label'=> $category->getLabel() ?? '',
            'sort'=> $category->getSort() ?? 100,
            'type'=> $category->getType() ?? '',
            'mcc' => $category->getMcc() ?? ''
        ], Response::HTTP_CREATED);
    }
    #[Route('/{id}', name: 'read', methods: ['GET'])]
    public function detail (int $id, CategoryRepository $CategoryRepository): JsonResponse {
        $category = $CategoryRepository->find($id);
        return $this->json([
            'id' => $category->getId(),
            'x_timestamp' => $category->getXTimestamp('Y-m-d H:i:s'),
            'account' => $category->getAccount()->getLabel() ?? '',
            'account_id' => $category->getAccount()->getId() ?? '',
            'owner' => $category->getOwner()->getAlias() ?? '',
            'owner_id' => $category->getOwner()->getId() ?? '',
            'label'=> $category->getLabel() ?? '',
            'sort'=> $category->getSort() ?? 100,
            'type'=> $category->getType() ?? '',
            'mcc' => $category->getMcc() ?? ''
        ]);
    }
    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    public function update (int $id, Request $request, IncComManager $IncComManager): JsonResponse {
        $req = $request->toArray();
        $IncComManager->getEntityManager()->getConnection()->beginTransaction();
        try {
            $category = $IncComManager->category((int)$id, $req);
            $IncComManager->getEntityManager()->getConnection()->commit();
        } catch (ValidationFailedException $e) {
            $IncComManager->getEntityManager()->getConnection()->rollBack();
            return $this->json($IncComManager->parseViolation($e->getViolations()), Response::HTTP_BAD_REQUEST);
        }
        return $this->json([
            'id' => $category->getId(),
            'x_timestamp' => $category->getXTimestamp('Y-m-d H:i:s'),
            'account' => $category->getAccount()->getLabel() ?? '',
            'account_id' => $category->getAccount()->getId() ?? '',
            'owner' => $category->getOwner()->getAlias() ?? '',
            'owner_id' => $category->getOwner()->getId() ?? '',
            'label'=> $category->getLabel() ?? '',
            'sort'=> $category->getSort() ?? 100,
            'type'=> $category->getType() ?? '',
            'mcc' => $category->getMcc() ?? ''
        ], Response::HTTP_OK);
    }
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function remove (int $id, CategoryRepository $CategoryRepository): JsonResponse {
        $category = $CategoryRepository->find($id);
        $arr = [
            'id' => $category->getId(),
            'x_timestamp' => $category->getXTimestamp('Y-m-d H:i:s'),
            'account' => $category->getAccount()->getLabel() ?? '',
            'account_id' => $category->getAccount()->getId() ?? '',
            'owner' => $category->getOwner()->getAlias() ?? '',
            'owner_id' => $category->getOwner()->getId() ?? '',
            'label'=> $category->getLabel() ?? '',
            'sort'=> $category->getSort() ?? 100,
            'type'=> $category->getType() ?? '',
            'mcc' => $category->getMcc() ?? ''
        ];
        $CategoryRepository->remove($category, true);
        return $this->json($arr, Response::HTTP_OK);
    }
}
