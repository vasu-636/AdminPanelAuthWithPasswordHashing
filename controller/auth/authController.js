const bcrypt = require('bcrypt');
const passport = require('../../middleware/passport');
const User = require('../../models/UserModel/userModel');
const SALT_ROUNDS = 10;

const registerController = (req, res) => {
    console.log('Register Page Loaded Successfully!');
    res.render('register');
};

const signInController = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error in signInController', err);
        }

        if (!user) {
            console.log('Login failed:', info?.message || 'Invalid credentials');
            return res.redirect('/auth/register');
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error('Login error', loginErr);
            }
            req.user = user;
            return res.redirect('/pages/dashboard');
        });
    })(req, res, next);
};

const signUpController = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        console.log('User Added Successfully! User ---> ', user);
        return res.redirect('/auth/login');
    } catch (error) {
        console.log('Something Went Wrong .............', error);
    }
};

const logoutController = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error', err);
            return next(err);
        }

        req.session.destroy((sessionErr) => {
            if (sessionErr) {
                console.error('Session destroy error', sessionErr);
            }

            res.clearCookie('userId');
            res.clearCookie('connect.sid');
            console.log('Logout Done Successfully!');
            return res.redirect('/auth/login');
        });
    });
};

const loginController = (req, res) => {
    console.log('Login Page Loaded Successfully!');
    res.render('login');
};

module.exports = { registerController, loginController, signInController, signUpController, logoutController };