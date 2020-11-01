const {bucket, getPublicUrl} = require('./storage');

module.exports = (file) => new Promise((resolve, reject) =>{

    const gcsFileName = `${Date.now()}-${file.originalname.replace(/ /g, '_')}`;
    const cloudFile = bucket.file(gcsFileName);
  
    const stream = cloudFile.createWriteStream({
      metadata: {contentType: file.mimetype},
      resumable: false
    });
    
    stream.on('finish', () => {
        cloudFile.makePublic().then(() => resolve(getPublicUrl(gcsFileName)));
    });

    stream.on('error', (err) => reject(err));

    stream.end(file.buffer);
});