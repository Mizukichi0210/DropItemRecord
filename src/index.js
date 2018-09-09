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
 * ドロップ数記録 / ドロップ数確認
 */
controller.hears(["(.*)"] , ['direct_message'], (bot,message) =>{

  let register = registerModule(bot,message);
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
