const express=require('express');
const router=express.Router();
const {body} = require('express-validator');
const {authenticateUser} = require("../middleware/authentication.middleware")

const locationController = require("../controllers/location.controller");
//validations is performed using express validator

router.get('/',locationController.listLocation)
router.post('/',authenticateUser,[body("location","is required").trim().not().isEmpty()],
                locationController.addLocation);
router.delete('/:locationId',authenticateUser,locationController.removeLocation);
router.put('/:locationId',[body("location","is required").trim().not().isEmpty()],
                         locationController.updateLocation)

module.exports = router;