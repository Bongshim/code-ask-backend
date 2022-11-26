const express = require('express');
const validate = require('../middleware/validate');
const {auth} = require('../middleware/auth');
const authValidation = require('../validations').authValidation;
const authController = require('../controllers').authController;

const router = express.Router();

router.post('/signin', validate(authValidation.signin), authController.login);
router.post('/signup', validate(authValidation.signup), authController.signup);

router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;
