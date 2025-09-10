module.exports = {
  apps : [{
    name: 'catalogue-analyses-dev',
    interpreter: 'bash',
    script: 'yarn',
    args: 'start',
    env_production: {
      NODE_ENV: 'production',
      PORT: 1333,
    }
  }],
};
