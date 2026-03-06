# Оставшиеся задания Docker
##  Проверить Docker
Получить версию установленного у вас Docker
```bash
docker version
```

![alt text](/img/16.png)

## Подготовка Docker (чтобы начать работать с “чистого листа”)
Остановить все запущенные контейнеры
Удалить все остановленные контейнеры
Удалить все неиспользуемые образы

- Следует убедиться, нет ли у вас уже установленных и запущенных контейнеров:
```bash
docker ps -a
```
- Если есть, то лучше их остановить:
```bash
docker stop $(docker ps -q)
```
- Если остановленные контейнеры не нужно, то удалить их:
```bash
docker container prune
```
или
```bash
docker container prune $(docker ps -q)
```
- Ещё раз убедиться, что нет лишних контейнеров:
```bash
docker ps -a
```
![alt text](/img/17.png)

- Опционально можно удалить ненужные образы. Показать текущие образы:
```bash
docker images
```
- Удалить все ненужные образы
```bash
docker image prune -a
```
или
```bash
docker rmi $(docker images -q)
```


## 1. Apache HTTP Server

Один из самых популярных веб-серверов в мире.

### Установка образа
```bash
docker pull httpd:latest
```

### Запуск контейнера
```bash
docker run -d --name my-apache -p 8090:80 httpd:latest
```

### Проверка работы

Открыть в браузере: http://localhost:8090

Должна отобразиться страница "It works!"

![фе](/img/1.png)

### Своя страница
```bash
docker exec my-apache sh -c 'echo "<h1>My Apache Server</h1>" > /usr/local/apache2/htdocs/index.html'
```
![фе](/img/2.png)

### Остановка
```bash
docker stop my-apache
docker rm my-apache
```

---

## 2. Jira

Система управления проектами и задачами от Atlassian.

### Установка образа
```bash
docker pull atlassian/jira-software:latest
```

### Запуск контейнера
```bash
docker run -d \
  --name my-jira \
  -p 8091:8080 \
  atlassian/jira-software:latest
```

### Проверка работы

Открыть в браузере: http://localhost:8091

Дождаться загрузки (~2-3 минуты), затем пройти начальную настройку.

![фе](/img/3.png)

### Логи запуска
```bash
docker logs -f my-jira
```
![фе](/img/4.png)

### Остановка
```bash
docker stop my-jira
docker rm my-jira
```

---

## 3. Статический сайт на Apache

Хостинг собственного HTML/CSS/JS сайта через Apache в Docker.

### Создание файла сайта

Создать папку:
```bash
mkdir my-site
```

Содержимое `my-site/index.html`:
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Мой Docker-сайт</title>
</head>
<body>
  <h1>Привет из Docker + Apache!</h1>
  <p>Статический сайт, запущенный в контейнере.</p>
</body>
</html>
```


### Установка образа
```bash
docker pull httpd:latest
```

### Запуск контейнера с монтированием папки
```bash
MSYS_NO_PATHCONV=1 docker run -d --name my-static-site -p 8092:80 -v "$(pwd)/my-site":/usr/local/apache2/htdocs/ httpd:latest
```

### Проверка работы

Открыть в браузере: http://localhost:8092

![фе](/img/5.png)

### Остановка
```bash
docker stop my-static-site
docker rm my-static-site
```

---

## 4. Metasploitable2

Намеренно уязвимая виртуальная машина для практики пентестинга.

### Установка образа
```bash
docker pull tleemcjr/metasploitable2:latest
```

### Запуск контейнера
```bash
MSYS_NO_PATHCONV=1 docker run -d --name metasploitable2 -p 8093:80 tleemcjr/metasploitable2:latest sh -c "/bin/services.sh && bash"
```

### Проверка работы

Открыть в браузере: http://localhost:8093

![фе](/img/6.png)

### Логи
```bash
docker logs metasploitable2
```
![фе](/img/7.png)

### Остановка
```bash
docker stop metasploitable2
docker rm metasploitable2
```

> ⚠️ Запускать только в изолированной среде, не открывать наружу!

---

## 5. Python

Официальный образ интерпретатора Python.

### Установка образа
```bash
docker pull python:latest
```

### Запуск интерактивного режима
```bash
docker run -it --name my-python python:latest
```

### Внутри контейнера
```python
print("Hello from Docker!")
x = [i**2 for i in range(10)]
print(x)
exit()
```
![фе](/img/8.png)

### Создать файл `app.py`
```python
print("Python работает в Docker!")
for i in range(5):
    print(f"Итерация: {i}")
```

### Запустить скрипт из файла
```bash
MSYS_NO_PATHCONV=1 docker run --rm -v "$(pwd)":/app python:latest python /app/app.py
```
![фе](/img/9.png)
### Остановка
```bash
docker stop my-python
docker rm my-python
```

---

## 6. Node.js

JavaScript runtime для выполнения серверных приложений.

### Установка образа
```bash
docker pull node:latest
```

### Запуск интерактивного режима
```bash
docker run -it --name my-node node:latest node
```

### Внутри Node.js REPL
```javascript
console.log("Hello from Docker!")
const arr = .map(x => x * 2)
console.log(arr)
.exit
```
![фе](/img/10.png)
### Создать файл `app.js`
```javascript
console.log("Node.js работает в Docker!");
const http = require("http");
const server = http.createServer((req, res) => {
  res.end("<h1>Hello from Node.js in Docker!</h1>");
});
server.listen(3000, () => console.log("Сервер запущен: http://localhost:3000"));
```

### Запустить скрипт
```bash
docker run -d --name my-node-app -p 3000:3000 \
  -v $(pwd):/app -w /app \
  node:latest node app.js
```

Открыть в браузере: http://localhost:3000

![фе](/img/11.png)

### Остановка
```bash
docker stop my-node-app
docker rm my-node-app
```

---

## 7. Redis

In-memory база данных для кеширования и хранения данных в формате ключ-значение.

### Установка образа
```bash
docker pull redis:latest
```

### Запуск контейнера
```bash
docker run -d --name my-redis -p 6379:6379 redis:latest
```

### Подключиться через redis-cli
```bash
docker exec -it my-redis redis-cli
```

### Команды внутри redis-cli
```
PING
SET name "Docker"
GET name
SET counter 0
INCR counter
INCR counter
GET counter
KEYS *
EXIT
```

> Ожидаемый ответ на `PING` — `PONG`.
![фе](/img/12.png)
### Остановка
```bash
docker stop my-redis
docker rm my-redis
```

---

## 8. HTTP-сервер для раздачи файлов

Простой HTTP-сервер для раздачи статических файлов по сети.

### Создать папку с файлами
```bash
mkdir my-files
echo "Привет! Это файл из Docker." > my-files/hello.txt
echo "<h1>Файловый сервер работает!</h1>" > my-files/index.html
```

### Установка образа
```bash
docker pull halverneus/static-file-server:latest
```

### Запуск контейнера
```bash
docker run -d \
  --name file-server \
  -p 8094:8080 \
  -v $(pwd)/my-files:/web \
  halverneus/static-file-server:latest
```

### Проверка работы

Открыть в браузере:
- http://localhost:8094
- http://localhost:8094/hello.txt

![фе](/img/13.png)

![фе](/img/14.png)


### Остановка
```bash
docker stop file-server
docker rm file-server
```

---

## 9. Файловый обменник

Сервис для загрузки и скачивания файлов через веб-интерфейс (аналог WeTransfer).

### Установка образа
```bash
docker pull degobbis/filebrowser:latest
```

### Создание volume для хранения данных
```bash
docker volume create filebrowser_data
```

### Запуск контейнера
```bash
docker run -d \
  --name filebrowser \
  -p 8095:80 \
  -v filebrowser_data:/srv \
  degobbis/filebrowser:latest
```

### Проверка работы

Открыть в браузере: http://localhost:8095

> Логин по умолчанию — пользователь: `admin`, пароль: `admin`

![фе](/img/15.png)

### Загрузить файл
1. Войти в интерфейс
2. Нажать кнопку **Upload**
3. Выбрать файл
4. Скопировать ссылку для скачивания

### Остановка
```bash
docker stop filebrowser
docker rm filebrowser
```
