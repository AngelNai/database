const { Router } = require("express")
const {usersList,listUserByID, addUser,deleteUsers, updateUser, sigIn}= require('../controllers/users');
const router = Router();

//http://localhost:3000/api/v1/users/
router.get('/',usersList);
router.get('/:id', listUserByID);
//router.post('/',sigIn);
router.put('/',addUser);
router.patch('/:id',updateUser);
router.delete('/:id', deleteUsers);
module.exports = router;