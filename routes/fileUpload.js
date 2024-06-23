const express = require("express");
const router = express.Router();

const { imageUpload} = require("../controllers/filesUpload");

//api routes

router.post("/imageUpload",imageUpload );


module.exports = router;