
```markdown
# 🐳 ZADAnia — Практические задания по Docker

Репозиторий с выполненными практическими заданиями по работе с Docker.

---

## 📋 Содержание

### 🔹 Основные задания

1. [**Welcome to Docker**](./WelcomeToDocker) — первое знакомство с Docker
2. [**Nginx в Docker**](./Nginx%20в%20Docker) — веб-сервер Nginx в контейнере
3. [**Adminer**](./Adminer) — веб-интерфейс для управления базами данных
4. [**cAdvisor**](./cAdvisor) — мониторинг контейнеров
5. [**MY SCRIPT**](./MYYY%20SCRIPT) — пользовательские скрипты

### 📦 Расширенный список заданий

- [**Список заданий V1.0**](./Список%20заданий) — первая версия практических работ
- [**Список заданий V2.0**](./spisok%20zadania%202.0) — расширенный список с 9+ образами:
  - Apache HTTP Server
  - Jira
  - Статический сайт на Apache
  - Metasploitable2
  - Python
  - Node.js
  - Redis
  - HTTP-сервер для раздачи файлов
  - Файловый обменник

---

## 🚀 Быстрый старт

### Проверить Docker
```bash
docker version
```

### Подготовка (чистый лист)
```bash
# Посмотреть все контейнеры
docker ps -a

# Остановить все
docker stop $(docker ps -q)

# Удалить остановленные
docker container prune

# Удалить неиспользуемые образы
docker image prune -a
```

---

## 📚 Структура репозитория

```
ZADAnia/
├── WelcomeToDocker/          # Первое задание
├── Nginx в Docker/           # Nginx-сервер
├── Adminer/                  # Adminer для БД
├── cAdvisor/                 # Мониторинг
├── MYYY SCRIPT/              # Скрипты
├── Список заданий/           # Версия 1.0
├── spisok zadania 2.0/       # Версия 2.0 (расширенная)
└── README.md                 # Этот файл
```

---

## 💡 Полезные команды Docker

```bash
# Список запущенных контейнеров
docker ps

# Список всех контейнеров
docker ps -a

# Просмотр логов
docker logs <container_name>

# Остановка контейнера
docker stop <container_name>

# Удаление контейнера
docker rm <container_name>

# Список образов
docker images

# Удаление образа
docker rmi <image_name>
```

---

## ⚠️ Примечание для Windows (Git Bash)

При запуске команд с `-v` (volume) в **Git Bash** используй:

```bash
MSYS_NO_PATHCONV=1 docker run -d -v "$(pwd)":/app ...
```

Это отключает автоматическую конвертацию путей, которая может ломать команды.

В **PowerShell** или **CMD** эта приставка не нужна.

---

## 📖 Дополнительные материалы

- [Официальная документация Docker](https://docs.docker.com/)
- [Docker Hub — каталог образов](https://hub.docker.com/)
- [Docker Compose документация](https://docs.docker.com/compose/)

---

## 👤 Авторы

- [@Alegick](https://github.com/Alegick)

---

## 📜 Лицензия

Учебный проект. Свободное использование в образовательных целях.
```
