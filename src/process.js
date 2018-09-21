var async = require('async');
var mysql = require('mysql');
var log = require('./log');
let registerModule = require('./register');
require('date-utils');

var con = mysql.createConnection({
    host     : '',
    user     : 'root',
    password : '',
    database : 'black_desert_online'
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

function process(bot , message) {

    let monsterCategory = message.match[0];

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

    let msg = message.text.split("\n")[1];

    if(msg != null && isNaN(msg)){
        // 論理削除処理 未実装
    }

    else{
        let register = registerModule(bot,message,con,MONSTER_NAME);
        try{
            async.series(register,(err) =>{
            });
        }catch(err){
            throw err;
        }
    }
};

module.exports = process;
