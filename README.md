##  Проверить Docker
Получить версию установленного у вас Docker
```bash
docker version
```

![alt text](/img/1.png)

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
![alt text](/img/2.png)

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

## Поиск готового образа Welcome to Docker
```bash
docker run -d -p 8088:80 --name welcome-to-docker docker/welcome-to-docker
```
##  Получение готового образа Welcome to Docker

Получить информацию по загруженному образу:
```bash
docker inspect welcome-to-docker
```
При необходимости остановить контейнер с таким именем:
```bash
docker stop welcome-to-docker
```
Перезапустить контейнер по имени
```bash
docker restart welcome-to-docker
```
Перезапустить контейнер по его id
```bash
docker restart c4d56c24da4f
```
Удалить выбранный контейнер по его имени
```bash
docker rm welcome-to-docker
```
![alt text](/img/3.png)

И можно удалить ещё и образ загруженного ранее welcome-to-docker:

Получить id образа
```bash
docker images
```
Удалить по id нужный образ
```bash
docker rmi c4d56c24da4f
```
![alt text](/img/4.png)

## Проверить работу контейнера

Можно снова установить и запустить Welcome to Docker (если его удаляли ранее)
```bash
docker run -d -p 8088:80 --name welcome-to-docker docker/welcome-to-docker
```
Показать наличие загруженного файла образа
```bash
docker images
```
![alt text](/img/5.png)

Показать только запущенные контейнеры
```bash
docker ps
```
или показать все контейнеры (в т.ч. остановленные)
```bash
docker ps -a
```
![alt text](/img/6.png)

## Показать работающий Welcome to Docker

Проверить порт 8088 для Linux/Mac/WSL:
```bash
# Проверьте, занят ли порт
netstat -tuln | grep :8088
```
Проверить порт 8088 для Windows:
```bash
netstat -aon | findstr :8088
```
Открыть http://localhost:8088 в браузере

![alt text](/img/12.png)!!!!!!!!!!

## Управление контейнером
Мониторинг контейнеров
Показать состояние всех контейнеров
```bash
docker ps -a
```
Показать подробности о контейнере
```bash
docker inspect welcome-to-docker
```
Запустить мониторинг контейнеров
```bash
docker stats
```
![alt text](/img/7.png)

Получить лог контейнера
```bash
docker logs welcome-to-docker
```
Показать логи в режиме ожидания
```bash
docker logs -f welcome-to-docker
```
![alt text](/img/8.png)

Остановить контейнер
```bash
docker stop welcome-to-docker
```
Снова запустить контейнер
```bash
docker start welcome-to-docker
```
Перезапустить контейнер
```bash
docker restart welcome-to-docker
```
Зайти в контейнер
```bash
docker exec -it welcome-to-docker /bin/bash
```
или
```bash
docker exec -it welcome-to-docker bash
```
или
```bash
docker exec -it welcome-to-docker /bin/sh
```
или
```bash
docker exec -it welcome-to-docker sh
```
внутри контейнера можно повыполнять некоторые команды Linux Получить информацию об ОС контейнера
```bash
uname -a
```

![alt text](/img/9.png)

Получить больше информации об ОС контейнера
```bash
cat /etc/os-release
```

![alt text](/img/10.png)

Выйти из контейнера можно командой exit

Остановить все запущенные контейнеры
```bash
docker stop $(docker ps -q)
```
Удалить все остановленные контейнеры
```bash
docker container prune $(docker ps -q)
```
Удалить все образы
```bash
docker rmi $(docker images -q)
```