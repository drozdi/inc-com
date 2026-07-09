# TEST_REPORT — Итерация 8

**Дата:** 2026-07-09  
**Задачи:** 8.1–8.4

## Создано

### 8.1 Backend unit-тесты
- `server/tests/IncCom/Service/BalanceServiceTest.php` — applyDelta (+/−), recalculate, optimistic lock retry
- `server/tests/IncCom/Service/TransferServiceTest.php` — create с парой транзакций, валидация amount
- `server/tests/bootstrap.php`
- `server/phpunit.xml.dist`
- `server/.env.test` — окружение для functional-тестов
- `server/tests/fixtures/jwt/` — тестовые JWT-ключи
- `server/composer.json` — добавлены `symfony/phpunit-bridge`, `symfony/browser-kit`, `phpunit/phpunit`

### 8.2 Backend functional API
- `server/tests/IncCom/Controller/AccountsControllerTest.php` — 401 без токена, smoke (skipped)

### 8.3 Frontend vitest
- `client/src/shared/lib/parse-fiscal-qr.test.ts` — 5 кейсов

### 8.4 E2E план
- `docs/TEST_PLAN.md` — чеклист ручного E2E

## Результаты запуска

| Набор | Команда | Всего | Пройдено | Упало | Skipped |
|-------|---------|-------|----------|-------|---------|
| Backend | `php vendor/bin/phpunit` (PHP 8.3 OSPanel) | 9 | 7 | 0 | 2 |
| Frontend | `npm run test:vite -- parse-fiscal-qr --run` | 5 | 5 | 0 | 0 |

## Заблокировано

1. **Functional API (8.2):** Symfony Kernel не поднимается в test-окружении — `DtoValidator` требует `symfony/serializer` (`DenormalizerInterface`), пакет не установлен. Тесты помечены `markTestSkipped`.
2. **Отсутствует `server/.env`:** `composer install/update` падает на `cache:clear` (post-script). Для dev нужен `.env` или копия `.env.dev`.
3. **`ext-sodium`:** отключён в CLI PHP OSPanel — composer требует `--ignore-platform-req=ext-sodium`.
4. **`bin/phpunit`:** не создан; запуск через `vendor/bin/phpunit`.

## Заключение

Unit-тесты сервисов и vitest parse-fiscal-qr **пройдены**. Functional API и E2E **заблокированы** инфраструктурой (serializer, .env). Ручной E2E-чеклист готов в `docs/TEST_PLAN.md`.

## Рекомендации разработчику

- `composer require symfony/serializer` — разблокирует WebTestCase
- Создать `server/.env` (или symlink на `.env.dev`)
- Включить `ext-sodium` в php.ini OSPanel
