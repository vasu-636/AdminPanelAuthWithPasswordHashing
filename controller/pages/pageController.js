const User = require('../../models/UserModel/userModel');

const dashboardControllerRender = (req,res)=>{

    const user = req.user || null;

    console.log("Dashboard Loaded Successfully!");
    res.render('index', { user })
}

const profileController = async (req, res) => {
    console.log("Profile Page Loaded Successfully!");

    const user = req.user ? await User.findById(req.user._id) : null;

    res.render('profile', { user });
}

const updateProfileController = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }

        const { name, email, phoneNumber, bio } = req.body;
        const currentUser = await User.findById(req.user._id);

        if (!currentUser) {
            return res.redirect('/auth/login');
        }

        currentUser.name = name;
        currentUser.email = email;
        currentUser.phoneNumber = phoneNumber || '';
        currentUser.bio = bio || '';

        if (req.file && req.file.filename) {
            const imagePath = '/public/uploads/' + req.file.filename;
            currentUser.profileImage = `${imagePath}?v=${Date.now()}`;
        }

        await currentUser.save();

        req.login(currentUser, (loginError) => {
            if (loginError) {
                console.error(loginError);
            }
            res.redirect('/pages/profile');
        });
    } catch (error) {
        console.error(error);
        res.redirect('/pages/profile');
    }
}

module.exports = {
    dashboardControllerRender, profileController, updateProfileController
}