const{request, response}=require('express')

const userslist=(req=request,res=response)=>{
    res.json({msg:'Hola usuario llevame con tu lider...'})
    
}

module.exports=usersList;