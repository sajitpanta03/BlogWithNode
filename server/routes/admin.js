const express = require('express');
const router = express.Router();
const Post = require('../model/Post');
const User = require('../model/User');

const adminLayout = '../views/layouts/admin'
// GET
// Admin - admin login
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            Description: "Simple Blog created with Nodejs, Express & MongoDB"
        }
        res.render('admin/index', {
            locals,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }
});

// POST
// Admin - check login
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (req.body.username === 'admin' && req.body.password === 'password') {
            res.redirect('/adminWelcome');
        } else {
            res.send("Wrong credential");
        }
        console.log(req.body);
        res.redirect('/admin')

    } catch (error) {
        console.log(error);
    }
});

router.get('/adminWelcome', async (req, res) => {
    try {
        const data = await Post.find();

        res.render('./admin/adminHome', {
            data: data,
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/addBlog', async (req, res) => {
    res.render('./admin/addBlog');
});

router.post('/addedBlog', async (req, res) => {
    try {
        const { title, body } = req.body;

        const postToAdd = await Post.create({ title, body });

        res.json({ message: 'Blog added succesfully' });

    } catch (error) {
        console.error(error);
    }
});

router.get('/editBlog/:id', async (req, res) => {
    try {
        let slug = req.params.id;
        const data = await Post.findById({ _id: slug });
        const locals = {
            title: data.title,
            Description: "Simple Blog created with Nodejs, Express & MongoDB"
        }

        res.render('./admin/editBlog', {
            locals,
            data: data,
        });
    } catch (error) {
        console.log(error);
    }
})

router.post('/editedBlog/:id', async (req, res) => {
    const postId = req.params.id;
    try {
        const { title, body } = req.body;

        const postToEdit = await Post.updateOne({ _id: postId }, { title, body });

        if (postToEdit.nModified === 0) {
            return res.json({ message: 'Post not found' });
        }

        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the post.' });
    }
});

router.get('/deleteBlog/:id', async (req, res) => {
    const postId = req.params.id;

    try {
        const postToDelete = await Post.deleteOne({ _id: postId });

        if (postToDelete.deletedCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ message: 'Blog has been deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.json('sucess');
    });
});

module.exports = router;
