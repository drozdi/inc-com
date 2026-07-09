# Схема базы данных

> Целевая схема по ТЗ с учётом эволюционной миграции из текущего состояния `server/`.
> Таблицы сохраняют префикс `inccom_`, сущность `User` остаётся в `main_user`.

## Легенда

| Статус | Значение |
|--------|----------|
| ✅ | Уже есть в БД/коде, доработка минимальна |
| 🔄 | Есть, требует рефакторинга полей/связей |
| ➕ | Нужно добавить |

---

## 1. User (`main_user`)

**Класс:** `Main\Entity\User` — **не переносить**, использовать как есть.

| Поле (ТЗ) | Поле (текущее) | Тип | Статус |
|-----------|----------------|-----|--------|
| id | id | INT PK | ✅ |
| email | email | VARCHAR(255) nullable | ✅ |
| password | password | VARCHAR(255) | ✅ |
| name | alias (+ login как идентификатор) | VARCHAR(255) | 🔄 |
| createdAt | date_register | DATETIME | 🔄 |
| updatedAt | x_timestamp | DATETIME (version) | ✅ |

**Решение:** в API отдавать `name` = `alias`, `login` — отдельное поле аутентификации. Регистрация через существующий механизм `Main`.

---

## 2. Account (`inccom_account`)

**Класс:** `IncCom\Entity\Account`

| Поле (ТЗ) | Поле (текущее) | Тип | Статус |
|-----------|----------------|-----|--------|
| id | id | INT PK | ✅ |
| name | label | VARCHAR(255) | 🔄 rename в API |
| description | — | TEXT nullable | ➕ |
| currency | — | VARCHAR(3) default 'USD' | ➕ |
| type | type | ENUM string | ✅ |
| order | sort | INT default 100 | 🔄 rename в API |
| color | color | VARCHAR(7) | ✅ |
| icon | icon | VARCHAR(255) | ✅ |
| number | — | VARCHAR(255) nullable | ➕ |
| balance | balance | NUMERIC(16,2) default 0 | ✅ |
| master | owner_id → owner | FK main_user | 🔄 rename master |
| users | — | M2M join table | ➕ |
| createdAt | — | DATETIME | ➕ |
| updatedAt | x_timestamp | DATETIME (version) | ✅ |

### Join table: `inccom_account_user` ➕

```sql
CREATE TABLE inccom_account_user (
    account_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (account_id, user_id),
    FOREIGN KEY (account_id) REFERENCES inccom_account(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES main_user(id) ON DELETE CASCADE
);
```

**Doctrine:**
```php
#[ORM\ManyToOne(targetEntity: User::class)]
#[ORM\JoinColumn(name: 'owner_id', ...)]  // master
private ?User $master;

#[ORM\ManyToMany(targetEntity: User::class)]
#[ORM\JoinTable(name: 'inccom_account_user')]
private Collection $users;
```

**Бизнес-правила:**
- При создании счёта `master` = текущий пользователь, `users` пуст.
- Удаление запрещено при наличии транзакций на счёте.
- `balance` — кэш, обновляется через `BalanceService` (pessimistic lock + `x_timestamp` version).

---

## 3. TransactionCategory (`inccom_category`)

**Класс:** `IncCom\Entity\Category` → постепенный rename в `TransactionCategory` (опционально).

| Поле (ТЗ) | Поле (текущее) | Тип | Статус |
|-----------|----------------|-----|--------|
| id | id | INT PK | ✅ |
| name | label | VARCHAR(255) | 🔄 |
| type | type | VARCHAR (income/expense) | ✅ |
| account | account_id | FK inccom_account | ✅ |
| createdBy | owner_id → owner | FK main_user | 🔄 rename |
| createdAt | — | DATETIME | ➕ |
| updatedAt | x_timestamp | DATETIME (version) | ✅ |
| mcc | mcc | INT | ❌ **перенести на Transaction** |

**Удалить:** поле `mcc` из категории (миграция), `sort` оставить для UI-сортировки (не в ТЗ, но полезно).

**Бизнес-правила:**
- Удаление запрещено при связанных транзакциях.
- Копирование — отдельная операция (см. API).

---

## 4. ItemCategory (`inccom_tag`)

**Класс:** `IncCom\Entity\Tag` → rename в `ItemCategory`.

| Поле (ТЗ) | Поле (текущее) | Тип | Статус |
|-----------|----------------|-----|--------|
| id | id | INT PK | ✅ |
| name | label | VARCHAR(255) | 🔄 |
| parent | parent_id | self-ref nullable | ✅ |
| user | owner_id | FK main_user | ✅ |
| keywords | — | TEXT nullable (JSON/CSV) | ➕ |
| createdAt | — | DATETIME | ➕ |
| updatedAt | x_timestamp | DATETIME (version) | ✅ |

**Удалить:** `sort`, `level` — вычислять глубину в сервисе при необходимости.

**При удалении родителя:** `parent = null` для дочерних (ON DELETE SET NULL уже есть).

---

## 5. Item (`inccom_product`)

**Класс:** `IncCom\Entity\Product` → **полный рефакторинг**.

### Текущее (неверно по ТЗ)
- Привязан к `transaction_id` (позиция чека, не справочник товара).

### Целевое

| Поле (ТЗ) | Тип | Статус |
|-----------|-----|--------|
| id | INT PK | ✅ |
| name | VARCHAR(255) | 🔄 из label |
| description | TEXT nullable | ➕ |
| unit | VARCHAR(50) nullable | ➕ |
| user | FK main_user | ➕ (заменить transaction_id) |
| createdAt | DATETIME | ➕ |
| updatedAt | DATETIME (version) | ✅ |

### Join table: `inccom_item_item_category` ➕

Заменяет `inccom_product_tag`:

```sql
CREATE TABLE inccom_item_item_category (
    item_id INT NOT NULL,
    item_category_id INT NOT NULL,
    PRIMARY KEY (item_id, item_category_id),
    FOREIGN KEY (item_id) REFERENCES inccom_product(id) ON DELETE CASCADE,
    FOREIGN KEY (item_category_id) REFERENCES inccom_tag(id) ON DELETE CASCADE
);
```

**Уникальность:** `UNIQUE (user_id, name)` — индекс на `inccom_product`.

**Миграция данных:** существующие `inccom_product` без пользователя — архивировать/удалить (dev-данные).

---

## 6. Transaction (`inccom_transaction`)

**Класс:** `IncCom\Entity\Transaction` — доработать.

| Поле (ТЗ) | Поле (текущее) | Тип | Статус |
|-----------|----------------|-----|--------|
| id | id | INT PK | ✅ |
| type | type | ENUM income/expense | 🔄 исправить маппинг |
| amount | amount | NUMERIC(16,2) | ✅ |
| date | date | DATETIME | ✅ |
| comment | comment | TEXT nullable | ✅ |
| account | account_id | FK | ✅ |
| author | owner_id | FK main_user | 🔄 rename |
| category | category_id | FK nullable | ✅ |
| mcc | — | VARCHAR(10) nullable | ➕ (из category) |
| isManualAmount | — | BOOLEAN default false | ➕ |
| fn | fn | VARCHAR(20) | ✅ |
| fpd | — | VARCHAR(20) | ➕ |
| fp | fp | VARCHAR(20) | ✅ |
| fd | fd | VARCHAR(20) | ✅ |
| transfer | — | FK inccom_transfer nullable | ➕ |
| createdAt | — | DATETIME | ➕ |
| updatedAt | x_timestamp | DATETIME (version) | ✅ |

**Удалить:** `link_id` (self-ref) → заменить сущностью `Transfer`.  
**Удалить:** `loaded` — не в ТЗ.

**Связи:**
```php
#[ORM\OneToMany(mappedBy: 'transaction', targetEntity: TransactionItem::class,
    cascade: ['persist', 'remove'], orphanRemoval: true)]
private Collection $items;
```

**Логика `isManualAmount`:**
- `false` (default): для `expense` сумма = Σ `TransactionItem.sum`, пересчёт при изменении позиций.
- `true`: сумма задаётся вручную, позиции не влияют на amount.

---

## 7. TransactionItem (`inccom_transaction_item`) ➕

Новая таблица (позиции расходной транзакции).

| Поле | Тип |
|------|-----|
| id | INT PK |
| transaction_id | FK inccom_transaction ON DELETE CASCADE |
| item_id | FK inccom_product (Item) |
| quantity | NUMERIC(12,3) |
| price | NUMERIC(16,2) |
| sum | NUMERIC(16,2) — computed: quantity × price |
| created_at | DATETIME |
| updated_at | DATETIME |

```php
#[ORM\ManyToOne(targetEntity: Transaction::class, inversedBy: 'items')]
private Transaction $transaction;

#[ORM\ManyToOne(targetEntity: Item::class)]
private Item $item;

// PrePersist/PreUpdate: $this->sum = bcmul($quantity, $price, 2);
```

---

## 8. Transfer (`inccom_transfer`) ➕

| Поле | Тип |
|------|-----|
| id | INT PK |
| amount | NUMERIC(16,2) |
| date | DATETIME |
| comment | TEXT nullable |
| from_account_id | FK inccom_account |
| to_account_id | FK inccom_account |
| author_id | FK main_user |
| outgoing_transaction_id | FK inccom_transaction UNIQUE |
| incoming_transaction_id | FK inccom_transaction UNIQUE |
| created_at | DATETIME |
| updated_at | DATETIME |

```php
#[ORM\OneToOne(targetEntity: Transaction::class, cascade: ['persist'])]
private Transaction $outgoingTransaction; // type=expense

#[ORM\OneToOne(targetEntity: Transaction::class, cascade: ['persist'])]
private Transaction $incomingTransaction; // type=income
```

**Каскад:** создание/обновление/удаление Transfer — атомарно в DB-транзакции, обновление балансов обоих счетов.

---

## ER-диаграмма (целевая)

```mermaid
erDiagram
    User ||--o{ Account : "master"
    User }o--o{ Account : "participants"
    Account ||--o{ TransactionCategory : has
    Account ||--o{ Transaction : has
    User ||--o{ TransactionCategory : created
    User ||--o{ ItemCategory : owns
    User ||--o{ Item : owns
    Item }o--o{ ItemCategory : categorized
    Transaction ||--o{ TransactionItem : contains
    Item ||--o{ TransactionItem : referenced
    Transaction }o--o| Transfer : linked
    Transfer }o--|| Account : from
    Transfer }o--|| Account : to
    User ||--o{ Transaction : authored
    User ||--o{ Transfer : authored
```

---

## Маппинг «текущее → целевое»

| Текущая сущность/таблица | Целевая сущность | Действие |
|--------------------------|------------------|----------|
| `Account` / `inccom_account` | Account | Добавить поля, M2M users |
| `Category` / `inccom_category` | TransactionCategory | Переименовать owner→createdBy, убрать mcc |
| `Tag` / `inccom_tag` | ItemCategory | Добавить keywords |
| `Product` / `inccom_product` | Item | Рефакторинг: user вместо transaction |
| `ProductTag` / `inccom_product_tag` | item_item_category | Новая join table |
| `Transaction` / `inccom_transaction` | Transaction | Добавить поля, убрать link_id |
| — | TransactionItem | Новая таблица |
| — | Transfer | Новая таблица (замена link_id) |

---

## Индексы (рекомендуемые)

```sql
-- Транзакции: фильтрация по счёту и дате
CREATE INDEX idx_transaction_account_date ON inccom_transaction(account_id, date DESC);

-- Товары: уникальность и поиск
CREATE UNIQUE INDEX uniq_item_user_name ON inccom_product(user_id, label);
CREATE INDEX idx_item_category_keywords ON inccom_tag(keywords(100));

-- Категории транзакций
CREATE INDEX idx_tx_category_account_type ON inccom_category(account_id, type);
```

---

## Версионирование и блокировки

- Все основные сущности используют `x_timestamp` с `#[ORM\Version]` — **optimistic locking**.
- `BalanceService` дополнительно применяет **pessimistic write lock** на `Account` при изменении баланса:

```php
$em->lock($account, LockMode::PESSIMISTIC_WRITE);
$account->setBalance(bcadd($account->getBalance(), $delta, 2));
```
