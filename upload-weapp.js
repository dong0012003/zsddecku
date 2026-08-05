/**
 * 微信小程序 CI 上传脚本
 * 使用 miniprogram-ci 将 dist 目录上传到微信小程序后台
 */

const ci = require('miniprogram-ci');

const appid = process.env.WEAPP_APPID;
const privateKey = process.env.WEAPP_PRIVATE_KEY;
const robot = process.env.WEAPP_ROBOT || '1';
const version = process.env.WEAPP_VERSION || process.env.GITHUB_RUN_NUMBER
  ? `1.0.0-ci.${process.env.GITHUB_RUN_NUMBER}`
  : '1.0.0-test';
const desc = process.env.WEAPP_DESC || 'GitHub Actions 自动构建上传';

if (!appid) {
  console.error('错误：缺少环境变量 WEAPP_APPID');
  process.exit(1);
}

if (!privateKey) {
  console.error('错误：缺少环境变量 WEAPP_PRIVATE_KEY');
  process.exit(1);
}

(async () => {
  try {
    console.log(`开始上传小程序...`);
    console.log(`AppID: ${appid}`);
    console.log(`版本: ${version}`);
    console.log(`机器人: ${robot}`);

    const project = new ci.Project({
      appid,
      type: 'miniProgram',
      projectPath: './dist',
      privateKey,
      ignores: ['node_modules/**/*'],
    });

    const uploadResult = await ci.upload({
      project,
      version,
      desc,
      robot: parseInt(robot, 10),
      setting: {
        es6: true,
        es7: true,
        minify: true,
        codeProtect: true,
        autoPrefixWXSS: true,
      },
      onProgressUpload: (info) => {
        console.log('上传进度:', info);
      },
    });

    console.log('上传成功:', uploadResult);
  } catch (err) {
    console.error('上传失败:', err.message);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
})();
