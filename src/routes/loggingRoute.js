const { Router } = require('express');

const controllers = require('../controllers/loggingController');
const { tokenVerifier } = require('../Helpers/jwtHelpers');

const router = Router()

router.post("/loginUser", controllers.loginUser );
router.post("/registerUser", controllers.registerUser );
router.post("/cookieVerification",tokenVerifier, controllers.verifyCookie );

module.exports = router;