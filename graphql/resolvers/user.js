const User = require("../../models/user/index");
const mongoose = require("mongoose");

const userResolver = {
  Query: {
    getUser: async (parent, { id }) => {
      try {
        console.log(parent, id);

        console.log("Hello");

        const response = await User.findOne({ _id: id });
        console.log(response);

        if (!response) {
          throw new Error("User not found");
        }

        return response;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error(`Error fetching user: ${error.message}`);
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
