
function register(bot , message, con, MONSTER_NAME) {
  
  let monster_category = message.match[0];
  let drop_item_num = message.text.split("\n")[1];
  let is_exist_flag = false;

  let count = 0;

  let find_by_monster_category_id = "SELECT * FROM ITEM WHERE MONSTER_CATEGORY_ID = (SELECT id FROM MONSTER_CATEGORY WHERE NAME = ?)";
    con.query(find_by_monster_category_id ,[monster_category],function(err,result,fields){
      if(err) throw err;
      let item_id = result[0].id;

      if(drop_item_num === undefined || drop_item_num === null){
        //TODO 月毎実装
        let find_by_id = "SELECT SUM(NUMBER) as sum FROM DROP_ITEM WHERE ITEM_ID = ? AND IS_DELETE = '0'";
        con.query(find_by_id,[item_id],function(err,result,fields){
          if(err) throw err;
          let sum = result[0].sum;
          if(sum === undefined || sum === null){
            bot.reply(message, monster_category + "のドロップ数は0です");
          }
          else{
            let find_by_item_id = "SELECT * FROM ITEM WHERE ID = ?";
            con.query(find_by_item_id,[item_id],function(err,result,fields){
              if(err) throw err;
              let item_name = result[0].name;
              let item_price = result[0].price;
              let item_num = item_price * sum;
              item_num = item_num.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,');
              sum = sum.toString().replace(/(\d)(?=(\d{3})+$)/g , '$1,');
              bot.reply(message, item_name + "のドロップ数は" + sum + "、総価格は" + item_num + "シルバーです");
            });
          }
        });

      }else{

        let insert = "INSERT INTO drop_item (item_id,number,is_delete,date) VALUES(?,?,?,?)";
        let now = new Date();
        let date = now.toFormat('YYYY-MM-DD');
        con.query(insert,[item_id,drop_item_num,0,date],function(err,rows,fields) {
          if(err) throw err;
          bot.reply(message,monster_category + "、ドロップアイテム数" + drop_item_num + "個で記録しました");
        });
      }
    });
};

module.exports = register;