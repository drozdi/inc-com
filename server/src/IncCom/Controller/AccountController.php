<?php
namespace IncCom\Controller;

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
use IncCom\Repository\AccountRepository;
use IncCom\Service\IncComManager;
use Main\Repository\UserRepository;

#[Route('/api/inc-com/account', name: 'api_inccom_account_')]
class AccountController extends AbstractController {
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list (Request $request, AccountRepository $accountRepository): JsonResponse {
        $req = [
            'limit' => -1,
            'offset' => 0,
            'sortBy' => [[
                'key' => "sort",
                'order' => "ASC"
            ]],
            'filters' => []
        ];
        // var_dump($request->toArray());
        // $req = array_merge([
        //     't' => "list",
        //     'limit' => -1,
        //     'offset' => 0,
        //     'sortBy' => [[
        //         'key' => "sort",
        //         'order' => "ASC"
        //     ]],
        //     'filters' => []
        // ], $request->toArray());
        $req['limit'] = (int)$req['limit'];
        $req['offset'] = (int)$req['offset'];
        $totalItems = $accountRepository->cnt($req['filters']);
        $query = $accountRepository->getQueryBuilder($req['filters'], $req['sortBy'], $req['limit'], $req['offset']);
        $query = $query->getQuery();
        $items = [];

        foreach ($query->execute() as $account) {
            $items[] = [
                'id' => $account->getId(),
                'x_timestamp' => $account->getXTimestamp('Y-m-d H:i:s'),
                'owner' => $account->getOwner()->getAlias() ?? '',
                'owner_id' => $account->getOwner()->getId() ?? '',
                'label'=> $account->getLabel() ?? '',
                'balance'=> $account->getBalance() ?? 0,
                'sort'=> $account->getSort() ?? 100,
                'type'=> $account->getType() ?? ''
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
    public function create (Request $request, IncComManager $IncComManager): JsonResponse {
        $req = $request->toArray();
        $IncComManager->getEntityManager()->getConnection()->beginTransaction();
        try {
            $account = $IncComManager->account(0, array_merge($req, [
                'owner_id' => 1,
            ]));
            $IncComManager->getEntityManager()->getConnection()->commit();
        } catch (ValidationFailedException $e) {
            $IncComManager->getEntityManager()->getConnection()->rollBack();
            return $this->json($IncComManager->parseViolation($e->getViolations()), Response::HTTP_BAD_REQUEST);
        }
        return $this->json([
            'id' => $account->getId(),
            'x_timestamp' => $account->getXTimestamp('Y-m-d H:i:s'),
            'owner' => $account->getOwner()->getAlias() ?? '',
            'owner_id' => $account->getOwner()->getId() ?? '',
            'label'=> $account->getLabel() ?? '',
            'balance'=> $account->getBalance() ?? 0,
            'sort'=> $account->getSort() ?? 100,
            'type'=> $account->getType() ?? ''
        ], Response::HTTP_CREATED);
    }
    #[Route('/{id}', name: 'read', methods: ['GET'])]
    public function detail (int $id, AccountRepository $AccountRepository): JsonResponse {
        $account = $AccountRepository->find($id);
        return $this->json([
            'id' => $account->getId(),
            'x_timestamp' => $account->getXTimestamp('Y-m-d H:i:s'),
            'owner' => $account->getOwner()->getAlias() ?? '',
            'owner_id' => $account->getOwner()->getId() ?? '',
            'label'=> $account->getLabel() ?? '',
            'balance'=> $account->getBalance() ?? 0,
            'sort'=> $account->getSort() ?? 100,
            'type'=> $account->getType() ?? ''
        ]);
    }
    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    public function update (int $id, Request $request, IncComManager $IncComManager): JsonResponse {
        $req = $request->toArray();
        $IncComManager->getEntityManager()->getConnection()->beginTransaction();
        try {
            $account = $IncComManager->account((int)$id, $req);
            $IncComManager->getEntityManager()->getConnection()->commit();
        } catch (ValidationFailedException $e) {
            $IncComManager->getEntityManager()->getConnection()->rollBack();
            return $this->json($IncComManager->parseViolation($e->getViolations()), Response::HTTP_BAD_REQUEST);
        }
        return $this->json([
            'id' => $account->getId(),
            'x_timestamp' => $account->getXTimestamp('Y-m-d H:i:s'),
            'owner' => $account->getOwner()->getAlias() ?? '',
            'owner_id' => $account->getOwner()->getId() ?? '',
            'label'=> $account->getLabel() ?? '',
            'balance'=> $account->getBalance() ?? 0,
            'sort'=> $account->getSort() ?? 100,
            'type'=> $account->getType() ?? ''
        ], Response::HTTP_OK);
    }
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function remove (int $id, AccountRepository $AccountRepository): JsonResponse {
        $account = $AccountRepository->find($id);
        $arr = [
            'id' => $account->getId(),
            'x_timestamp' => $account->getXTimestamp('Y-m-d H:i:s'),
            'owner' => $account->getOwner()->getAlias() ?? '',
            'owner_id' => $account->getOwner()->getId() ?? '',
            'label'=> $account->getLabel() ?? '',
            'balance'=> $account->getBalance() ?? 0,
            'sort'=> $account->getSort() ?? 100,
            'type'=> $account->getType() ?? ''
        ];
        $AccountRepository->remove($account, true);
        return $this->json($arr, Response::HTTP_OK);
    }
}
