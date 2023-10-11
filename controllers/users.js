const{request, response}=require('express');
const usersModel=require('../models/users');
require('dotenv').config();

const pool = require('../db');
const usersList=async (req=request,res=response)=>{
    
    let conn;
    try{
conn=await pool.getConnection();


        const users =await conn.query(usersModel.getAll,(err)=>{
            if(err){
                throw new Error(err);
            }
        })
        res.json(users);
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn) conn.end();
    }
}
const listUserByID =async (req=request,res=response)=>{
    const{id}=req.params;
    if(isNaN(id)){
        res.status(400).json({msg:'invalid ID'});
        return;
    }
    let conn;
    try{
conn=await pool.getConnection();


        const user =await conn.query(usersModel.getByID,[id],(err)=>{
            if(err){
                throw new Error(err);
            }
        })
        if(!user){
            res.status(404).json({msg:'User not found'});
            return;
        }
        res.json(user);
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn) conn.end();
    }
}
module.exports={usersList,listUserByID};    











