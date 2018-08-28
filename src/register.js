var mysql = require('mysql');
var log = require('./log');
require('date-utils');

var con = mysql.createConnection({
    host     : 'localhost',
    user     : '',
    password : '',
    database : 'black_desert_online'
  });
  
function register(monsterCategory , dropItemNum , bot , message) {

    console.log(monsterCategory)
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