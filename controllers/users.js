const{request, response}=require('express')
//const bcrypt =require('bcrypt');
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
    const saltRounds=10;
    const passwordHash = await bcrypt.hash(password,saltRounds);

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
       
const updateUser = async(req=request,res=response)=>{
    const {
   username,
   email,
   password,
   name,
   lastname,
   phone_number,
   role_id,
   is_active
    } = req.body;

    const {id}=req.params;
    let passwordHash;
    if(password){
        const saltRounds=10;
         passwordHash=await bcrypt.hash(password,saltRounds);

    }
    let newUserData=[
        username,
        email,
        password,
        name,
        lastname,
        phone_number,
        role_id,
        is_active
    ]
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
    
     const oldUserData=[
userExists.username,
userExists.email,
userExists.password,
userExists.name,
userExists.lastname,
userExists.phone_number,
userExists.role_id,
userExists.is_active

     ];

     newUserData.forEach((UserData, index) => {
        if(!userData){
            newUserData[index]=oldUserData[index];

        }
     
    });

    const userUpdated=await conn.query(
        usersModel.updateRow,[...newUserData,id],
        (err)=>{if(err) throw err;}

    );
    if(userUpdated.affecteRows===0){
        throw new Error('User not updated');
    
    }
res.json({msg:'user updated succesfully'});
}catch(error){
    console.log(error);
    res.status(500).json(error);

}finally{
   if(conn) conn.end(); 
}
}

const sigIn =async(req =request, res=response)=>{
    let conn;
    const{username,password}=req.body;
    if(!username||!password){
        res.status(400).json({msg:'username and password are requerid'});
        return;
    }
    try{

    conn=await pool.getConnection();
    const[user]=await conn.query(usersModel.getByUsername,[username],(err)=>{if(err)throw err;}
    )
    if(!user||user.is_active===0){
        res.status(404).json({msg:' user not fount   '})
        return;

    }
    const passwordOk=bcrypt.compare(password, user.password);
    if(!passwordOk){
        res.status(400).json({msg:'wrong username or password'});
return;

    }
    delete user.password;
    delete user.created_at;
    delete user.updated_at;
res.json(user);
}catch(error){
    console.log(error);
    res.status(500).json(error);
}finally{
    if(conn) conn.end();

}}


module.exports={usersList, listUserByID, addUser,deleteUsers, updateUser,sigIn};











