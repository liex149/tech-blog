const sequelize = require('../config/connection');
const { User, BlogPost, } = require('../models');

const userData = require('./userData.json');
// const commentData = require('./commentData.json');
const blogPostData = require('./blogPostData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const blogPost of blogPostData) {
    await BlogPost.create({
      ...blogPost
      
    });

  // for (const comment of commentData) {
  //   await Comment.create({
  //     ...comment
  //   });
  }

process.exit(0);
};


// };

seedDatabase();
