const FileHound = require('filehound');

const extensionsArray = ['.jpg','.png','.gif','svg', '.tiff', '.tif'];
const imagesDir = 'images';

const filehound = FileHound.create();
    filehound
    .paths(imagesDir)
    .directory()
    .find()
    .each(console.log);

