## cAdvisor в Git Bash
## Инструкция по запуску
Перед тем как начинать работать с Docker стоит проверить обновления и версию Docker.

```bash
docker --version
docker ps
```
После того как мы убедились что у нас стоит последняя версия и Docker работает, нужно проверить находится ли ктото в порту 8083.
```bash
netstat -ano | grep 8083
```
Если команда выдала чтото подобное:
![контейнер запустился](/cAdvisor/img/2.png)
Значит на этом порту уже что‑то открыто (в том числе это может быть уже запущенный контейнер cAdvisor).

Если порт занят и это старый контейнер cAdvisor, его можно остановить и удалить:
```bash
docker ps -a | grep cadvisor
docker stop cadvisor
docker rm cadvisor
```
После этого порт освободится, и можно запускать новый контейнер.

## Запуск cAdvisor из Git Bash
Команда, которая корректно работает в Git Bash на Windows/WSL:
```bash
MSYS_NO_PATHCONV=1 docker run -d \
  --name=cadvisor \
  -p 8083:8080 \
  --privileged \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  -v /dev/disk/:/dev/disk:ro \
  gcr.io/cadvisor/cadvisor:latest
```
Пояснения:
```text
MSYS_NO_PATHCONV=1 — нужен именно в Git Bash, чтобы он не ломал пути вида /c/....

-p 8083:8080 — пробрасываем порт 8080 внутри контейнера на 8083 хоста.

--privileged и набор -v ... — дают cAdvisor доступ к файловой системе, cgroups и данным Docker, чтобы он мог собирать метрики.
```
Проверяем, что контейнер запустился:
```bash
docker ps
```
Ожидаемый результат — строка вида:

![контейнер запустился](/cAdvisor/img/1.png)

## Открытие интерфейса cAdvisor
После успешного запуска контейнера открываем веб‑интерфейс:

- из Git Bash:
```bash
start http://localhost:8083
```
или вручную в браузере (Chrome / Firefox / Edge):
http://localhost:8083

Должен открыться дашборд cAdvisor с графиками CPU, памяти, сети и списком контейнеров:
![контейнер запустился](/cAdvisor/img/5.png)


## ПРИМЕР
Я для примера решил создать дополнительно 10 контейнеров: 
![контейнер запустился](/cAdvisor/img/3.png)

 И вот для наглядности как это выглядит через cAdvidor(общая информация всех контейнеров):

 ![контейнер запустился](/cAdvisor/img/6.png)
 ![контейнер запустился](/cAdvisor/img/7.png)
 ![контейнер запустился](/cAdvisor/img/8.png)
 ![контейнер запустился](/cAdvisor/img/9.png)


## Демонстрация cAdvisor (интерактивная)

<a href="/cAdvisor/cAdvisor-demo.mhtml">
  <img src="/cAdvisor/img/cadvisor_thumbnail.png" alt="Открыть cAdvisor" width="100%">
</a>

> Кликни на картинку — откроется **полная интерактивная страница** cAdvisor со всеми графиками и контейнерами.

