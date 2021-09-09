const Jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');

require('dotenv').config();
const PUBLIC_FOLDER = process.env.PUBLIC_FOLDER;
const createFolderIsNotExist = require('../helpers/create-folder');

class UploadAvatarService {
  constructor(avatarFolder) {
    this.avatarFolder = avatarFolder;
  }

  async editAvatar(pathToFile) {
    const image = await Jimp.read(pathToFile);
    await image
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE,
      )
      .writeAsync(pathToFile);
  }

  async saveAvatar({ file }) {
    await this.editAvatar(file.path);
    const avatarPublicFolder = path.join(PUBLIC_FOLDER, this.avatarFolder);
    await createFolderIsNotExist(avatarPublicFolder);
    await fs.rename(file.path, path.join(avatarPublicFolder, file.filename));
    return path.join(this.avatarFolder, file.filename);
  }
}

module.exports = UploadAvatarService;
