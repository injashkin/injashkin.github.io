---
title: Сброс пароля в WordPress через командную строку MySQL
description: Показан пример, как сбросить пароль администратора WordPress на локальном хосте через командную строку с помощью запросов к серверу базы данных MySQL.
create: 25-10-2022
update: 26-10-2022
---

Рассмотрим как сбросить пароль администратора WordPress-сайта на локальном хосте. Войдем в консоль MySQL как root-пользователь. Для этого откроем терминал и введем следующую команду:

```Bash
sudo mysql -u root -p
```

Потребуется ввести два пароля: пароль администратора ОС и пароль root-пользователя MySQL. Если пароль root-пользователя MySQL вы не меняли, то в вышеприведенной команде можно не указывать `-p` и не нужно будет вводить второй пароль. После выполнения команды появится строка с приглашением `mysql>`. В эту строку будем вводить запросы.

Найдем базу данных нашего WordPress-сайта, для этого в строку с приглашением `mysql>` введем следующий запрос:

```SQL
SHOW DATABASES;
```

Будут показаны имена всех баз данных на сервере MySQL. На моем сервере были следующие БД:

```SQL
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| phpmyadmin         |
| sys                |
| wp2                |
+--------------------+
6 rows in set (0,00 sec)
```

После того, как мы нашли нужную базу данных, у меня этой базой является `wp2`, можно просмотреть, какие таблицы имеются в этой базе:

```SQL
SHOW TABLES FROM wp2;
```

Запрос покажет имена таблиц в базе данных wp2.

```SQL
mysql> SHOW TABLES FROM wp2;
+-----------------------+
| Tables_in_wp2         |
+-----------------------+
| wp_commentmeta        |
| wp_comments           |
| wp_links              |
| wp_options            |
| wp_postmeta           |
| wp_posts              |
| wp_term_relationships |
| wp_term_taxonomy      |
| wp_termmeta           |
| wp_terms              |
| wp_usermeta           |
| wp_users              |
+-----------------------+
12 rows in set (0,00 sec)
```

В таблице с именем wp_users содержатся все учетные записи пользователей WordPress. Для упрощения работы с базой данных можно выбрать базу данных wp2 и сделать её текущей с помощью запроса USE и в последующих запросах указывать только названия таблиц, но мы будем работать извне и будем указывать в запросах базу данных и, через точку, имя таблицы. Выведем данные из таблицы wp_users:

```SQL
SELECT * FROM wp2.wp_users \G;
```

Будут выведены все `*` данные из таблицы wp_users базы данных wp2. Данные будут выведены в виде списка, на что указывает флаг `\G`.

```SQL
mysql> SELECT * FROM wp2.wp_users \G;
*************************** 1. row ***************************
                 ID: 1
         user_login: admin
          user_pass: $P$Bz6yNcBDlCjl171RqABZQJmL5QJyN.1
      user_nicename: admin
         user_email: admin@example.com
           user_url: http://localhost:8080
    user_registered: 2022-10-25 09:38:26
user_activation_key:
        user_status: 0
       display_name: admin
1 row in set (0,00 sec)
```

Здесь показаны данные для администратора сайта, где в поле user_pass указан пароль в зашифрованном виде. Его мы изменим:

```SQL
UPDATE wp2.wp_users SET user_pass = MD5('admin') WHERE user_login = 'admin';
```

Чтобы зашифровать пароль, используем функцию MD5 при вводе нового пароля. Здесь для пользователя с логином `admin` мы установили пароль `admin`.

**Рекомендую по теме:**

- [Краткий справочник по командам и запросам к MySQL](https://jinv.ru/Bazy-dannyh/Kratkij-spravochnik-po-komandam-MySQL/).
