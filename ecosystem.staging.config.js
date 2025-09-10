module.exports = {
  apps : [{
    name: 'catalogue-analyses-staging',
    interpreter: 'bash',
    script: 'yarn',
    args: 'develop',
    env_production: {
      NODE_ENV: 'production',
      PORT: 1335,
    }
  }],
};
