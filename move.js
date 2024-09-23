const fs = require("fs");
const path = require("path");

const outPath = "6-x";
const soucePath = "imgs/6";

const ensurePathExist = async (dirPath) => {
  try {
    const stats = fs.statSync(dirPath);
    if (stats.isDirectory()) return;
  } catch (err) {
    if (err.code === "ENOENT") {
      fs.mkdirSync(dirPath);
    }
  }
};

const moveFile = () => {
  const fileList = fs.readdirSync(path.join(__dirname, soucePath));
  console.log(fileList);
  fileList.forEach((fileName) => {
    const match = fileName.match(/\d+/g);
    ensurePathExist(path.join(__dirname, outPath, match[0]));
    const sourceFilePath = path.join(__dirname, soucePath, fileName);
    const destinationPath = path.join(__dirname, outPath, match[0], fileName);
    fs.renameSync(sourceFilePath, destinationPath);
  });
};

const fileCount = () => {
  const res = fs.readdirSync(outPath);
  console.log(outPath, `,has`, res.length, `dir`);
  let count = 0;
  res.forEach((dir) => {
    const p = path.join(outPath, dir);
    const fileList = fs.readdirSync(p);
    console.log(p, `has`, fileList.length, `file`);
    count += fileList.length;
  });
  console.log(`total`, count, "file");
};
const main = async () => {
  moveFile()
};
main();
