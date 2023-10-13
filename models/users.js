const usersModel = {
    getAll: `
    SELECT
        *
    FROM 
       users    
       `,

       getByID: `
       SELECT
          *
       FROM
          users
        WHERE
          id=?
       `, 
       addRow:`
INSERT INTO
users(
   username,
   email,
   password,
   name,
   lastname,
   phone_number,
   role_id,
   is_active

)
VALUES(
   ?,?,?,?,?,?,?,?
)
       `,
       getByUsername:   `
       SELECT
       id
       FROM
       Users
       WHERE username = ?`,
       getByEmail:`
       SELECT 
       id
       FROM
       Users
       WHERE
       email = ?`
};
module.exports = usersModel;