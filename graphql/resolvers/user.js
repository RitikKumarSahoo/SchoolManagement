const User = require("../../models/user/index");
const mongoose = require("mongoose");
const { GraphQLError } = require("graphql");

const userResolver = {
  Query: {
    getUser: async (parent, args) => {
      try {
        const { id } = args; // Destructure `id` from `args` here
        console.log(parent, id, args);
        console.log("Hello");

        return await User.findOne({ _id: id });
      } catch (error) {
        return error;
      }
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
