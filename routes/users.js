const { Router } = require("express")
const {usersList,listUserByID, addUser,deleteUsers, modifyUser}= require('../controllers/users');
const router = Router();

//http://localhost:3000/api/v1/users/
router.get('/',usersList);
router.get('/:id', listUserByID);
//router.post('/',usersList);
router.put('/',addUser);
router.patch('/:id',modifyUser);
router.delete('/:id', deleteUsers);
module.exports = router;