INSERT INTO department (name)
VALUES ("Scientific"),("Engineering"),("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Scientist", 50000.00 ,1), ("Scientific Manager", 100000.00,1), ("Engineer",60000.00,2),("Engineering Manager", 120000.00,2),("Marketing Specialist", 55000.00,3),("Marketing Manager", 110000.00,3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Hope",2, null);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Rosemary","Jones",4, null);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Stan","Connely",1,1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Desiree","Budger",3,2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Karl","Biswah",5,null);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Pete","Budger",4,5);