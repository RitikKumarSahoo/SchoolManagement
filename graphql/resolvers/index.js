const { mergeResolvers } = require("@graphql-tools/merge");
const userResolver = require("./user");
// Import other resolvers as needed

const resolvers = mergeResolvers([userResolver /*, otherResolvers */]);

module.exports = resolvers;
