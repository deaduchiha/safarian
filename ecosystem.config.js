module.exports = {
  apps: [
    {
      name: 'safarian',
      script: 'npm',
      args: 'start',
      cwd: '/srv/safarian/safarian',
      env: {
        NODE_ENV: 'production',
        PORT: 3004
      }
    }
  ]
}
