var Botkit = require("botkit");
var async = require('async');
var log = require('./log');
let registerModule = require('./register');

require('date-utils');

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
  let register = registerModule(monsterCategory,dropItemNum,bot,message);
  try{
    async.series(register,(err) =>{

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
  let register = registerModule(monsterCategory,dropItemNum,bot,message);
  try{
    async.series(register,(err) =>{

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
  let register = registerModule(monsterCategory,dropItemNum,bot,message);
  try{
    async.series(register,(err) =>{
    });
  }catch(err){
    log(err);
    bot.reply(message,"処理中にエラーが発生しました");
  }
});

controller.hears(["(.*)"], ['direct_message'], (bot,message) =>{
	bot.reply(message,"*help or ヘルプ*\nを参照してください");
});