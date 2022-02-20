"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isImage = exports.Sharp = exports.PrepareTargetDir = exports.GetVideoSize = exports.GetFiles = exports.GetDirectories = void 0;

var _path = require("path");

var _os = require("os");

var _fs = require("fs");

var _sharp = _interopRequireDefault(require("sharp"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GetVideoSize = video => {
  const videoStream = video.streams.find(stream => stream.codec_type == "video");

  if (!videoStream) {
    throw new Error("no video stream");
  }

  return {
    width: videoStream.coded_width,
    height: videoStream.coded_height
  };
};

exports.GetVideoSize = GetVideoSize;

const GetFiles = async (path, filter = [".mp4", ".jpg", "jpeg", "webp"]) => {
  return new Promise(async (res, rej) => {
    filter = filter.map(ext => {
      if (!ext.startsWith(".")) {
        return "." + ext;
      }

      return ext;
    });
    let files = await _fs.promises.readdir(path);
    files = files.filter(file => {
      const ext = (0, _path.extname)(file);
      return filter.indexOf(ext) > -1;
    });

    if (files.length < 1) {
      rej(new Error("no file exists"));
    }

    res(files.map(file => (0, _path.join)(path, file)));
  });
};

exports.GetFiles = GetFiles;
const Sharp = {
  Resize: async (source, width, height, opts = {}) => {
    opts = { ...{
        fit: "cover",
        position: "center"
      },
      ...{
        opts
      }
    };
    const buffer = await source.resize(width, height, opts).toBuffer();
    return (0, _sharp.default)(buffer);
  },
  ToJpeg: async (source, opts = {}) => {
    opts = { ...{
        quality: 70
      },
      ...opts
    };
    const buffer = await source.jpeg(opts).toBuffer();
    return (0, _sharp.default)(buffer);
  }
};
exports.Sharp = Sharp;

const isImage = extname => {
  const supportedImageExts = [".jpg", ".jpeg", ".webp"];
  return supportedImageExts.indexOf(extname) > -1;
};

exports.isImage = isImage;

const GetDirectories = async path => {
  console.log("path", path);
  const dirs = await _fs.promises.readdir(path, {
    withFileTypes: true
  });
  console.log(typeof dirs);
  return dirs.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
};

exports.GetDirectories = GetDirectories;

const PrepareTargetDir = async (path, templateName, sourceName) => {
  const namePattern = templateName + "-" + (0, _path.basename)(sourceName);
  let dirs = await GetDirectories(path);
  dirs = dirs.filter(dir => dir.startsWith(namePattern));
  const name = namePattern + "-" + (0, _utils.ZeroPad)(parseInt(dirs.length + 1), 2);
  const targetDir = (0, _path.join)(path, name);
  await _fs.promises.mkdir(targetDir);
  return targetDir;
};

exports.PrepareTargetDir = PrepareTargetDir;