const fs = require('fs').promises;
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const PATH_CREDENTIALS = process.env.GOOGLE_CREDENTIALS;
const PATH_TOKEN = process.env.GOOGLE_TOKEN;

/**
 * GoogleAPI操作クラス
 */
module.exports = class GoogleAPI {
  async _getCredentialsJson() {
    this.credentials = JSON.parse(await fs.readFile(PATH_CREDENTIALS, 'utf-8'));
  }

  async _getNewToken() {
    // credentials.jsonを読み込み
    await this._getCredentialsJson();
    const { client_secret, client_id, redirect_uris } = this.credentials.installed;

    // OAuthClientを生成
    this.oAuthClient = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // 認証URLを生成
    const authUrl = await this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    // Consoleへ認証URLを表示
    await console.log('Authorize this app by visiting this url:', authUrl);
    const rl = await readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // 確認コードが入力されるまで待機
    await rl.question('Enter the code from that page here: ', async (code) => {
      rl.close();

      // トークンを取得
      await this.oAuth2Client.getToken(code, async (err, token) => {
        if (err) return await console.error('Error while trying to retrieve access token', err);
        await this.oAuth2Client.setCredentials(token);

        // token.jsonを出力
        try {
          await fs.writeFile(PATH_TOKEN, JSON.stringify(token));
          console.log('Token stored to', PATH_TOKEN, 'utf-8');
        } catch (ex) {
          await console.error({ ex });
        }
      });
    });
  }

  async _getTokenJson() {
    this.token = JSON.parse(await fs.readFile(PATH_TOKEN, 'utf-8'));
  }

  async getNewTokenJson() {
    await this._getNewToken();
  }

  async getClient() {
    try {
      // credentials.jsonを読み込み
      await this._getCredentialsJson();
      const { client_secret, client_id, redirect_uris } = this.credentials.installed;

      // token.jsonを読み込み
      await this._getTokenJson();

      // OAuthClientを生成
      this.oAuthClient = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
      await this.oAuthClient.setCredentials(this.token);

      return this.oAuthClient;
    } catch (ex) {
      await console.error({ ex });
    }
  }
};
