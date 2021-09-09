const express=require('express');
const router=express.Router();
const {body} = require('express-validator');
const {authenticateUser} = require("../middleware/authentication.middleware");

const userController = require("../controllers/user.controller");
//validations is performed using express validator

router.post( "/admin",authenticateUser,[body("name", "Enter a valid name").trim().not().isEmpty(),
                          body("phone","Enter a valid phone").trim().isLength({min:10,max:10}),
                          body('password',"Password must be at least 6 character long ").trim().isLength({min:6}),
                          body("areaCommittee").trim().not().isEmpty(),],
                          userController.registerAdmin);
router.post( "/donor",authenticateUser,[body("name", "Enter a valid name").trim().not().isEmpty(),
                          body("phone","Enter a valid phone").trim().isLength({min:10,max:10}),
                          body('password',"Password must be at least 6 character long ").trim().isLength({min:6}),
                          body("locality").trim().not().isEmpty(),
                          body("bloodGroup").isIn(["A+VE","A-VE","B+VE","B-VE","O+VE","O-VE","AB+VE","AB-VE"])],
                                userController.registerDonor);
//get admin list                    
router.get('/',authenticateUser,userController.userList);

// remove admin authenticateUser
router.delete("/:userId",userController.deleteUser);
    


router.post( "/login",[body("phone","Enter a valid phone").trim().isLength({min:10,max:10}),
                       body('password',"Password must be at least 6 character long").trim().isLength({min:6})],
                       userController.login);

router.delete('/logout',userController.logout);

//reset password
router.put('/password',authenticateUser,[body("oldPassword").trim().not().isEmpty(),
                                         body("newPassword").trim().not().isEmpty()],
                      userController.updatePassword);







module.exports = router;
