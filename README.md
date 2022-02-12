# Node.js Sample Function

## Version

- Node.js 14.18.3

## How to Use

### Node.js をインストール

下記ページから Node.js 14.18.3 をインストール

[Index of /download/release/v14.18.3](https://nodejs.org/download/release/v14.18.3/)

Windows：node-v14.18.3-x64.msi

MacOS：node-v14.18.3.pkg

```bash
# インストールされたことを確認
$ node --version
v14.18.3
```

### AWS CLI をインストール

[Windows での AWS CLI バージョン 2 のインストール、更新、アンインストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2-windows.html)

[macOS での AWS CLI バージョン 2 のインストール、更新、アンインストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2-mac.html)

```bash
# インストールされたことを確認
$ aws --version
aws-cli/2.4.13 Python/3.8.8 Darwin/21.1.0 exe/x86_64 prompt/off
```

### AWS CLI 初期設定

- 事前に AWS マネジメントコンソールで `ACCESS_KEY` と `SECRET_ACCESS_KEY` を作成する。
- AWS CLI を初期設定

```bash
# 対話形式で設定
$ aws configure

AWS Access Key ID [None]: xxxxxxxxxxxxxxxxxxxx
AWS Secret Access Key [None]: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Default region name [ap-northeast-1]:
Default output format [json]:

# ユーザー情報が取得できることを確認
$ aws sts get-caller-identity
```

### 開発環境準備

1. nodejs-sample-function リポジトリをクローン

```bash
$ git clone git@github.com:nasset-nakamura/nodejs-sample-function.git && cd nodejs-sample-function
```

2. パッケージをインストール

```bash
$ npm install
```

3. 環境変数を準備

- `.env.sample` をコピーして `.env` を作成

4. 実行

```bash
$ npm run test -src='xxxxxxxxxx'
$ node -r dotenv/config src/xxxxxxxxxx/index.js
```

### サンプル機能一覧

| ディレクトリ           | 内容                                       |
| ---------------------- | ------------------------------------------ |
| src/aws/sample-01      | AWS S3 バケット一覧を取得、バケットを作成  |
| src/aws/sample-02      | AWS S3 バケットを削除                      |
| src/aws/sample-03      | AWS S3 ファイルを追加                      |
| src/aws/sample-04      | AWS S3 ファイル一覧を取得、ファイルを開く  |
| src/aws/sample-05      | AWS S3 ファイルを削除                      |
| src/chatwork/sample-01 | ChatworkAPI で自分自身の情報を取得         |
| src/chatwork/sample-02 | ChatworkAPI でコンタクのユーザー一覧を取得 |
| src/chatwork/sample-03 | ChatworkAPI でメッセージを追加             |
| src/sendgrid/sample-01 | SendGrid SDK でテキストメール送信          |
| src/sendgrid/sample-02 | SendGrid SDK で HTML メール送信            |
