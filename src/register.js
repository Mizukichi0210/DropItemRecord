var mysql = require('mysql');
var log = require('./log');
require('date-utils');

var con = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : ''
  });
  
/**
 * モンスターカテゴリ設定
 * @readonly
 * @enum
 */
const MONSTER_NAME = {

  DESERT_FOGAN:1,
  AKUMAN_TEMPLE:2,
  FILA_KU:3,
  FOREST_RONAROS:4,

  properties:{
    1:{ category : "砂漠フォガン"},
    2:{ category : "アクマン寺院"},
    3:{ category : "フィラ・ク"},
    4:{ category : "森健太"},
  }
};

function register(bot , message) {
  
  let monsterCategory = message.match[0];
  let dropItemNum = message.text.split("\n")[1];
  let isExistFlg = false;

  let count = 0;

  // 上手いやり方見つかるまで代用
  for(let i in MONSTER_NAME){
    if(i === "properties"){
      break;
    }
    count++;
  }

  for(let i = 1; i <= count; i ++){

    if(MONSTER_NAME.properties[i].category === monsterCategory){
      isExistFlg = true;
      break;
    }
  }

  if(!isExistFlg){
    bot.reply(message,"存在しないモンスターカテゴリです");
    return;
  }

    let findByMonsterCategoryId = "SELECT * FROM ITEM WHERE MONSTER_CATEGORY_ID = (SELECT id FROM MONSTER_CATEGORY WHERE NAME = ?)";
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
};

module.exports = register;