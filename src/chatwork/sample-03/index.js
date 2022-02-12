const axios = require('axios');

const FUNCTION_NAME = 'chatwork/sample-03';

const logs = [];
let sequence = 1;

const main = async () => {
  try {
    logs.push({ message: `[${sequence++}] === main Start ===` });

    // https://developer.chatwork.com/ja/endpoints.html
    logs.push({ message: `[${sequence++}] Axiosインスタンスを生成` });
    const chatworkApiInstance = axios.create({
      baseURL: 'https://api.chatwork.com/v2',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-ChatWorkToken': process.env.CHATWORK_API_KEY,
      },
    });
    logs.push({ message: `[${sequence++}] display baseURL`, baseURL: chatworkApiInstance.defaults.baseURL });

    // https://developer.chatwork.com/ja/endpoint_rooms.html#POST-rooms-room_id-messages
    logs.push({ message: `[${sequence++}] メッセージを追加` });
    const body = 'aaa,bbb,ccc\nddd,eee,fff\nggg,hhh';
    const response = await chatworkApiInstance.post(
      `/rooms/${process.env.CHATWORK_ROOM_ID}/messages`,
      `body=${body}&self_unread=1`
    );
    if (response.status !== 200) throw new Error('メッセージ送信失敗');

    logs.push({ message: `[${sequence++}] display message_id`, messageId: response.data.message_id });
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
