import crypto = require('crypto');

const sha256 = (data: string) => crypto.createHash('sha256').update(data).digest('hex');
const md5 = (data: string) => crypto.createHash('md5').update(data).digest('hex');

export {sha256, md5}
