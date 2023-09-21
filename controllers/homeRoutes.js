// Imports
const router = require("express").Router();
const { BlogPost, User, Comment } = require("../models");
const withAuth = require("../utils/auth");
// get route for blogpost
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

// comment on blog
router.post("/comment/:id",withAuth, async (req, res) => {
  // add a comment. Save the user id and blogpost_id
  try {
    const comData = await Comment.create(
      {
        comment_body: req.body.post,
        user_id: req.session.user_id,
        blog_post_id: req.body.bpid,
      },
    );

    if (!comData) {
      res.status(404).json({ message: "No blogpost found with that id!" });
      return;
    }

    res.status(200).json(comData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get comment from blogpost
router.get("/comment/:id", withAuth, async (req, res) => {
  try {
    const bpData = await BlogPost.findAll({
      include: { all: true, nested: true },
      where: [
        {
          id: req.params.id,
        },
      ],

    });

    const cData = await Comment.findAll({
      include:
      {
        all: true,
        nested: true
      },

      where: 
      [
        {
          blog_post_id: req.params.id,
        },
      ],
    });
    // serialize data
    const postData = bpData.map((description) => description.get({ plain: true }));
    const commentPost = cData.map((comment) => comment.get({ plain: true }));

    res.render('comment', {
      postData,
      commentPost,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//update by id path
router.get("/update/:id", withAuth, async (req, res) => {
  try {
    const blogpostData = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      where: [
        {
          id: req.params.id,
        },
      ],
    });

    // Serialize data so the template can read it
    const blogposts = blogpostData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render("update", {
      blogposts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//update your own post
router.put("/update/:id",withAuth, async (req, res) => {
 
  try {
    const blogpostData = await BlogPost.update(
      {
        title: req.body.title,
        description: req.body.description,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (!blogpostData) {
      res.status(404).json({ message: "No blogpost found with that id!" });
      return;
    }
    res.status(200).json(blogpostData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.all("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});


router.delete('/delete/:id', withAuth, async (req, res) => {
  try {
    const deleteBlogPost = await BlogPost.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteBlogPost) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }

    res.status(200).json(deleteBlogPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Export
module.exports = router;