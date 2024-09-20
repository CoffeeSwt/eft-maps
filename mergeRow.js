const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const mergeRow = async () => {
  try {
    const rootPath = path.join(__dirname, "cols");
    const files = fs.readdirSync(rootPath);
    const imgBuffers = [];
    for (let i = 0; i < files.length; i++) {
      imgBuffers.push({
        buffer: await sharp(path.join(rootPath, files[i])).toBuffer(),
        index: Number.parseInt(files[i].match(/\d+/g)[0]),
      });
    }
    console.log(imgBuffers);
    // 创建一个新的图片容器
    const mergedImageCol = sharp({
      create: {
        width: 16384,
        height: 8704,
        channels: 4, // RGBA
        background: { r: 255, g: 255, b: 255, alpha: 0 }, // 背景设为透明
      },
    });

    const mergedArr = imgBuffers.map((val) => {
      return {
        input: val.buffer,
        top: 0,
        left: 256 * val.index,
      };
    });
    mergedImageCol.composite(mergedArr);
    const outterPath = path.join(__dirname, `res.png`);
    mergedImageCol.toFile(outterPath, (err, info) => {
      if (err) throw err;
      console.log("Merged image saved successfully");
    });
  } catch (err) {
    console.error("Error merging images:", err);
  }
};
mergeRow();
