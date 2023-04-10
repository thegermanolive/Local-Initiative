module.exports = {
    resolve: {
      fallback: {
         "url": require.resolve("url/") 
        }
    },
    resolve: {
        fallback: {
          util: require.resolve("util/")
        }
    },
    resolve: {
        fallback: {
            "fs": false
        },
    }
  };