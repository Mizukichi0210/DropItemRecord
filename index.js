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
    let findByMonsterCategory = "SELECT * FROM MONSTER_CATEGORY WHERE CATEGORY = ?";
    con.query(findByMonsterCategory,[monsterCategory],function(err,result,fields){
      if(err) throw err;
      let monsterCategoryId = result[0].id;
      let findByMonsterCategoryId = "SELECT * FROM ITEM WHERE MONSTER_CATEGORY_ID = ?";
      con.query(findByMonsterCategoryId,[monsterCategoryId],function(err,result,fields){
        if(err) throw err;
        let itemId =  result[0].id;
        let insert = "insert into drop_items (item_id,number,date) values(?,?,?)";
        let now = new Date();
        let date = now.toFormat('YYYY-MM-DD');
        con.query(insert,[itemId,dropItemNum,date],function(err,rows,fields) {
          if(err) throw err;
          bot.reply(message,monsterCategory + "、ドロップアイテム数" + dropItemNum + "個で記録しました");
        });
      });
	  });
  }catch(err){
    console.log(err);
    bot.reply(message,"処理中にエラーが発生しました");
  }
});

controller.hears(["(.*)"], ['direct_message'], (bot,message) =>{
	bot.reply(message,"*help or ヘルプ*\nを参照してください");
});

