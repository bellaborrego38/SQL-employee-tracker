use employee_db;


INSERT INTO department (name)

VALUES ("Sales"),
       ("Engineering"),
       ("IT"),
       ("Finance"),
       ("Legal");

INSERT INTO role (department_id, title, salary)

VALUES (1, "Lead Sales", 70000),
       (1, "Sales Person", 50000),
       (2, "Lead Engineer", 120000),
       (2, "Engineer", 100000),
       (3, "Lead Developer", 200000),
       (3, "Web Developer", 150000),
       (4, "Account Manager", 100000),
       (4, "Accountant", 80000);

       INSERT INTO employee
       (first_name, last_name, role_id, manager_id)
       VALUES 
    ('George', 'Goth', 1, NULL),
    ('James', 'Euton', 2, 1),
    ('Sierra', 'Guzman', 3, NULL),
    ('Rain', 'Smith', 4, 3),
    ('kennedy', 'Mcknight', 4, NULL),
    ('Maria', 'Boon', 3, 5),
    ('Sara', 'Plop', 2, NULL);
    


       
