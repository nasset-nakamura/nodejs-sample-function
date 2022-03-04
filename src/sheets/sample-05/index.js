const { google } = require('googleapis');
const GoogleAPI = require('./google-api');

const FUNCTION_NAME = 'sheets/sample-05';

const logs = [];
let sequence = 0;

const main = async () => {
  try {
    logs.push({ message: `[${++sequence}] === main Start ===` });

    logs.push({ message: `[${++sequence}] GoogleAPIインスタンスを生成` });
    const googleApi = new GoogleAPI();

    logs.push({ message: `[${++sequence}] GoogleAPIクライアントを取得` });
    const auth = await googleApi.getClient();

    logs.push({ message: `[${++sequence}] Sheetsを生成` });
    const sheets = await google.sheets({ version: 'v4', auth });

    logs.push({ message: `[${++sequence}] データを書き込み(複数)` });
    const response = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: process.env.SPREADSHEETS_ID,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            range: 'シート1!B2:D3',
            values: [
              ['商品B', '200', '5'],
              ['商品A', '100', '10'],
            ],
          },
          {
            range: 'シート1!B8:C8',
            values: [['商品B', '200']],
          },
        ],
      },
    });

    await console.log('=== response ===');
    await console.log({ status: response.status });
    await console.log({ data: response.data });
    await console.log({ data: JSON.stringify(response.data, null, 2) });
  } catch (ex) {
    logs.push({ status: -1, message: `[${++sequence}] ${ex.message}`, stackTrace: ex.stack });
  } finally {
    logs.push({ message: `[${++sequence}] === main End ===` });
  }
};

(async () => {
  logs.push({ message: `[${++sequence}] === ${FUNCTION_NAME} Start ===` });
  await main();
  logs.push({ message: `[${++sequence}] === ${FUNCTION_NAME} End ===` });

  // ログ表示
  console.log('=== 実行ログ ===');
  console.log(logs);
})();
