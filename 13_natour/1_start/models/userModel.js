const mongoose = require('mongoose');
const validatorPKG = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email address'],
    unique: true,
    lowercase: true,
    validate: [validatorPKG.isEmail, 'Enter a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters.'],
  },
  //===> Validating the confirm password field , by comparing the password field with the confirm password field . If both are same than only the user will be able to create an account.
  //!==> NOTE ::> This will only work on "create()" and "save()" methods. It will not work on "update()" methods or any other methods. So from now on , we will be using "save()" method to update the password.
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
});

//===> Encrypting the password before saving it to the database.
//===> This will run before saving the data to the database.
//===> We are using "bcrypt" package to encrypt the password.
//===> We are using "12" as the salt value , which is recommended by the "bcrypt" documentation.
//===> We are using "async" function , because we are using "await" inside the function. As bcrypt.hsah() returns a promise , so we are using "await" to wait for the promise to resolve.
//===> bcrypt.hash() runs asynchronously . There is a synchronous version of this function called "bcrypt.hsahSync()" , but it is not recommended to use it , because it will block the event loop and it will slow doen the server . So it is recommended to use the asynchronous version of the function.
//===> We are using "this" keyword to point to the current document.
//===> We are using a predefined method called "isModified()" to check if the password is modified or not. If the password is not modified than we will not encrypt the password again.
//===>(How hash() works i.e. bcrypt.hash()) ==> first parameter is a string which is the password , second parameter is the salt value which is a number , the higher the number , the more secure the password will be. The third parameter is a callback function which will be called after the password is encrypted. But we are using "async" function , so we are using "await" instead of callback function. Based on salt value , first bcrypt will generate a salt value eg : salt value = "123jbvks" or any . Then it will hash the password based on the number of rounds provided in the second parameter. The more rounds , the more secure the password will be. Then it will append the salt value to the hashed password and store it in the database. So when the user logs in , bcrypt will take the password and the salt value from the hashed password and then it will hash the password again and then it will compare the hashed password with the hashed password stored in the database. If both are same than the user will be able to login.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12); // bscriptjs is the library which is used to hash the password.
  this.confirmPassword = undefined; // in mongoose if we assign a field with undefined , than it will not be stored in the database. As we are using confirmPassword field only for validation purpose , so we are not storing it in the database.
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
