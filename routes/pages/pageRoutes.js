const pageRouter = require('express').Router();

const {dashboardControllerRender, profileController, updateProfileController} = require('../../controller/pages/pageController');
const { renderAddBlog, createBlog, renderViewBlogs, renderEditBlog, updateBlog, deleteBlog } = require('../../controller/pages/blogController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// configure multer storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
		cb(null, name);
	}
});
const upload = multer({ storage: storage });

function requireAuth(req, res, next) {
	if (req.isAuthenticated && req.isAuthenticated()) {
		return next();
	}

	return res.redirect('/auth/login');
}

pageRouter.get('/dashboard', requireAuth, dashboardControllerRender);
pageRouter.get('/blog/add', requireAuth, renderAddBlog);
pageRouter.post('/blog/add', requireAuth, upload.single('image'), createBlog);
pageRouter.get('/blogs', requireAuth, renderViewBlogs);
pageRouter.get('/blog/:id/edit', requireAuth, renderEditBlog);
pageRouter.post('/blog/:id/edit', requireAuth, upload.single('image'), updateBlog);
pageRouter.post('/blog/:id/delete', requireAuth, deleteBlog);
pageRouter.get('/profile', requireAuth, profileController);
pageRouter.post('/profile', requireAuth, upload.single('profileImage'), updateProfileController);


module.exports = {pageRouter};