const {bucket} = require('./storage');

module.exports = async (fileUrl) =>{
    const fileName = fileUrl.split('/').pop();
    const file = bucket.file(fileName);
    await file.delete(fileUrl);
}