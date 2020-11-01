const GoogleCloudStorage = require('@google-cloud/storage');
  
const GOOGLE_CLOUD_KEYFILE = process.env.google_cloud_keyfile;

const storage = new GoogleCloudStorage.Storage({keyFilename: GOOGLE_CLOUD_KEYFILE});

const bucketName = process.env.bucket_name;
const bucket = storage.bucket(bucketName);

exports.storage = storage;
exports.bucket = bucket;
exports.getPublicUrl = (fileName) => `https://storage.googleapis.com/${bucketName}/${fileName}`;
