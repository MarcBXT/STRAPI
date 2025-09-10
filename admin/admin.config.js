module.exports = {
  webpack: (config, webpack) => {
    // Add your variable using the DefinePlugin
    config.plugins.push(
      new webpack.DefinePlugin({
        //All your custom ENVs that you want to use in frontend
        CUSTOM_VARIABLES: {
          backendUrl: JSON.stringify(process.env.CATALOG_API_URL),
        },
      })
    );
    // Important: return the modified config
    return config;
  },
};