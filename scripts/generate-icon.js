const path = require("node:path");
const sharp = require("sharp");

// 源图标路径
const sourceIconPath = path.resolve(__dirname, "../assets/icon.png");
// 输出图标路径
const outputIconPath = path.resolve(__dirname, "../assets/icon-with-padding.png");

async function generatePaddedIcon() {
  try {
    // 获取原始图像的信息
    const metadata = await sharp(sourceIconPath).metadata();
    const { width, height } = metadata;

    // 计算留白的大小（20%的留白）
    const padding = Math.floor(width * 0.2);

    // 计算内部图像的新尺寸
    const innerWidth = width - (padding * 2);
    const innerHeight = height - (padding * 2);

    // 创建一个带有白色背景的新图像
    await sharp(sourceIconPath)
      .resize(innerWidth, innerHeight)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toFile(outputIconPath);

    console.log(`成功生成带有留白的图标: ${outputIconPath}`);
  } catch (error) {
    console.error("生成图标时出错:", error);
  }
}

generatePaddedIcon();
