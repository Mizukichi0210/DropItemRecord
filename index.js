var Botkit = require("botkit");
var mysql = require('mysql');
var async = require('async');
require('date-utils');

var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'test',
  password : 'test',
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

  properties:{
    1:{ category : "砂漠フォガン"},
    2:{ category : "アクマン寺院"},
  }
};

controller.hears([MONSTER_NAME.properties[MONSTER_NAME.DESERT_FOGAN].category] , ['direct_message'], (bot,message) =>{

  let monsterCategory = MONSTER_NAME.properties[MONSTER_NAME.DESERT_FOGAN].category;
  let dropItemNum = message.text.split("\n")[1];

  try{
    let findByMonsterCategoryId = "SELECT * FROM ITEM WHERE MONSTER_CATEGORY_ID = (SELECT id FROM MONSTER_CATEGORY WHERE CATEGORY = ?)";
    con.query(findByMonsterCategoryId,[monsterCategory],function(err,result,fields){
      if(err) throw err;
      let itemId = result[0].id;

      if(dropItemNum === undefined || dropItemNum === null){
        //TODO 月毎実装
        let findById = "SELECT SUM(NUMBER) as sum FROM DROP_ITEMS WHERE ITEM_ID = ?";
        con.query(findById,[itemId],function(err,result,fields){
          if(err) throw err;
          let sum = result[0].sum;
          if(sum === undefined || sum === null){
            bot.reply(message, monsterCategory + "のドロップ数は0です");
          }
          else{
            bot.reply(message, monsterCategory + "のドロップ数は" + sum + "です");
          }
        });

      }else{

        let insert = "insert into drop_items (item_id,number,date) values(?,?,?)";
        let now = new Date();
        let date = now.toFormat('YYYY-MM-DD');
        con.query(insert,[itemId,dropItemNum,date],function(err,rows,fields) {
          if(err) throw err;
          bot.reply(message,monsterCategory + "、ドロップアイテム数" + dropItemNum + "個で記録しました");
        });
      }
    });
  }catch(err){
    bot.reply(message,"処理中にエラーが発生しました");
  }
});
controller.hears(["(.*)"], ['direct_message'], (bot,message) =>{
	bot.reply(message,"*help or ヘルプ*\nを参照してください");
});
