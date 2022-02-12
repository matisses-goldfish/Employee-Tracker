-- I need to join the information to include roles and depatement info into our employees table
-- I need to join the information depatement info into our roles table

-- SELECT
--   (1-table-name).(1-table-element) AS (name), (2-table-name).(2-table-element) AS (name)
-- FROM (1-table-name)
-- JOIN (2-table-name) ON (1-table-name).(2-table-element) = (2-table-element).id;

-- Im not sure is this is correct :/
-- employees
SELECT 
    roles.title AS title, roles.salary AS salary
    FROM employees
    LEFT JOIN roles ON employees.roles = roles.roles

-- roles
SELECT 
    department.title AS title 
    FROM roles
    LEFT JOIN department ON roles.department = department.department
