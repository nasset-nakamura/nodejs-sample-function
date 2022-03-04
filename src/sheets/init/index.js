const GoogleAPI = require('./google-api');

(async () => {
  console.log('GoogleAPIインスタンスを生成');
  const googleApi = new GoogleAPI();

  console.log('token.jsonを取得');
  await googleApi.getNewTokenJson();
})();
