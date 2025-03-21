<div style="display: flex; align-items: center; gap: 15px;">
  <img src="https://github.com/user-attachments/assets/f495987e-3146-44de-98bd-1a471aaedf98" alt="Логотип приложения: изображение сиамского кота" width="100" height="100" style="margin: 0;">
  <h1 style="margin: 0; font-size: 24px; color: #0067a5;">#cat-clinic-front</h1>
</div>

Клиентская часть приложения cat-clinic-simulation.

Приложение имеет в своем составе Master-Detail таблицы.

Master - cписок счетов клиентов с полями: номер, дата, сумма и примечание.

Detail - детализация счета с полями: наименование и сумма.

Реализованы CRUD-операции. При этом сумма документа не редактируется, а пересчитывается на основе спецификаций.

Дополнительно реализована проверка уникальности значения номера документа и наименования позиции на уровне транзакции, с выдачей сообщения пользователю и с логированием ошибки в отдельную таблицу БД (в отдельной транзакции).

--------
### Стек технологий:
Java, Spring Boot, Hibernate, REST API, PostgreSQL, Angular, Apache Maven, Docker
--------

#### Стартовая страница приложения:
![2025-03-21_22-23-18](https://github.com/user-attachments/assets/87e14db1-741b-462e-8ead-917d06073902)

#### Страница спецификаций к конкретному документу:
![2025-03-21_21-40-03](https://github.com/user-attachments/assets/37f0cf28-d656-4d48-861f-20762af57a4f)

При попытке создать новый cчет с уже существующим номером или добавить к счету позицию с уже существующим наименованием пользователь получает сообщение об ошибке:
![2025-03-21_22-24-53](https://github.com/user-attachments/assets/44f499f7-1ed3-41c4-80c7-b496d63a129a)

Ошибка, также, логируется в БД:
![2025-03-21_22-29-37](https://github.com/user-attachments/assets/3eabcb90-9b49-4b0a-88d6-feda89bef1da)

### Инструкция по сборке и запуску приложения:

[Серверная часть](https://github.com/KoshanSky1/cat-clinic-simulation) приложения реализована на Java 21 с использованием Spring Boot 3.

Клиентская часть реализована на базе Angular 17.

Запустить приложение можно двумя способами.

Первый способ:

1. Запуск backend`a:
   
   • Предварительно создать БД POSTGRES не ниже версии 15 с именем "cat-clinic-db".

   • Поменять в application.properties spring.datasource.username и spring.datasource.password на свои логин и пароль от Postgres.

   • Скомпилировать jar файл с помощью maven командой mvn clean install.

   • Запустить приложение командой java java -jar cat-clinic-simulation-1.0.0-SNAPSHOT.jar.

2. Запуск frontend`a:
   
   • Запустить клиентскую часть командой ng serve.

Приложение будет доступно по адресу: http://localhost:4200

Второй способ:

1. Запуск backend`a:
   
   • Установить и запустить Docker.

   • Поменять в docker-compose.yaml POSTGRES_USER и POSTGRES_PASSWORD на свои логин и пароль от Postgres.

   • Запустить контейнер командой docker-compose up.

2. Запуск frontend`a:
   
   • Запустить клиентскую часть командой ng serve.

Приложение будет доступно по адресу: http://localhost:4200
