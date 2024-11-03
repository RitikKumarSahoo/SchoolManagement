const User = require("../../models/user/index");

const userResolver = {
  Query: {
    getUser: async (parent, { id }) => {
      return await User.findOne({ _id: id });
    },
    getAllUsers: async () => await User.find(),
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      const newUser = new User({ username, email, password });
      await newUser.save();
      return newUser;
    },
  },
};

module.exports = userResolver;
