const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const mergeCol = async (col) => {
  try {
    const rootPath = path.join(__dirname, "6-x", col);
    const files = fs.readdirSync(rootPath);
    const imgBuffers = [];
    for (let i = 0; i < files.length; i++) {
      imgBuffers.push({
        buffer: await sharp(path.join(rootPath, files[i])).toBuffer(),
        index: Number.parseInt(files[i].match(/\d+/g)[1]) - 15,
      });
    }
    // 创建一个新的图片容器
    const mergedImageCol = sharp({
      create: {
        width: 256,
        height: 8704,
        channels: 4, // RGBA
        background: { r: 255, g: 255, b: 255, alpha: 0 }, // 背景设为透明
      },
    });

    const mergedArr = imgBuffers.map((val) => {
      return {
        input: val.buffer,
        top: 256 * val.index,
        left: 0,
      };
    });
    mergedImageCol.composite(mergedArr);
    const outterPath = path.join(__dirname, `cols`, `${col}.png`);
    mergedImageCol.toFile(outterPath, (err, info) => {
      if (err) throw err;
      console.log("Merged image saved successfully");
    });
  } catch (err) {
    console.error("Error merging images:", err);
  }
};

for (let i = 0; i < 64; i++) {
  mergeCol(String(i));
}
