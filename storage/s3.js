const AWS = require('aws-sdk');

const id_s3 = process.env.ID_S3;
const key_s3 = process.env.KEY_S3;
const secret_s3 = process.env.SECRET_S3;
const endpoint = 'https://' + id_s3 + '.r2.cloudflarestorage.com';
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
  endpoint: endpoint,
  accessKeyId: key_s3,
  secretAccessKey: secret_s3,
  signatureVersion: 'v4',
  region: 'auto',
});

async function uploadFile(file, path) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: path,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  return await s3.upload(params).promise();
}

async function deleteFile(path) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: path,
  };
  return await s3.deleteObject(params).promise();
}

module.exports = { uploadFile, deleteFile };
