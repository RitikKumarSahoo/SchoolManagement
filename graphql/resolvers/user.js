const User = require("../../models/user/index");
const mongoose = require("mongoose");
const { GraphQLError } = require("graphql");

const userResolver = {
  Query: {
    getUser: async (parent, args, context) => {
      try {
        const { id } = args;
        console.log(parent, id, args, context);
        const user = await User.findOne({ _id: id });

        return user;
      } catch (error) {
        throw new GraphQLError(error);
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
