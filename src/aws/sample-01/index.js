const { S3Client, ListBucketsCommand, CreateBucketCommand } = require('@aws-sdk/client-s3');
const dayjs = require('dayjs');

const FUNCTION_NAME = 'aws/sample-01';

const logs = [];
let sequence = 1;

const main = async () => {
  try {
    logs.push({ message: `[${sequence++}] === main Start ===` });

    logs.push({ message: `[${sequence++}] S3へ接続` });
    const s3 = new S3Client({});
    logs.push({
      message: `[${sequence++}] display S3Client`,
      credentials: await s3.config.credentials(),
      endpoint: await s3.config.endpoint(),
    });

    // https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html#s3-example-creating-buckets-list-buckets
    logs.push({ message: `[${sequence++}] バケット一覧を取得` });
    const response = await s3.send(new ListBucketsCommand({}));
    if (response.$metadata.httpStatusCode !== 200) throw new Error('バケット一覧取得失敗');

    logs.push({ message: `[${sequence++}] display Buckets`, Buckets: response.Buckets });
    logs.push({ message: `[${sequence++}] display Buckets(str)`, Buckets: JSON.stringify(response.Buckets, null, 2) });

    const bucketName = 'nodejs-test-' + dayjs().format('YYYYMMDD');
    logs.push({ message: `[${sequence++}] display bucketName`, bucketName });

    // https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html#s3-example-creating-buckets-new-bucket-2
    if (response.Buckets.every((bucket) => bucket.Name !== bucketName)) {
      logs.push({ message: `[${sequence++}] バケットを作成`, bucketName });
      const response = await s3.send(
        new CreateBucketCommand({
          Bucket: bucketName,
        })
      );
      if (response.$metadata.httpStatusCode !== 200) throw new Error('バケット作成失敗');
    }
  } catch (ex) {
    logs.push({ status: -1, message: `[${sequence++}] ${ex.message}`, stackTrace: ex.stack });
  } finally {
    logs.push({ message: `[${sequence++}] === main End ===` });
  }
};

(async () => {
  logs.push({ message: `[${sequence++}] === ${FUNCTION_NAME} Start ===` });
  await main();
  logs.push({ message: `[${sequence++}] === ${FUNCTION_NAME} End ===` });

  // ログ表示
  console.log('=== 実行ログ ===');
  console.log(logs);
})();
