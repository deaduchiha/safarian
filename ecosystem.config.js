module.exports = {
  apps: [
    {
      instances: 1,
      exec_mode: "fork",
      name: 'safarian',
      script: 'npm',
      args: 'start',
      cwd: '/srv/safarian/safarian',
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
        BETTER_AUTH_URL: 'https://pc.nikode.ir',
        // Set BETTER_AUTH_SECRET on the server (do not commit). Example:
        // BETTER_AUTH_SECRET: 'your-production-secret',
      }
    }
  ]
}
