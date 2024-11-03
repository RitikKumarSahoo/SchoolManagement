const { mergeTypeDefs } = require("@graphql-tools/merge");
const userSchema = require("./user");
// Import other schemas as needed

const typeDefs = mergeTypeDefs([userSchema /*, otherSchemas */]);

module.exports = typeDefs;
