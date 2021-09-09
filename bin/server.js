const app = require('../app');
const db = require('../model/db');
const PORT = process.env.PORT || 3000;

require('dotenv').config();
const UPLOAD = process.env.UPLOAD;
const PUBLIC_FOLDER = process.env.PUBLIC_FOLDER;

const createFolderIsNotExist = require('../helpers/create-folder.js');
db.then(() => {
  return app.listen(PORT, async () => {
    await createFolderIsNotExist(UPLOAD);
    await createFolderIsNotExist(PUBLIC_FOLDER);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch(e => console.log(e.message));
