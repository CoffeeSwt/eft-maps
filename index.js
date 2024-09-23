const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const sourceUrl = `https://assets.tarkov.dev/maps/shoreline/main_spring`;
const imgsSavePath = path.join(__dirname, "imgs");

let counter = 0;

const ensureLevelPathExist = async (level) => {
  const dirPath = path.join(imgsSavePath, `${level}`);
  try {
    const stats = fs.statSync(dirPath);
    if (stats.isDirectory()) return;
  } catch (err) {
    if (err.code === "ENOENT") {
      fs.mkdirSync(dirPath);
    }
  }
};

const fetchImgs = async (level, x, y) => {
  const url = `${sourceUrl}/${level}/${x}/${y}.png`;
  ensureLevelPathExist(level);
  const localPath = path.join(imgsSavePath, `${level}`, `${x}-${y}.png`);
  const response = await fetch(url);
  if (response.status == "404") {
    const bufferPng = await sharp({
      create: {
        width: 256,
        height: 256,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0.5 },
      },
    })
      .png()
      .toBuffer();
    fs.writeFileSync(localPath, bufferPng);
  } else {
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(localPath, buffer);
  }
  console.log(`${level},${x}-${y}.png saved success.`);
  counter++;
};

const levelPicSizeMap = new Map();
levelPicSizeMap.set(0, [1, 1]);
levelPicSizeMap.set(1, [1, 1]);
levelPicSizeMap.set(2, [1, 1]);
levelPicSizeMap.set(3, [1, 1]);
levelPicSizeMap.set(4, [16, 13]);
levelPicSizeMap.set(5, [1, 1]);
levelPicSizeMap.set(6, [64, 53]);

const fetchCols = async (level, x) => {
  const ySize = levelPicSizeMap.get(level)[1];

  for (let y = 11, len = ySize; y < len; y++) {
    await fetchImgs(level, x, y);
  }
};

const fetchLevel = async (level) => {
  const xSize = levelPicSizeMap.get(level)[0];
  for (let x = 0, len = xSize; x < len; x++) {
    await fetchCols(level, x);
  }
};
const main = async () => {
  await fetchLevel(6);
  console.log(counter);
};

main();
