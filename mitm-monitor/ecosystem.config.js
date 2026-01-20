const path = require('path');
const fs = require('fs');

function loadEnv() {
  try {
    // 尝试读取同目录下的 supabase.local.json
    const envPath = path.join(__dirname, 'supabase.local.json');
    if (fs.existsSync(envPath)) {
      return require(envPath);
    }
  } catch (e) {
    console.warn('Warning: Could not load supabase.local.json', e);
  }
  return {};
}

const localEnv = loadEnv();

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
      // 优先使用加载到的本地配置，否则使用环境变量或占位符
      SUPABASE_URL: localEnv.SUPABASE_URL || process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL', 
      SUPABASE_SERVICE_ROLE_KEY: localEnv.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY',
      MITM_UNIT: 'mitm-proxy'
    }
  }],

  deploy: {
    production: {
      user: 'root',
      host: '8.216.36.44',
      key: '~/.ssh/id_rsa', // 指定本地私钥路径
      ssh_options: 'ForwardAgent=yes', // 允许 SSH Agent 转发
      ref: 'origin/main',
      repo: 'git@github.com:VaingloryReborn/VGReborn.git', // 你的 git 仓库地址
      path: '/root/mitm-monitor',
      // 部署前将本地的 supabase.local.json 上传到服务器的 source 目录
      'pre-deploy-local': 'scp mitm-monitor/supabase.local.json root@8.216.36.44:/root/mitm-monitor/source/mitm-monitor/',
      // 进入子目录安装依赖并构建，然后重载 PM2
      'post-deploy': 'cd mitm-monitor && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
