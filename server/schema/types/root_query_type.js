const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString } = graphql;

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    testField: {
      type: GraphQLString,
      resolve() {
        return "Hello, GraphQL!";
      },
    },
  }),
});

module.exports = RootQueryType;
