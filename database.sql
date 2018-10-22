CREATE TABLE to_do_list (
	id serial primary key,
	task_desc varchar(240) not null,
	completed bit
	);
	
	INSERT INTO to_do_list (task_desc, completed) VALUES ('Finish Weekend Assignment #3 Base Mode', '0');
	INSERT INTO to_do_list (task_desc, completed) VALUES ('Create File Structure for WA#3', '0');
	INSERT INTO to_do_list (task_desc, completed) VALUES ('WA#3 Create Database', '0');
	INSERT INTO to_do_list (task_desc, completed) VALUES ('WA#3 Create Front End Interface', '0');

SELECT * FROM to_do_list ORDER BY completed, id DESC;
