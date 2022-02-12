const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dayjs = require('dayjs');

const FUNCTION_NAME = 'aws/sample-03';

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

    const bucketName = 'nodejs-test-' + dayjs().format('YYYYMMDD');
    logs.push({ message: `[${sequence++}] display bucketName`, bucketName });

    const files = [
      {
        Key: 'test/test_01.csv',
        Body: '"col1","col2","col3"\n"aaa","bbb","ccc"\n"ddd","eee","fff"',
      },
      {
        Key: 'test/test_02.json',
        Body: JSON.stringify(logs),
      },
    ];

    // https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html#s3-example-creating-buckets-upload-file
    files.forEach(async (file) => {
      logs.push({ message: `[${sequence++}] ファイルを追加`, bucketName, key: file.Key });
      const response = await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: file.Key,
          Body: file.Body,
        })
      );
      if (response.$metadata.httpStatusCode !== 200) throw new Error('ファイル追加失敗');
    });
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
