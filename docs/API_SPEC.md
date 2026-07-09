# REST API Specification

> Базовый URL: `/api`  
> Аутентификация: JWT Bearer (`Authorization: Bearer <token>`)  
> Refresh: `POST /api/token/refresh` (gesdinet/jwt-refresh-token-bundle)

## Текущее состояние vs целевое

| Область | Текущее | Целевое (ТЗ) |
|---------|---------|--------------|
| Счета | `GET/POST /api/inc-com/account` | `/api/accounts` |
| Категории | `GET/POST /api/inc-com/category` | `/api/accounts/{id}/categories` |
| Пагинация | `limit`, `offset`, `totalItems` | `page`, `size`, `total`, `pages` |
| Поля | `label`, `sort`, `owner_id` | `name`, `order`, `masterId` |
| Транзакции | нет контроллера | `/api/transactions` |
| Переводы | `link_id` в Transaction | `/api/transfers` |

**Стратегия миграции API:** новые контроллеры по путям ТЗ; старые `/api/inc-com/*` — deprecated-адаптеры на 1 релиз (опционально).

---

## Общие соглашения

### Пагинация (query)

| Параметр | Тип | Default | Max |
|----------|-----|---------|-----|
| page | int | 1 | — |
| size | int | 15 | 100 |

### Формат ответа списка

```json
{
  "items": [],
  "total": 42,
  "page": 1,
  "size": 15,
  "pages": 3
}
```

### Ошибки

```json
{
  "error": "Validation failed",
  "violations": {
    "name": "Название обязательно"
  }
}
```

| HTTP | Когда |
|------|-------|
| 400 | Ошибка валидации |
| 401 | Не авторизован |
| 403 | Нет прав (не мастер, не автор) |
| 404 | Сущность не найдена |
| 409 | Конфликт (дубликат имени, удаление с зависимостями) |
| 422 | Бизнес-правило (счёт с транзакциями, категория в использовании) |

### DTO-маппинг полей (legacy → API)

| Legacy (БД/код) | API (ТЗ) |
|-----------------|----------|
| label | name |
| sort | order |
| owner / owner_id | master / masterId |
| owner (transaction) | author / authorId |

---

## 1. Аутентификация `/api/auth`

> JWT уже настроен через `security.yaml`. Эндпоинты ниже — целевые обёртки.

### POST `/api/auth/register`

**Request:**
```json
{
  "login": "user1",
  "email": "user@example.com",
  "password": "secret",
  "name": "Иван Иванов"
}
```

**Response 201:**
```json
{
  "id": 1,
  "login": "user1",
  "email": "user@example.com",
  "name": "Иван Иванов"
}
```

**Текущее:** `POST /api/registration/save_data` (Main) — адаптировать.

### POST `/api/auth/login`

**Текущее:** `POST /api/login` (json_login, username/password).

**Response 200:**
```json
{
  "token": "<jwt>",
  "refresh_token": "<refresh>"
}
```

### POST `/api/auth/refresh`

**Текущее:** `POST /api/token/refresh` с `{ "refresh_token": "..." }`.

### POST `/api/auth/logout`

Инвалидация refresh token (stateless).

### GET `/api/auth/me`

**Response:**
```json
{
  "id": 1,
  "login": "user1",
  "email": "user@example.com",
  "name": "Иван",
  "roles": ["ROLE_USER"]
}
```

---

## 2. Счета `/api/accounts`

**Права:** список — мастер + участник; редактирование — только мастер.

### GET `/api/accounts`

**Query:** `type`, `currency`, `page`, `size`  
**Sort:** `order` ASC → `name` ASC

**Response item:**
```json
{
  "id": 1,
  "name": "Основной",
  "description": null,
  "currency": "USD",
  "type": "debit",
  "order": 100,
  "color": "#FF5733",
  "icon": "wallet",
  "number": "****1234",
  "balance": "1500.00",
  "masterId": 1,
  "isMaster": true,
  "createdAt": "2026-01-01T00:00:00+00:00",
  "updatedAt": "2026-01-15T00:00:00+00:00"
}
```

> `number` — только если `isMaster === true`, иначе `null`.

### POST `/api/accounts`

**Request:**
```json
{
  "name": "Накопления",
  "description": "Подушка",
  "currency": "RUB",
  "type": "saving",
  "order": 200,
  "color": "#00FF00",
  "icon": "piggy-bank",
  "number": "40817810..."
}
```

### GET `/api/accounts/{id}`

### PUT `/api/accounts/{id}`

Только мастер.

### DELETE `/api/accounts/{id}`

Только мастер. **409** если есть транзакции.

### POST `/api/accounts/{id}/users`

Добавить участника. **Request:** `{ "userId": 5 }` или `{ "login": "partner" }`.

### DELETE `/api/accounts/{id}/users/{userId}`

Удалить участника (не мастера).

---

## 3. Категории транзакций `/api/accounts/{accountId}/categories`

### GET `/`

**Query:** `type` (income|expense), `createdBy`, `page`, `size`  
**Sort:** `name` ASC

**Response item:**
```json
{
  "id": 1,
  "name": "Продукты",
  "type": "expense",
  "accountId": 1,
  "createdById": 2,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### POST `/`

Любой участник счёта.

### PUT `/{id}`

Автор или мастер.

### DELETE `/{id}`

Автор или мастер. **422** если есть транзакции.

### POST `/api/accounts/{fromAccountId}/categories/copy`

**Request:**
```json
{
  "targetAccountId": 2,
  "type": "expense",
  "categoryIds": [1, 3, 5]
}
```

**Response:**
```json
{
  "copied": 2,
  "skipped": [
    { "name": "Продукты", "reason": "duplicate" }
  ]
}
```

---

## 4. Категории товаров `/api/item-categories`

### GET `/`

**Query:** `search` (name/keywords), `parent` (id|null), `page`, `size`

**Response item:**
```json
{
  "id": 1,
  "name": "Продукты",
  "parentId": null,
  "keywords": ["молоко", "хлеб"],
  "childrenCount": 3
}
```

### POST `/`

```json
{
  "name": "Молочные",
  "parentId": 1,
  "keywords": ["молоко", "кефир"]
}
```

### PUT `/{id}`

### DELETE `/{id}`

**422** если привязаны товары. Дочерние → `parentId = null`.

---

## 5. Товары `/api/items`

### GET `/`

**Query:** `category`, `search`, `page`, `size`

**Response item:**
```json
{
  "id": 1,
  "name": "Молоко 3.2%",
  "description": "Простоквашино",
  "unit": "л",
  "categoryIds": [2, 5]
}
```

### POST `/`

**409** при дубликате `name` у пользователя.

### PUT `/{id}`

### DELETE `/{id}`

**422** если используется в `TransactionItem`.

---

## 6. Транзакции `/api/transactions`

### GET `/`

**Query (обязательный `account`):** `account`, `type`, `category`, `dateFrom`, `dateTo`, `mcc`, `author`, `page`, `size`  
**Sort:** `date` DESC

**Response item:**
```json
{
  "id": 1,
  "type": "expense",
  "amount": "1250.50",
  "date": "2026-02-01T14:30:00+00:00",
  "comment": "Пятёрочка",
  "accountId": 1,
  "authorId": 1,
  "categoryId": 5,
  "mcc": "5411",
  "isManualAmount": false,
  "fn": "72890000...",
  "fpd": "1234567890",
  "fp": null,
  "fd": "12345",
  "transferId": null,
  "items": [
    {
      "id": 1,
      "itemId": 10,
      "itemName": "Молоко",
      "quantity": "2",
      "price": "89.90",
      "sum": "179.80"
    }
  ]
}
```

### POST `/`

**Income:**
```json
{
  "type": "income",
  "amount": "5000.00",
  "date": "2026-02-01T10:00:00+00:00",
  "accountId": 1,
  "categoryId": 3,
  "comment": "Зарплата"
}
```

**Expense:**
```json
{
  "type": "expense",
  "date": "2026-02-01T14:30:00+00:00",
  "accountId": 1,
  "categoryId": 5,
  "isManualAmount": false,
  "fn": "...",
  "fpd": "...",
  "fd": "...",
  "items": [
    { "itemId": 10, "quantity": "2", "price": "89.90" }
  ]
}
```

> Если `isManualAmount: false` — `amount` вычисляется сервером.

### GET `/{id}`

### PUT `/{id}`

Только автор. Пересчёт баланса при изменении `amount`.

### DELETE `/{id}`

Только автор. Возврат баланса.

---

## 7. Переводы `/api/transfers`

### GET `/`

**Query:** `fromAccount`, `toAccount`, `dateFrom`, `dateTo`, `page`, `size`

**Response item:**
```json
{
  "id": 1,
  "amount": "1000.00",
  "date": "2026-02-01T12:00:00+00:00",
  "comment": "На накопления",
  "fromAccountId": 1,
  "toAccountId": 2,
  "authorId": 1,
  "outgoingTransactionId": 10,
  "incomingTransactionId": 11
}
```

### POST `/`

```json
{
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": "1000.00",
  "date": "2026-02-01T12:00:00+00:00",
  "comment": "Перевод"
}
```

Создаёт Transfer + 2 Transaction атомарно.

### GET `/{id}`

### PUT `/{id}`

Только автор. Синхронное обновление обеих транзакций и балансов.

### DELETE `/{id}`

Только автор. Удаляет Transfer + обе Transaction, возвращает балансы.

---

## Сервисный слой (бэкенд)

| Сервис | Ответственность |
|--------|-----------------|
| `AccountAccessService` | Проверка мастер/участник |
| `BalanceService` | Атомарное обновление `balance` |
| `TransactionService` | CRUD, пересчёт amount, fiscal fields |
| `TransferService` | Парные транзакции, атомарность |
| `CategoryCopyService` | Копирование категорий между счетами |
| `PaginationService` | Единый формат page/size |

### Voters (Symfony Security)

```php
AccountVoter::EDIT      // master only
AccountVoter::VIEW      // master + participant
TransactionVoter::EDIT  // author only
TransactionCategoryVoter::EDIT  // author or master
ItemVoter::MANAGE       // owner only
TransferVoter::EDIT     // author only
```

---

## Переиспользование из текущего кода

| Компонент | Переиспользование |
|-----------|-------------------|
| `AbstractRepository` | ✅ фильтрация, сортировка, пагинация (доработать под page/size) |
| `AbstractManager` | ✅ базовый менеджер, валидация |
| `IncComManager` | 🔄 расширить методами transaction/transfer/item |
| `AccountController` | 🔄 рефакторинг → `AccountsController` |
| `CategoryController` | 🔄 вложенный роут + copy endpoint |
| JWT + refresh | ✅ готово |
| `security.yaml` | ✅ готово |
