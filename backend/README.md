# Решение заданий для backend-разработчика
Файл tz_backend_tables.sql - содержит dump таблиц на которых проводились решения<br>
Папка screens содержит снимки экрана<br>
Краткое описание задания:<br>
Необходимо по каждому врачу вывести следующую информацию:<br>
-ФИО<br>
-Специальность<br>
-Общая заработная плата за 2019 год<br>

Выводить информацию только по тем врачам, у которых сумма заработной платы превышает 2500 руб. за 2019 год.<br>
Решение:<br>
SELECT `doctors`.`FULL_NAME`, `doctors`.`SPEC`, SUM(`transactions`.`SUMM`) as SUMMA  FROM `transactions`, `doctors` WHERE `transactions`.DOC_ID = `doctors`.ID and YEAR(`transactions`.`DATE`) = 2019 GROUp BY `transactions`.DOC_ID HAVING SUM(`transactions`.`SUMM`) > 2500<br>
--------------------------------------
Второе тестовое задание для бэкенд-разработчика<br>
Необходимо найти длину пути автомобиля, за все дни.<br>
Решение:<br>
SELECT SUM( SQRT( POW(a.x - b.x2, 2) + POW(a.y - b.y2, 2) ) ) as Distance FROM `roads` as a LEFT JOIN (SELECT id as id2, x as x2, y as y2 FROM `roads`) AS b ON a.id - b.id2  = 1 where b.id2 IS NOT NULL


