const express = require('express');
const router = express.Router();
const Post = require('../model/Post');

// Routes
router.get('', async (req, res) => {
    try {
    const locals = {
        title: "NodeJs Blog",
        Description: "Simple Blog created with Nodejs, Express & MongoDB"
    }
    let perPage = 10;
    let page = req.query.page || 1;
    const data = await Post.aggregate([ { $sort: {createdAt: -1}} ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
             data, 
             current: page,
             nextPage: hasNextPage ? nextPage : null
            });

    } catch(error) {
        console.log(error);
    }
});

router.get('/about', (req, res) => {
    res.render('about');
});

// function insertPost () {
//     Post.insertMany([
//         {
//             title: "Building a Blog",
//             body: "This is the body text"
//         },
//         {
//             title: "Web Development with Node.js",
//             body: "Learn to create web applications using Node.js"
//         },
//         {
//             title: "JavaScript Fundamentals",
//             body: "A guide to understanding the basics of JavaScript"
//         },
//         {
//             title: "Database Management with Node.js",
//             body: "Using databases in Node.js applications"
//         },
//         {
//             title: "Node.js and Express.js",
//             body: "Building APIs with Node.js and Express.js"
//         },
//         {
//             title: "Front-end Development",
//             body: "Creating beautiful user interfaces with Node.js"
//         },
//         {
//             title: "Node.js Security",
//             body: "Protecting your Node.js applications from security threats"
//         }
//     ])
// }
// insertPost();

module.exports = router;


// GET /
// Post: id
router.get('/post/:id', async (req, res) => {
    try {
    let slug = req.params.id;
        const data = await Post.findById({_id: slug});
        const locals = {
            title: data.title,
            Description: "Simple Blog created with Nodejs, Express & MongoDB"
        }
        res.render('post', {locals, data});
    } catch(error) {
        console.log(error);
    }
});

// POST
// Post - searchItem

router.post('/search', async (req, res) => {
    try {
   const locals = {
    title: "Search",
    description: "Simple Blog created with NodeJs, Express & MongoDb."
   }
   let searchTerm = req.body.searchTerm;
   const searchNoSpecialChar = searchTerm.replace(/[*a-zA-Z0-9]/g, "")

   const data = await Post.find({
    $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i')}},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i')}},
    ]
   })

   res.render("search", {
    data,
    locals
   });
   }
    catch(error) {
        console.log(error);
    }
});