const { S3Client, ListObjectsCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const dayjs = require('dayjs');

const FUNCTION_NAME = 'aws/sample-04';

const logs = [];
let sequence = 1;

// ReadableStreamからバイトデータを読み込み、utf-8文字列に結合して返す
const streamToString = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
};

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

    // https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html#s3-example-listing-objects
    logs.push({ message: `[${sequence++}] ファイル一覧を取得` });
    const response = await s3.send(new ListObjectsCommand({ Bucket: bucketName }));
    if (response.$metadata.httpStatusCode !== 200) throw new Error('ファイル一覧取得失敗');

    // https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html#s3-example-creating-buckets-get-object
    for (const file of response.Contents) {
      logs.push({ message: `[${sequence++}] ファイルを取得`, key: file.Key });
      const data = await s3.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: file.Key,
        })
      );
      if (data.$metadata.httpStatusCode !== 200) throw new Error('ファイル取得失敗');

      const bodyContents = await streamToString(data.Body);
      logs.push({ message: `[${sequence++}] display bodyContents`, bodyContents });
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
