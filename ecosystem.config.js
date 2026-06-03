module.exports = {
  apps: [
    {
      instances: 1,
      exec_mode: "fork",
      name: 'safarian',
      script: 'npm',
      args: 'start',
      cwd: '/srv/safarian/safarian',
      env_file: '/srv/safarian/safarian/.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
        BETTER_AUTH_URL: 'https://pc.nikode.ir',
      },
    }
  ]
}
