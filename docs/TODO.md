# TODO — учёт финансов

> Сгенерировано оркестратором из `PLAN.md`. Статусы: `[ ]` не начата, `[~]` в работе, `[x]` выполнена, `[!]` заблокирована.

---

## Итерация 1: Backend — инфраструктура + схема Account/Category

### Фаза 0. Подготовка инфраструктуры

- [x] **0.1** Настроить алиасы путей API: `/api/accounts` параллельно `/api/inc-com/account`
- [x] **0.2** Создать `PaginationService` + DTO `PaginatedResponse` (page/size по ТЗ)
- [x] **0.3** Создать базовые Enum: `AccountType`, `TransactionType`
- [x] **0.4** Создать `AccountAccessService` (проверка master/participant)

### Фаза 1. Backend — схема БД и сущности (зависит от 0.3)

- [x] **1.1** Миграция Account: +description, +currency, +number, +createdAt; M2M `inccom_account_user`
- [x] **1.2** Миграция TransactionCategory (Category): убрать mcc, +createdAt; rename owner→createdBy в коде
- [x] **1.3** Миграция ItemCategory (Tag): +keywords, убрать sort/level
- [x] **1.4** Рефакторинг Item (Product): user вместо transaction, +description, +unit, unique(user, name)
- [x] **1.5** Миграция Transaction: +mcc, +fpd, +isManualAmount, +transfer_id; убрать link_id, loaded
- [x] **1.6** Создать TransactionItem entity + миграция
- [x] **1.7** Создать Transfer entity + миграция
- [x] **1.8** Миграция данных: link_id → Transfer (N/A — колонка удалена в 405, dev-only)

---

## Итерация 2: Backend — сервисы (зависит от 1.1–1.7)

- [x] **2.1** `BalanceService`: applyDelta, lock, optimistic version
- [x] **2.2** `TransactionService`: create/update/delete, пересчёт amount, isManualAmount
- [x] **2.3** `TransferService`: атомарное создание пары транзакций
- [x] **2.4** `CategoryCopyService`: копирование с проверкой дублей
- [x] **2.5** Расширить `IncComManager`: делегирование в новые сервисы
- [x] **2.6** Guards: запрет удаления Account/Category/Item при зависимостях

---

## Итерация 3: Backend — Security и API (зависит от 2.1–2.6)

- [x] **3.1** Voters: Account, Transaction, TransactionCategory, Item, Transfer
- [x] **3.2** `AccountsController` по ТЗ
- [x] **3.3** `TransactionCategoriesController` (вложенный роут + copy)
- [x] **3.4** `ItemCategoriesController`
- [x] **3.5** `ItemsController`
- [x] **3.6** `TransactionsController`
- [x] **3.7** `TransfersController`
- [x] **3.8** `ApiAuthController`: register, me
- [x] **3.9** Request/Response DTO + валидация
- [x] **3.10** Единая пагинация page/size во всех list-эндпоинтах

---

## Итерация 4: Frontend — FSD (зависит от 3.2)

- [x] **4.1** Переименовать `entites/` → `entities/`
- [x] **4.2** Перенести `shared/layout/` → `layouts/`
- [x] **4.3** Создать слой `widgets/`
- [x] **4.4** Настроить path aliases в tsconfig
- [x] **4.5** Создать `shared/types/pagination.ts`
- [x] **4.6** Обновить API-клиент: base paths `/api/accounts`

---

## Итерация 5: Frontend — entities и features

- [x] **5.1** `entities/account` — миграция из `entites/inc-com`
- [x] **5.2** `entities/transaction-category`
- [x] **5.3** `entities/user`
- [x] **5.4** `features/auth` — проверка/доработка
- [x] **5.5** `entities/transaction` + `features/transaction-form`
- [x] **5.6** `entities/item` + `entities/item-category`
- [x] **5.7** `entities/transfer` + `features/transfer-form`
- [x] **5.8** `features/category-copy`
- [x] **5.9** `features/qr-scanner` + `shared/lib/parse-fiscal-qr.ts`

---

## Итерация 6: Frontend — pages и widgets

- [x] **6.1** `pages/accounts/`
- [x] **6.2** `pages/transactions/`
- [x] **6.3** `pages/items/`
- [x] **6.4** `pages/item-categories/`
- [x] **6.5** widgets: account-list, transaction-table, balance-summary
- [x] **6.6** widget: category-tree
- [x] **6.7** Обновить роутинг
- [x] **6.8** UI управления участниками счёта

---

## Итерация 7: Интеграция

- [x] **7.1** Синхронизировать типы frontend ↔ API DTO
- [x] **7.2** React Query: invalidate balance при мутациях
- [x] **7.3** Адаптивная вёрстка
- [x] **7.4** Удалить deprecated `/api/inc-com/*`
- [x] **7.5** Удалить старые `entites/`, `shared/layout/`

---

## Итерация 8: Тестирование (опционально)

- [x] **8.1** Backend: unit-тесты BalanceService, TransferService — 7 тестов, все пройдены
- [x] **8.2** Backend: functional-тесты API — файл создан, 2 теста skipped (kernel: нет symfony/serializer)
- [x] **8.3** Frontend: vitest для parse-fiscal-qr — 5 тестов, все пройдены
- [x] **8.4** E2E: расход с QR → баланс — `docs/TEST_PLAN.md`
