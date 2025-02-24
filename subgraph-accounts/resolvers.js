const { AuthenticationError, ForbiddenError } = require("./utils/errors");

const resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      const user = await dataSources.accountsAPI.getUser(id);
      if (!user) {
        throw new Error("No user found for this Id");
      }
      return user;
    },
    me: async (_, __, { dataSources, userId }) => {
      if (!userId) throw new AuthenticationError(authErrMessage);
      const user = await dataSources.accountsAPI.getUser(userId);
      return user;
    },
  },
  Mutation: {
    updateProfile: async (
      _,
      { updateProfileInput },
      { dataSources, userId }
    ) => {
      if (!userId) throw new AuthenticationError(authErrMessage);
      try {
        const updatedUser = await dataSources.accountsAPI.updateUser({
          userId,
          userInfo: updateProfileInput,
        });
        return {
          code: 200,
          success: true,
          message: "Profile successfully updated!",
          user: updatedUser,
        };
      } catch (err) {
        return {
          code: 400,
          success: false,
          message: err.message,
        };
      }
    },
  },
  User: {
    __resolveType(user) {
      return user.role;
    }
  },
  Host: {
    __resolveReference(User, {dataSources, userId}) {
      return dataSources.accountsAPI.getUser(userId);
    }
  },
  Guest: {
    __resolveReference(Guest, {dataSources, userId}) {
      return dataSources.accountsAPI.getUser(userId);
    }
  }
};

module.exports = resolvers;
