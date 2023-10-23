const{request, response}=require('express')
const usersModel = require('../models/users')
const pool = require('../db');

const usersList= async (req=request,res=response)=>{
    let conn;
    try{
       conn = await pool.getConnection();
    
       const users = await conn.query(usersModel.getAll,(err) => {
        if(err){
           throw new Error(err);
        }
       })
res.json(users);
    }catch (err){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}

const listUserByID= async (req=request,res=response)=>{
    const{id} = req.params;

    if (isNaN(id)){
        res.status(400).json({msg:'Invalid ID'});
        return;
    }

    let conn;
    try{
       conn = await pool.getConnection();
    
       const [user] = await conn.query(usersModel.getByID, [id] ,(err) => {
        if(err){
           throw new Error(err);
        }
       })

       if (!user){
        res.status(404).json({msg:"User not found"});
        return;
       }

res.json(user);
    }catch (err){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}
const addUser = async(req=request,res=response)=>{
    let conn;
    const {
   username,
   email,
   password,
   name,
   lastname,
   phone_number='',
   role_id,
   is_active=1
    } = req.body;
    if(!username || !email || !password || !name || !lastname || !role_id){
        res.status(400).json({msg:'Missing information'});
        return;
    }
    const user =[ username, email, password, name, lastname, phone_number, role_id, is_active]

    
    try{
conn = await pool.getConnection();
const [usernameUser] = await conn.query(usersModel.getByUsername,[username],(err)=>{
    if(err) throw err;
}
);
if (usernameUser){
    res.status(409).json({msg:`User whith username ${username} alreadys exits`});
    return;
}

const [emailUser] = await conn.query(usersModel.getByEmail,[email],(err)=>{
    if(err) throw err;
}
);
if (emailUser){
    res.status(409).json({msg:`User whith email ${email} alreadys exits`});
    return;
}


const userAdded = await conn.query(usersModel.addRow, [...user], (err)=>{
})
if(userAdded.affectedRows===0) throw new Error({msg:'failed to add user'});
res.json({msg:'User added succesfully'});
    }catch(error){
        console.log(error);
        res.status(500).json(error);

    }finally{
        if (conn) conn.end();
    }
}
const deleteUsers = async (req, res)=>{
    let conn;

    try{
        conn = await pool.getConnection();
        const {id} =req.params;
        const [userExists] =await conn.query(
            usersModel.getByID,
            [id],
            (err) => {if (err) throw err;}
        );
        if(!userExists || userExists.is_active === 0){
            res.status(404).json({msg:'User not Found'});
            return;
        }

        const userDelete = await conn.query(
            usersModel.DeleteRow,
            [id],
            (err) => {if(err)throw err;}
        );
        if (userDelete.affecteRows===0){
            throw new Error({msg:'failed to delete user'})
        };
        res.json({msg:'user deleted succesfully'});
    }catch(error){
        console.log(error);
        res.status(500).json(error);

    }finally{
       if(conn) conn.end(); 
    }
}
       
const modifyUser = async (req = request, res = response) => {
    const {
        username,
        email,
        password,
        name,
        lastname,
        phone_number = '',
        role_id,
        is_active = 1
    } = req.body;
    
    if (!username || !email || !password || !name || !lastname || !role_id) {
        res.status(400).json({msg: 'Missing information'});
        return
    }

    const user =[
        username, email, password, name, lastname, phone_number, role_id, is_active];

    let conn;

    try {
        conn = await pool.getConnection();

    const {id} =req.params;
    const [userExists] =await conn.query(
        usersModel.getByID,[id],
        (err) => {if (err) throw err;}
    );
    if(!userExists || userExists.is_active === 0){
        res.status(404).json({msg:'User not Found'});
        return;
    }
        const [usernameUser] = await conn.query(
            usersModel.getByUsername,
            [username],
            (err) => {if (err) throw err;}
        );
        if (usernameUser) {
            res.status(409).json({msg: `User with username ${username} already exists`});
            return;
        }

        const [emailUser] = await conn.query(
            usersModel.getByEmail,
            [email],
            (err) => {if (err) throw err;}
        );
        if (emailUser) {
            res.status(409).json({msg: `User with email ${email} already exists`});
            return;
        }

        const userModified = await conn.query(
            usersModel.modUser,
            [...user, id], 
            (err) => {if (err) throw err;}
        )

        if (userModified.affectedRows === 0) throw new Error ({msg: 'Failed to modify user'});
        
        res.json({msg:'User modified succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}

module.exports={usersList, listUserByID, addUser,deleteUsers, modifyUser };










