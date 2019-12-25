# Firebase

# 概要
タイムレコーダーのFirebase アプリケーションになります。

# 必要な情報
- Google Account

# 必要なソフトウェア
- Node.js 12.14.0 以上

# セットアップ
1. Firebase プロジェクトの作成
[Firebase コンソール](https://console.firebase.google.com/?hl=ja)
画面からプロジェクトを作成します。

2. Firebase CLIのインストール
下記のコマンドを実行します。

``` sh
npm install -g firebase-tools
```

3. プロジェクトの設定

``` sh
firebase use --add <Firebase プロジェクトID> --alias default
```

.firebasercファイルが作成されます。


# Windowsの場合
firebase.jsonの下記の部分を

``` json
"predeploy": [
    "npm --prefix \"$RESOURCE_DIR\" run build"
}
```

下記のように変更してください。

``` json
"predeploy": [
    "npm --prefix %RESOURCE_DIR% run build"
}
```

# ローカル実行
下記のコマンドでローカル実行可能です。

``` sh
firebase serve
```