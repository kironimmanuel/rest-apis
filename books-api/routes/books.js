const express = require('express');
const router = express.Router();
const { getAllBooks } = require('../controllers/books');

router.route('/').get(getAllBooks);

module.exports = router;
