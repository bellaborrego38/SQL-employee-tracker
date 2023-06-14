const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");

async function init() {
  const logoText = logo({ name: "SQL EMPLOYEE-TRACKER" }).render();
  console.log(logoText);

  await loadMainPrompts();
}

async function loadMainPrompts() {
  const choices = [
    { name: "View All Employees", value: "VIEW_EMPLOYEES" },
    { name: "View All Employees By Department", value: "VIEW_EMPLOYEES_BY_DEPARTMENT" },
    { name: "View All Employees By Manager", value: "VIEW_EMPLOYEES_BY_MANAGER" },
    { name: "Add Employee", value: "ADD_EMPLOYEE" },
    { name: "Remove Employee", value: "REMOVE_EMPLOYEE" },
    { name: "Update Employee Role", value: "UPDATE_EMPLOYEE_ROLE" },
    { name: "Update Employee Manager", value: "UPDATE_EMPLOYEE_MANAGER" },
    { name: "View All Roles", value: "VIEW_ROLES" },
    { name: "Add Role", value: "ADD_ROLE" },
    { name: "Remove Role", value: "REMOVE_ROLE" },
    { name: "View All Departments", value: "VIEW_DEPARTMENTS" },
    { name: "Add Department", value: "ADD_DEPARTMENT" },
    { name: "Remove Department", value: "REMOVE_DEPARTMENT" },
    { name: "View Total Utilized Budget By Department", value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT" },
    { name: "Quit", value: "QUIT" }
  ];

  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices
    }
  ]);

  switch (choice) {
    case "VIEW_EMPLOYEES":
      await viewEmployees();
      break;
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      await viewEmployeesByDepartment();
      break;
    case "VIEW_EMPLOYEES_BY_MANAGER":
      await viewEmployeesByManager();
      break;
    case "ADD_EMPLOYEE":
      await addEmployee();
      break;
    case "REMOVE_EMPLOYEE":
      await removeEmployee();
      break;
    case "UPDATE_EMPLOYEE_ROLE":
      await updateEmployeeRole();
      break;
    case "UPDATE_EMPLOYEE_MANAGER":
      await updateEmployeeManager();
      break;
    case "VIEW_DEPARTMENTS":
      await viewDepartments();
      break;
    case "ADD_DEPARTMENT":
      await addDepartment();
      break;
    case "REMOVE_DEPARTMENT":
      await removeDepartment();
      break;
    case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
      await viewUtilizedBudgetByDepartment();
      break;
    case "VIEW_ROLES":
      await viewRoles();
      break;
    case "ADD_ROLE":
      await addRole();
      break;
    case "REMOVE_ROLE":
      await removeRole();
      break;
    default:
      quit();
  }
}

async function viewEmployees() {
  const [rows] = await db.findAllEmployees();
  const employees = rows;
  console.log("\n");
  console.table(employees);
  await loadMainPrompts();
}

async function viewEmployeesByDepartment() {
  const [departments] = await db.findAllDepartments();
  const departmentChoices = departments.map(({ id, name }) => ({ name, value: id }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Select department:",
      choices: departmentChoices
    }
  ]);

  const [employees] = await db.findEmployeesByDepartment(departmentId);
  console.log("\n");
  console.table(employees);
  await loadMainPrompts();
}

async function viewEmployeesByManager() {
  const [employeeRows] = await db.findAllEmployees();
  const managerChoices = employeeRows.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which employee?",
      choices: managerChoices
    }
  ]);

  const [rows] = await db.findAllEmployeesByManager(managerId);
  let employees = rows;
  console.log("\n");
  if (employees.length === 0) {
    console.log("No reports");
  } else {
    console.table(employees);
  }
  await loadMainPrompts();
}

async function removeEmployee() {
  const [rows] = await db.findAllEmployees();
  let employees = rows;
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee would you like to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);
  console.log("Employee removed from database");
  await loadMainPrompts();
}

async function updateEmployeeRole() {
  const [employeeRows] = await db.findAllEmployees();
  const employees = employeeRows;
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "What role would you like to update?",
      choices: employeeChoices
    }
  ]);

  const [roleRows] = await db.findAllRoles();
  const roles = roleRows;
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "What role would you like to assign to the chosen employee?",
      choices: roleChoices
    }
  ]);

  await db.updateEmployeeRole(employeeId, roleId);
  console.log("Updated employee's role");
  await loadMainPrompts();
}

async function updateEmployeeManager() {
  const [employeeRows] = await db.findAllEmployees();
  const employees = employeeRows;
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which manager would you like to update?",
      choices: employeeChoices
    }
  ]);

  const [managerRows] = await db.findAllPossibleManagers(employeeId);
  const managers = managerRows;
  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which employee would you like to designate as the manager for the chosen employee?",
      choices: managerChoices
    }
  ]);

  await db.updateEmployeeManager(employeeId, managerId);
  console.log("Updated employee's manager");
  await loadMainPrompts();
}

async function viewRoles() {
  const [rows] = await db.findAllRoles();
  let roles = rows;
  console.log("\n");
  console.table(roles);
  await loadMainPrompts();
}

async function addRole() {
  const [departmentRows] = await db.findAllDepartments();
  const departments = departmentRows;
  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const role = await prompt([
    {
      name: "title",
      message: "Name of the role?"
    },
    {
      name: "salary",
      message: "Salary of the role?"
    },
    {
      type: "list",
      name: "department_id",
      message: "This role belonges to which department?",
      choices: departmentChoices
    }
  ]);

  await db.createRole(role);
  console.log(`Added ${role.title} to database`);
  await loadMainPrompts();
}

async function removeRole() {
  const [roleRows] = await db.findAllRoles();
  const roles = roleRows;
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you wish to remove?",
      choices: roleChoices
    }
  ]);

  await db.removeRole(roleId);
  console.log("Role was removed from database");
  await loadMainPrompts();
}

async function viewDepartments() {
  const [rows] = await db.findAllDepartments();
  let departments = rows;
  console.log("\n");
  console.table(departments);
  await loadMainPrompts();
}

async function addDepartment() {
  const res = await prompt([
    {
      name: "name",
      message: "Name of department?"
    }
  ]);

  let name = res;
  await db.createDepartment(name);
  console.log(`Added ${name.name} to database`);
  await loadMainPrompts();
}

async function removeDepartment() {
  const [departmentRows] = await db.findAllDepartments();
  const departments = departmentRows;
  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt({
    type: "list",
    name: "departmentId",
    message: "Which department do you wish to remove?",
    choices: departmentChoices
  });

  await db.removeDepartment(departmentId);
  console.log(`Department removed from the database`);
  await loadMainPrompts();
}

async function viewUtilizedBudgetByDepartment() {
  const [rows] = await db.viewDepartmentBudgets();
  let departments = rows;
  console.log("\n");
  console.table(departments);
  await loadMainPrompts();
}

function addEmployee() {
  prompt([
    {
      name: "first_name",
      message: "Employee's first name?"
    },
    {
      name: "last_name",
      message: "Employee's last name?"
    }
  ])
    .then(res => {
      let firstName = res.first_name;
      let lastName = res.last_name;

      db.findAllRoles()
        .then(([rows]) => {
          let roles = rows;
          const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
          }));

          prompt({
            type: "list",
            name: "roleId",
            message: "Employee's role?",
            choices: roleChoices
          })
            .then(res => {
              let roleId = res.roleId;

              db.findAllEmployees()
                .then(([rows]) => {
                  let employees = rows;
                  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  }));

                  managerChoices.unshift({ name: "None", value: null });

                  prompt({
                    type: "list",
                    name: "managerId",
                    message: "Employee's manager?",
                    choices: managerChoices
                  })
                    .then(res => {
                      let employee = {
                        manager_id: res.managerId,
                        role_id: roleId,
                        first_name: firstName,
                        last_name: lastName
                      }

                      db.createEmployee(employee);
                    })
                    .then(() => console.log(
                      `Added ${firstName} ${lastName} to the database`
                    ))
                    .then(() => loadMainPrompts())
                })
            })
        })
    })
}

function quit() {
  console.log("bye bye!");
  process.exit();
}


init();

