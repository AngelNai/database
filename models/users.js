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
       *
       FROM
       Users
       WHERE username = ?`,
       getByEmail:`
       SELECT 
       id
       FROM
       Users
       WHERE
       email = ?`,
       DeleteRow:`
    UPDATE 
    users
    SET
    is_active =0
    WHERE 
    id=?
    `,
    updateRow: `
    UPDATE 
        users
    SET
        username = ?,
        email = ?,
        password = ?,
        name = ?,
        lastname = ?,
        phone_number = ?,
        role_id = ?,
        is_active = ?
    WHERE
        id = ?`

};
module.exports = usersModel;