module.exports = {
  apps: [{
    name: "mitm-monitor",
    script: "./dist/index.js",
    cwd: "/root/mitm-monitor/current/mitm-monitor", // 确保在子目录中运行
    watch: false,
    max_memory_restart: '2G',
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
      // 请在服务器上或此处配置 Supabase 环境变量
      SUPABASE_URL: process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL', 
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY',
      MITM_UNIT: 'mitm-proxy'
    }
  }],

  deploy: {
    production: {
      user: 'root',
      host: '8.216.36.44',
      ref: 'origin/main',
      repo: 'git@github.com:VaingloryReborn/VGReborn.git', // 你的 git 仓库地址
      path: '/root/mitm-monitor',
      'pre-deploy-local': '',
      // 进入子目录安装依赖并构建，然后重载 PM2
      'post-deploy': 'cd mitm-monitor && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
