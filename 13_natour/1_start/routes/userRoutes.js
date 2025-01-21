const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController'); // For authentication, we create a separate controller file , because authentication is a separate concern and we want to keep our code modular and clean. So we are creating a separate controller file for authentication.

const router = express.Router();

router.post('/signup', authController.signup); // we are creating a separate route for signup, as it is a separate concern and we want to keep our code modular and clean. So we are creating a separate route for signup.
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser)
  .get(userController.getUser);

module.exports = router;
