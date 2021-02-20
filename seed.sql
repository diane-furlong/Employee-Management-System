INSERT INTO department (name)
VALUES ("construction"),("marketing");

INSERT INTO role (title, department_id)
VALUES ("builder",1), ("foreman",1),("marketing specialist",2),("marketing manager",2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Hope",2, null);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Karl","Jones",2, null);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Stan","Connely",1,1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Pete","Budger",3,2);