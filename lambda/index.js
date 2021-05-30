'use strict';
// lib
const sharp = require('sharp');
const aws = require('aws-sdk');

// s3 setting
const config = {
  apiVersion: '2006-03-01',
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretkey,
  region: process.env.region,
};

const s3 = new aws.S3(config);

// image setting
const sizes = [300, 600];
const originalImageKeyPrefix = 'image';
const resizedImageKeyPrefix = 'copy';

////// methods ///////

const getObject = async (params) => {
  try {
    const result = await s3.getObject(params).promise();
    return {
      Body: result.Body,
      Key: params.Key,
      Bucket: params.Bucket,
      ContentType: result.ContentType,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const resize = (params) => {
  const result = [];
  try {
    sizes.forEach((size) => {
      const resized = sharp(params.Body)
        .resize({ width: size, fit: sharp.fit.contain })
        .toFormat(params.ContentType.replace('image/', ''))
        .toBuffer();
      result.push({
        Body: resized,
        Key: params.Key,
        Bucket: params.Bucket,
        ContentType: params.ContentType,
      });
    });
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const putObject = async (params) => {
  try {
    const resolved = await Promise.all(params.map((param) => param.Body));
    const finalParams = params.map((param, idx) => {
      return {
        ...param,
        Body: resolved[idx],
        Key: param.Key.replace('original', idx === 0 ? 'small' : 'medium'),
      };
    });

    return finalParams.map(async (param) => {
      return await s3.putObject(param).promise();
    });
  } catch (err) {
    throw new Error(err);
  }
};

exports.handler = (event, context, callback) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const params = { Bucket: bucket, Key: key };

  getObject(params)
    .then(resize)
    .then(putObject)
    .then(async (result) => {
      const finalResult = await Promise.all(result);
      callback(null, finalResult);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
};
