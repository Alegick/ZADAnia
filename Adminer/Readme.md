## Adminer для управления PostgreSQL в Docker (Git Bash, Windows)

## 2. Установка и базовая проверка Docker

Предполагается установленный Docker Desktop с поддержкой WSL2.
В Git Bash:
```bash
docker --version
docker ps
```
Если команды выполняются без ошибок, можно продолжать. Если Docker не находится, нужно сначала установить/починить Docker Desktop. [stackoverflow](https://stackoverflow.com/questions/71089617/docker-not-starting-on-windows-11-with-wsl-2)

## 3. Первые попытки и выявленные проблемы

При первом запуске Adminer такой командой:
```bash
docker run -d \
  --name adminer \
  -p 8084:8081 \
  adminer:latest
```
контейнер успешно стартовал (в `docker ps` был статус `Up`, порт `0.0.0.0:8084->8081/tcp`), однако страница `http://localhost:8084` в браузере не открывалась (connection refused). При этом в логах контейнера Adminer PHP‑сервер нормально запускался, значит проблема была не в самом приложении, а в сетевом доступе и публикации порта на Windows. [adminer](https://www.adminer.org/en/)

Также при повторных запусках возникали конфликты:

- несколько контейнеров с Adminer на разных портах,
- конфликт имён контейнеров (`adminer` уже существует),
- порой порт на хосте был недоступен, хотя внутри Docker он считался проброшенным. [fastfox](https://fastfox.pro/blog/tutorials/docker-publish-port-firewall-troubleshooting/)

Эти проблемы были связаны и с особенностями Docker Desktop + WSL2 + Git Bash: снаружи `curl`/браузер выдавали `connection refused`, хотя внутри контейнера сервис был жив. [reddit](https://www.reddit.com/r/docker/comments/1hvfwqp/cant_access_localhost_while_the_docker_container/)
### 4. Правильный запуск Adminer из официального образа
В итоге был выбран самый простой и «каноничный» вариант из официальной документации Docker Hub для Adminer:
```bash
docker pull adminer:latest

MSYS_NO_PATHCONV=1 docker run -d \
  --name adminer \
  -p 8080:8080 \
  adminer:latest
```
Пояснения:
- используется **официальный образ** `adminer:latest`, как рекомендует Docker Hub; [hub.docker](https://hub.docker.com/_/adminer/)
- порт опубликован как `8080:8080`, то есть Adminer доступен по `http://localhost:8080`;
- `MSYS_NO_PATHCONV=1` нужен, чтобы Git Bash не портил слэши и аргументы Docker.

Проверка:

```bash
docker ps            # adminer в статусе Up, порт 0.0.0.0:8080->8080
curl http://localhost:8080
```

`curl` возвращает HTML‑страницу Adminer, а в браузере по `http://localhost:8080` открывается форма авторизации Adminer. [stackoverflow](https://stackoverflow.com/questions/65657128/how-to-get-adminer-to-run-locally-using-docker)

## 5. Ошибка подключения к PostgreSQL

После того как Adminer заработал, следующая проблема появилась на шаге подключения к базе:

- В Adminer были введены настройки:
  - System: PostgreSQL  
  - Server: `host.docker.internal`  
  - Username: `postgres`  
  - Password: `mysecretpassword`  

В ответ Adminer выдавал ошибку:

> SQLSTATE  Подключение к серверу по адресу "host.docker.internal" (192.168.65.254), порт 5432 не удалось: Соединение отклонено. Работает ли сервер на этом хосте и принимает ли TCP/IP-соединения? [pvsm](https://www.pvsm.ru/postgresql/415226)

Это означало, что по адресу `host.docker.internal:5432` **вообще нет доступного PostgreSQL‑сервера**: либо PostgreSQL не был запущен, либо слушал только локальные подключения, либо порт не был открыт. [stackoverflow](https://stackoverflow.com/questions/31249112/allow-docker-container-to-connect-to-a-local-host-postgres-database)

***

### 6. Итоговое рабочее решение: PostgreSQL + Adminer через docker-compose

Чтобы не зависеть от настроек PostgreSQL в Windows и не бороться с firewall/pg_hba.conf, было принято решение поднять **PostgreSQL и Adminer вместе в Docker**, в одной сети, через `docker-compose.yml`. [codepruner](https://codepruner.com/how-to-run-postgresql-and-adminer-or-pgadmin-with-docker-compose/)

#### 6.1. Файл `docker-compose.yml`

В каталоге проекта (например, `ZADAnia/Adminer`) создан файл `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16
    container_name: pg-local
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  adminer:
    image: adminer:latest
    container_name: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  pgdata:
```

Ключевые моменты:

- сервис `db` поднимает PostgreSQL 16 с пользователем `postgres`, паролем `mysecretpassword` и базой `mydb`; [codepruner](https://codepruner.com/how-to-run-postgresql-and-adminer-or-pgadmin-with-docker-compose/)
- сервис `adminer` использует тот же образ `adminer:latest` и доступен по `http://localhost:8080`;
- оба сервиса находятся в одной docker‑сети, поэтому Adminer может подключаться к PostgreSQL по имени сервиса `db`, а не через `host.docker.internal`. [stackoverflow](https://stackoverflow.com/questions/75828751/cant-connect-adminer-to-postgres-server-in-docker)

#### 6.2. Запуск и устранение конфликтов

Перед запуском через compose пришлось удалить старый одиночный контейнер `adminer`, чтобы не было конфликта по имени:

```bash
docker stop adminer 2>/dev/null || true
docker rm adminer 2>/dev/null || true
```

Далее запуск:

```bash
docker compose down
docker compose up -d
docker ps
```

После этого в списке контейнеров видно:

- контейнер PostgreSQL (`pg-local` или аналогичное имя сервиса `db`),
- контейнер Adminer (`adminer`), оба в статусе `Up`, с нужными портами. [codepruner](https://codepruner.com/how-to-run-postgresql-and-adminer-or-pgadmin-with-docker-compose/)

***

### 7. Подключение к PostgreSQL из Adminer

Финальная рабочая схема подключения в Adminer (по адресу `http://localhost:8080`):

- **System**: PostgreSQL  
- **Server**: `db`  
- **Username**: `postgres`  
- **Password**: `mysecretpassword`  
- **Database**: `mydb` (можно оставить пустым, чтобы выбрать из списка). [stackoverflow](https://stackoverflow.com/questions/68436340/docker-postgres-and-adminer-accept-connection-but-doesnt-work)

Так как Adminer и PostgreSQL работают в одном docker‑compose‑стеке и одной виртуальной сети, соединение по имени `db` стабильно работает, без ошибок SQLSTATE и проблем с firewall или конфигурацией PostgreSQL на хост‑машине. [dev](https://dev.to/deni_sugiarto_1a01ad7c3fb/fixing-connection-refused-error-between-pgadmin-and-postgres-in-docker-14ge)

***

### 8. Что было сделано и какие проблемы решены

В процессе настройки были последовательно решены:

- проблемы с недоступностью порта `localhost:8084` при корректно работающем контейнере Adminer (сетевой стек Docker Desktop под Windows); [ru.stackoverflow](https://ru.stackoverflow.com/questions/1484509/docker-adminer-%D0%BD%D0%B5-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%D0%B5%D1%82)
- конфликты портов и имён контейнеров (`adminer` уже запущен отдельно при старте через compose); [oneuptime](https://oneuptime.com/blog/post/2026-01-25-fix-container-exits-immediately-docker/view)
- отсутствие доступного PostgreSQL на `host.docker.internal:5432`, приводившее к ошибке SQLSTATE; [stackoverflow](https://stackoverflow.com/questions/31249112/allow-docker-container-to-connect-to-a-local-host-postgres-database)
- отсутствие общего окружения: вместо разрозненных сервисов сделан единый docker-compose стек, где PostgreSQL и Adminer работают в одной сети и корректно взаимодействуют по имени сервиса `db`. [stackoverflow](https://stackoverflow.com/questions/75828751/cant-connect-adminer-to-postgres-server-in-docker)

В итоге получено полностью рабочее и воспроизводимое решение для локальной разработки и демонстрации: команда `docker compose up -d` поднимает и БД, и Adminer, а управление базой доступно через браузер по адресу `http://localhost:8080`.