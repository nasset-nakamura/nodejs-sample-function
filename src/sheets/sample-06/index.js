const { google } = require('googleapis');
const GoogleAPI = require('./google-api');

const FUNCTION_NAME = 'sheets/sample-06';

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
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEETS_ID,
      range: 'シート1!A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          ['=ROW()-1', '商品B', '200', '33'],
          ['=ROW()-1', '商品A', '100', '44'],
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
