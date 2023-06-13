

const connection = require('./connection');

class DB {
  constructor(connection) {

    this.connection = connection;
  }

  findAllEmployees() {
    return this.connection.promise().query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON manager.id = employee.manager_id;
    `);
  }

  findAllManagers(employeeId) {
    return this.connection.promise().query(`
      SELECT id, first_name, last_name
      FROM employee
      WHERE id != ${employeeId}
    `);
  }

  createEmployee(employee) {
    return this.connection.promise().query(`
      INSERT INTO employee SET ?
    `, employee);
  }

  removeEmployee(employeeId) {
    return this.connection.promise().query(`
      DELETE FROM employee WHERE id = ${employeeId}
    `);
  }

  updateRole(employeeId, roleId) {
    return this.connection.promise().query(`
      UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}
    `);
  }

  updateManager(employeeId, managerId) {
    return this.connection.promise().query(`
      UPDATE employee SET manager_id = ${managerId} WHERE id = ${employeeId}
    `);
  }

  findAllRoles() {
    return this.connection.promise().query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
  }

  createRole(role) {
    return this.connection.promise().query(`
      INSERT INTO role SET ?
    `, role);
  }

  removeRole(roleId) {
    return this.connection.promise().query(`
      DELETE FROM role WHERE id = ${roleId}
    `);
  }

  findAllDepartments() {
    return this.connection.promise().query(`
      SELECT department.id, department.name
      FROM department;
    `);
  }

  viewDepartmentBudget() {
    return this.connection.promise().query(`
      SELECT department.id, department.name, SUM(role.salary) AS utilized_budget
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      GROUP BY department.id, department.name;
    `);
  }

  createDepartment(department) {
    return this.connection.promise().query(`
      INSERT INTO department SET ?
    `, department);
  }

  removeDepartment(departmentId) {
    return this.connection.promise().query(`
      DELETE FROM department WHERE id = ${departmentId}
    `);
  }

  findEmployeesByDepartment(departmentId) {
    return this.connection.promise().query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department department ON role.department_id = department.id
      WHERE department.id = ${departmentId};
    `);
  }

  findEmployeesByManager(managerId) {
    return this.connection.promise().query(`
      SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title
      FROM employee
      LEFT JOIN role ON role.id = employee.role_id
      LEFT JOIN department ON department.id = role.department_id
      WHERE manager_id = ${managerId};
    `);
  }
}

module.exports = new DB (connection);
