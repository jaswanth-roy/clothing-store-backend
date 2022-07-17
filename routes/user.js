const express=require('express');
const router=express.Router();

const {signup,
       login,
       logout,
       forgotPassword,
       passwordReset,
       getLoggedUser,
       changePassword,
       updateUser,adminAllUsers,managerAllUser,adminSingleUser,updateSingleUser,deleteSingleUser} = require('../controllers/usercontroller');
const {isLoggedIn,customRole} = require('../middlewares/user');
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotPassword').post(forgotPassword);
router.route('/password/reset/:token').post(passwordReset);
router.route('/userdashboard').get(isLoggedIn, getLoggedUser);
router.route('/changePassword').post(isLoggedIn, changePassword);
router.route('/updateUser').post(isLoggedIn, updateUser);
//admin routes
router.route('/admin/users').get(isLoggedIn,customRole('admin'), adminAllUsers);
router
.route('/admin/user/:id')
.get(isLoggedIn,customRole('admin'), adminSingleUser)
.put(isLoggedIn,customRole('admin'), updateSingleUser)
.delete(isLoggedIn,customRole('admin'), deleteSingleUser);
//manager routes
router.route('/manager/users').get(isLoggedIn,customRole('manager'), managerAllUser);


module.exports=router;


