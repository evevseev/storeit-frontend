# store-it WMS — frontend

## Запуск проекта

```bash
pnpm dev
```

Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

## Сборка проекта

```bash
docker build -t store-it-wms-frontend .
```

## Переменные окружения

```env
NEXT_PUBLIC_APP_URL — URL приложения
NEXT_PUBLIC_API_URL — URL API
NEXT_PUBLIC_YANDEX_CLIENT_ID — ID приложения Яндекса OAuth
```
