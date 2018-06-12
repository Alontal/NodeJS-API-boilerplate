var E = module.exports;

E.getSomeComplicatedQuery = `
SELECT 
    clients.id AS id,
    clients.client_id AS client_id,
    clients.time_created AS time_created,
    sys_users.first_name AS first_name
    ....
FROM
    clients,
    sys_users
    ....
WHERE
    .....
`;