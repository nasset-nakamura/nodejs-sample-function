const sendGrid = require('@sendgrid/mail');

const FUNCTION_NAME = 'sendgrid/sample-01';

const logs = [];
let sequence = 1;

const main = async () => {
  try {
    logs.push({ message: `[${sequence++}] === main Start ===` });

    logs.push({ seq: sequence++, message: 'SendGrid APIキーを設定' });
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

    const mail = {
      to: process.env.SENDGRID_TO,
      from: process.env.SENDGRID_FROM,
      subject: '★テストメール件名★',
      text: 'あいうえお\nかきくけこ\n12345abc',
    };
    logs.push({ seq: sequence++, message: 'display mail', ...mail });

    // https://github.com/sendgrid/sendgrid-nodejs
    // https://github.com/sendgrid/sendgrid-nodejs/tree/main/docs/use-cases
    logs.push({ message: `[${sequence++}] テキストメールを送信` });
    const response = await sendGrid.send(mail);
    if (response[0].statusCode !== 202) throw new Error('メール送信失敗');
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
