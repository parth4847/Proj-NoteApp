const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// map the POST request to the register function
router.post('/register', registerUser);

// map the POST request to the login function
router.post('/login', loginUser);

module.exports = router;