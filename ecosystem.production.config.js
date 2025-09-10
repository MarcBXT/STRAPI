module.exports = {
  apps : [{
    name: 'catalogue-analyses-production',
    interpreter: 'bash',
    script: 'yarn',
    args: 'start',
    env_production: {
      NODE_ENV: 'production',
      PORT: 1337,
    }
  }],
};
