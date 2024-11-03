const { mergeResolvers } = require("@graphql-tools/merge");
const userResolvers = require("./user");
// Import other resolvers as needed

const resolvers = mergeResolvers([userResolvers /*, otherResolvers */]);

module.exports = resolvers;
