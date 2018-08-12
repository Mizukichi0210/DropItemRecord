var Botkit = require("botkit");
var mysql = require('mysql');
var async = require('async');
var log = require('./log');

require('date-utils');

var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'black_desert_online'
});

var controller = Botkit.slackbot({
  debug: false       
  // include "log: false" to disable logging
  // or a "logLevel" integer from 0 to 7 to adjust logging verbosity
})

controller.spawn({
    token : process.env.token
}).startRTM();

/**
 * モンスターカテゴリ設定
 * @readonly
 * @enum
 */
const MONSTER_NAME = {

  DESERT_FOGAN:1,
  AKUMAN_TEMPLE:2,
  FILA_KU : 3,

  properties:{
    1:{ category : "砂漠フォガン"},
    2:{ category : "アクマン寺院"},
    3:{ category : "フィラ・ク"},
  }
};

/**
 * 砂漠フォガンのドロップ数記録 / ドロップ数確認
 */
controller.hears([MONSTER_NAME.properties[MONSTER_NAME.DESERT_FOGAN].category] , ['direct_message'], (bot,message) =>{

  let monsterCategory = MONSTER_NAME.properties[MONSTER_NAME.DESERT_FOGAN].category;
  let dropItemNum = message.text.split("\n")[1];

  try{
    let findByMonsterCategoryId = "SELECT * FROM ITEM WHERE MONSTER_CATEGORY_ID = (SELECT id FROM MONSTER_CATEGORY WHERE CATEGORY = ?)";
    con.query(findByMonsterCategoryId ,[monsterCategory],function(err,result,fields){
      if(err) throw err;
      let itemId = result[0].id;

      if(dropItemNum === undefined || dropItemNum === null){
        //TODO 月毎実装
        let findById = "SELECT SUM(NUMBER) as sum FROM DROP_ITEM WHERE ITEM_ID = ? AND IS_DELETE = '0'";
        con.query(findById,[itemId],function(err,result,fields){
          if(err) throw err;
          let sum = result[0].sum;
          if(sum === undefined || sum === null){
            bot.reply(message, monsterCategory + "のドロップ数は0です");
          }
          else{
            let findByItemByItemId = "SELECT * FROM DROP_ITEM WHERE IS_DELETE = '0' AND ITEM_ID = ?";
            con.query(findByItemByItemId,[itemId],function(err,result,fields){
              if(err) throw err;
              let itemName = result[0].name;
              let itemPrice = result[0].price;
              let itemNum = itemPrice * sum;
              itemNum = itemNum.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,');
              sum = sum.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,');
              bot.reply(message, itemName + "のドロップ数は" + sum + "、総価格は" + itemNum + "シルバーです");
            });
          }
        });

      }else{

        let insert = "INSERT INTO drop_item (item_id,number,is_delete,date) VALUES(?,?,?,?)";
        let now = new Date();
        let date = now.toFormat('YYYY-MM-DD');
        con.query(insert,[itemId,dropItemNum,0,date],function(err,rows,fields) {
          if(err) throw err;
          bot.reply(message,monsterCategory + "、ドロップアイテム数" + dropItemNum + "個で記録しました");
        });
      }
    });
}catch(err){
    log(err);
    bot.reply(message,"処理中にエラーが発生しました");
  }
});

/**
 * アクマン寺院のドロップ数記録 / ドロップ数確認
 */
controller.hears([MONSTER_NAME.properties[MONSTER_NAME.AKUMAN_TEMPLE].category] , ['direct_message'], (bot,message) =>{

  let monsterCategory = MONSTER_NAME.properties[MONSTER_NAME.AKUMAN_TEMPLE].category;
  let dropItemNum = message.text.split("\n")[1];

  try{
    let findByMonsterCategoryId = "SELECT * FROM ITEM WHERE MONSTER_CATEGORY_ID = (SELECT id FROM MONSTER_CATEGORY WHERE CATEGORY = ?)";
    con.query(findByMonsterCategoryId,[monsterCategory],function(err,result,fields){
      if(err) throw err;
      let itemId = result[0].id;

      if(dropItemNum === undefined || dropItemNum === null){
        //TODO 月毎実装
        let findById = "SELECT SUM(NUMBER) as sum FROM DROP_ITEM WHERE ITEM_ID = ? AND IS_DELETE = '0'";
        con.query(findById,[itemId],function(err,result,fields){
          if(err) throw err;
          let sum = result[0].sum;
          if(sum === undefined || sum === null){
            bot.reply(message, monsterCategory + "のドロップ数は0です");
          }
          else{
            let findByItemByItemId = "SELECT * FROM DROP_ITEM WHERE IS_DELETE = '0' AND ITEM_ID = ?";
            con.query(findByItemByItemId,[itemId],function(err,result,fields){
              if(err) throw err;
              let itemName = result[0].name;
              let itemPrice = result[0].price;
              let itemNum = itemPrice * sum;
              itemNum = itemNum.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,');
              sum = sum.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,');
              bot.reply(message, itemName + "のドロップ数は" + sum + "、総価格は" + itemNum + "シルバーです");
            });
           
          }
        });

      }else{

        let insert = "INSERT INTO drop_item (item_id,number,is_delete,date) VALUES(?,?,?,?)";
        let now = new Date();
        let date = now.toFormat('YYYY-MM-DD');
        con.query(insert,[itemId,dropItemNum,0,date],function(err,rows,fields) {
          if(err) throw err;
          bot.reply(message,monsterCategory + "、ドロップアイテム数" + dropItemNum + "個で記録しました");
        });
      }
    });
  }catch(err){
    log(err);
    bot.reply(message,"処理中にエラーが発生しました");
  }
});

/**
 * フィラ・クのドロップ数記録 / ドロップ数確認
 */
controller.hears([MONSTER_NAME.properties[MONSTER_NAME.FILA_KU].category] , ['direct_message'], (bot,message) =>{

  let monsterCategory = MONSTER_NAME.properties[MONSTER_NAME.FILA_KU].category;
  let dropItemNum = message.text.split("\n")[1];

  try{
    let findByMonsterCategoryId = "SELECT * FROM ITEM WHERE MONSTER_CATEGORY_ID = (SELECT id FROM MONSTER_CATEGORY WHERE CATEGORY = ?)";
    con.query(findByMonsterCategoryId,[monsterCategory],function(err,result,fields){
      if(err) throw err;
      let itemId = result[0].id;

      if(dropItemNum === undefined || dropItemNum === null){
        //TODO 月毎実装
        let findById = "SELECT SUM(NUMBER) as sum FROM DROP_ITEM WHERE ITEM_ID = ? AND IS_DELETE = '0'";
        con.query(findById,[itemId],function(err,result,fields){
          if(err) throw err;
          let sum = result[0].sum;
          if(sum === undefined || sum === null){
            bot.reply(message, monsterCategory + "のドロップ数は0です");
          }
          else{
            let findByItemByItemId = "SELECT * FROM ITEM WHERE ID = ?";
            con.query(findByItemByItemId,[itemId],function(err,result,fields){
              if(err) throw err;
              let itemName = result[0].name;
              let itemPrice = result[0].price;
              let itemNum = itemPrice * sum;
              itemNum = itemNum.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,');
              sum = sum.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,');
              bot.reply(message, itemName + "のドロップ数は" + sum + "、総価格は" + itemNum + "シルバーです");
            });
           
          }
        });

      }else{

        let insert = "INSERT INTO drop_item (item_id,number,is_delete,date) VALUES(?,?,?,?)";
        let now = new Date();
        let date = now.toFormat('YYYY-MM-DD');
        con.query(insert,[itemId,dropItemNum,0,date],function(err,rows,fields) {
          if(err) throw err;
          bot.reply(message,monsterCategory + "、ドロップアイテム数" + dropItemNum + "個で記録しました");
        });
      }
    });
  }catch(err){
    log(err);
    bot.reply(message,"処理中にエラーが発生しました");
  }
});

controller.hears(["(.*)"], ['direct_message'], (bot,message) =>{
	bot.reply(message,"*help or ヘルプ*\nを参照してください");
});