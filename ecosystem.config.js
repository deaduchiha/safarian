module.exports = {
  apps: [{
    name: 'safarian',
    script: 'npm',
    args: 'start -- -p 3004',
    cwd: '/var/www/safa',
    env: {
      NODE_ENV: 'production',
      PORT: 3004
    }
  }]
}
