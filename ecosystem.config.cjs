/**
 * pm2 process definition. Start with:
 *   pm2 start ecosystem.config.cjs
 *
 * Next reads .env.local from the project root itself when `next start` boots,
 * so INQUIRIES_PASSWORD does not need repeating here — and should not be, since
 * this file is committed and that value is a secret.
 */
module.exports = {
  apps: [
    {
      name: "sinag",
      cwd: "/home/gem-web/sinag-website-demo",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      // The in-memory submission cooldown lives in this process, so a restart
      // clears it. Restarting on a memory ceiling is still the right trade.
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      out_file: "/home/gem-web/.pm2/logs/sinag-out.log",
      error_file: "/home/gem-web/.pm2/logs/sinag-error.log",
      time: true,
    },
  ],
};
