const { Router } = require('express');
const router = Router();

const { signIn, getProfile } = require('../controller/auth.controller');


router.post('/login', signIn);
router.post('/profile', getProfile);

module.exports = router;