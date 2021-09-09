const express = require("express");
const {body,params} = require('express-validator');

const router=express.Router();

const {authenticateUser} = require("../middleware/authentication.middleware");
const donorController = require("../controllers/donor.controller");



router.get("/:bloodGroup",donorController.fetchDonor);
router.delete("/:donorId",donorController.deleteDonor);



module.exports = router;