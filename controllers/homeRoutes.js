// Imports
const router = require("express").Router();
const { BlogPost, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    // Get all blogPosts and JOIN with user data and comment data
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          attributes: ["comment_body"],
        },
      ],
    });

    // Serialize data so the template can read it
    const blogPosts = blogPostData.map((blogPost) =>
      blogPost.get({ plain: true })
    );

    // Pass serialized data and session flag into template
    res.render("homepage", {
      blogPosts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// get router for /newblog renders newblog.handlebars 
router.get('/newblog', withAuth, async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const newBlogPost = await BlogPost.findAll();

    // Serialize data so the template can read it
    const blogs = newBlogPost.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('newblog', {
      blogs,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// post for newblog
router.post('/newblog', async (req, res) => {
  try {
    const newBP = await BlogPost.create(
      {
          title: req.body.post,
          description: req.body.desc,
          user_id: req.session.user_id,
      },
    );
    if (!newBP) {
      res.status(404).json({ message: "Unable to create blogpost" })
      return;
    }
    res.status(200).json(newBP);
  } catch (err) {
    res.status(500).json(err);
  }
});


// render homepage
router.get("/homepage", async (req, res) => {
  try {
    // Get all blogPosts and JOIN with user data and comment data
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          attributes: ["comment_body"],
        },
      ],
    });

    // Serialize data so the template can read it
    const blogPosts = blogPostData.map((blogPost) =>
      blogPost.get({ plain: true })
    );

    // Pass serialized data and session flag into template
    res.render("homepage", {
      blogPosts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Route set up to find single blog post and render blogPost page
router.get("/blogPost/:id", withAuth, async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id, {
      // Join user data and comment data with blog post data
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    const blogPost = blogPostData.get({ plain: true });
    // console.log(blogPost);

    res.render("blogPost", {
      ...blogPost,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
    res.redirect("/login");
  }
});

// route to allow logged in user access to the dashboard page
// Use withAuth middleware to prevent access to route
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      // Join user blog post and comment data with user data
      include: [
        {
          model: BlogPost,
          include: [User],
        },
        {
          model: Comment,
        },
      ],
      where: [
        {
          user_id: req.session.user_id,
        },
      ],
    });

    const user = userData.get({ plain: true });
    // console.log(user)

    res.render("dashboard", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// NEW POST PAGE: Renders 'create.handlebars'; redirects to /login if not logged in
router.get("/comment/:id", withAuth, async (req, res) => {
  try {
    // Get all blogPosts and JOIN with user data and comment data
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          attributes: ["comment_body"],
        },
      ],
      where: [
        {
          id: req.params.id,
        },
      ],
    });

    // Serialize data so the template can read it
    const blogPosts = blogPostData.map((blogPost) =>
      blogPost.get({ plain: true })
    );
    const user_id = req.session.user_id
console.log(blogPosts)
    // Pass serialized data and session flag into template
    res.render("comment", {
      blogPosts,
      user_id,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Route set up to be able to edit an existing blog post
// router.get("/comment/:id", async (req, res) => {
//   try {
//     const blogPostData = await BlogPost.findByPk(req.params.id, {
//       // Join user data and comment data with blog post data
//       include: [
//         {
//           model: User,
//           attributes: ["name"],
//         },
//         {
//           model: Comment,
//           include: [User],
//         },
//       ],
//     });

router.all("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

//post to comment
router.post("/comment/:id", async (req, res) => {
  console.log('inside')
  try {
    const comment = await Comment.create({
      comment_body: req.body.post,
      blogPost_id: req.params.id,
      user_id: req.session.user_id
    });

    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Export
module.exports = router;