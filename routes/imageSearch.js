

const express = require('express');
const router = express.Router();
const { imageSearch } = require('../controllers/imageSearch');


router.post('/imageSearch', imageSearch);

module.exports = router;
