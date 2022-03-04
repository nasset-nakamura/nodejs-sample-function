const { google } = require('googleapis');
const GoogleAPI = require('./google-api');

const FUNCTION_NAME = 'sheets/sample-07';

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

    logs.push({ message: `[${++sequence}] 末尾へ行追加` });
    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.SPREADSHEETS_ID,
      resource: {
        requests: [
          {
            updateSpreadsheetProperties: {
              properties: {
                title: '【中村テスト】変更後のタイトル',
                // 【中村テスト】Lambdaからスプレッドシート操作検証
              },
              fields: 'title',
            },
          },
          {
            repeatCell: {
              fields: 'userEnteredFormat(backgroundColor)',
              range: {
                sheetId: '0',
                startRowIndex: 0,
                endRowIndex: 2,
                startColumnIndex: 0,
                endColumnIndex: 2,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 234 / 255,
                    green: 143 / 255,
                    blue: 143 / 255,
                  },
                },
              },
            },
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
