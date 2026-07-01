const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const db = require('./config/db/db');
const passport = require('./middleware/passport');
const User = require('./models/UserModel/userModel');
const {authRouter} = require('./routes/auth/authRoutes')
const {pageRouter} = require('./routes/pages/pageRoutes')

const app = express();
const PORT = 3001;

db();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'admin-panel-secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(async (req, res, next) => {
    if (req.user && req.user._id) {
        try {
            const freshUser = await User.findById(req.user._id).lean();
            req.user = freshUser || req.user;
        } catch (error) {
            console.error(error);
        }
    }
    res.locals.user = req.user || null;
    next();
});

app.use('/auth', authRouter);
app.use('/pages', pageRouter);

// Server
app.listen(PORT, () => {
    console.log(`Server Running on : http://localhost:${PORT}`);
});