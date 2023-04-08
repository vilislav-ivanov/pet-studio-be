import AWS from 'aws-sdk';
import config from 'config';
import logger from '../logger';

const BUCKET_NAME = config.get<string>('bucket_name');
AWS.config.update({
  // accessKeyId: config.get<string>('aws_access_key'),
  // secretAccessKey: config.get<string>('aws_secret_access_key'),
  region: 'eu-north-1',
  credentials: {
    accessKeyId: config.get<string>('aws_access_key'),
    secretAccessKey: config.get<string>('aws_secret_access_key'),
  },
});

const s3 = new AWS.S3();

export const generateUrl = async (filename: string, bucketPath: string) => {
  let signedUrl;
  const publicUrl = getPublicUrl(filename, bucketPath);
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${bucketPath}/${filename}`,
    Expires: 100,
  };

  try {
    signedUrl = s3.getSignedUrl('putObject', params);
  } catch (err: any) {
    console.error(`Error generating pre-signed url: ${err.message}`);
    throw new Error('Error generating pre-singed url');
  }

  return { signedUrl, publicUrl };
};

const getPublicUrl = (filename: string, bucketPath: string) => {
  const publicUrl = `https://s3.amazonaws.com/${BUCKET_NAME}/${bucketPath}/${filename}`;

  return publicUrl;
};

export async function deleteFile(filename: string) {
  s3.deleteObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
  return new Promise((resolve, reject) => {
    s3.deleteObject(
      { Bucket: BUCKET_NAME, Key: filename },
      (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        logger.info(data);
        resolve(data);
      }
    );
  });
}
