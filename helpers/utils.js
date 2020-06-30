const util = require('util');
const fs = require('fs');
const unlinkFile = util.promisify(fs.unlink);

module.exports.unlinkFile = unlinkFile;