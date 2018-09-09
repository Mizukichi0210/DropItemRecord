# DropItemRecord

## コンセプト
Excelがない。じゃあcsvファイルを作ろう。

## 概要
* 使用SNSツール

__Slack__

* 使用概要
```
該当モンスター群
固有ドロップ数
```

* 使用例
```bash
砂漠フォガン
5000
```

## 環境導入
[Node.js](https://nodejs.org/en/)(Windows)

[Node.js](https://github.com/hokaccha/nodebrew)(Mac Linux)

[PHPMyAdmin](https://www.phpmyadmin.net/)

forever
```cmd
npm install -g forever
forever start index.js
```

## DBテーブル

__レコードは例__

  データベース生成、テーブル生成する際に使用するSQL文はSQLディレクトリ内

* drop_item

|id(pk)  |item_id(varchar5)  |number(varchar10)  |is_delete(char1) |date(date)  |
|---|---|---|---|---|
|1  |1  |3600  |0|2018-07-01  |---|
|2  |5  |10000  |0|2018-07-05  |---|

* item

|id(pk)  |name(varchar20)  |price(int 11)  |monster_category_id(varchar10)  |
|---|---|---|---|
|1  |砂漠フォガンの兜の欠片  |1040  |1  |


* monster_category

|id(pk)  |name(varchar20)  |
|---|---|
|1  |砂漠フォガン  |
|2  |アクマン寺院  |
