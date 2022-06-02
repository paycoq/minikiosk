const excuteStatement = require('../db/db');
const JSONbig = require('json-bigint');

module.exports = {
    search: async (req, res, next) => {
        try {
            result = await excuteStatement(
                'select orders.id, menu_name, menu_price, order_amount, order_total from orders left join menu on orders.menu_id=menu.id')
                res.status(200).send({
                    ok: true,
                    data: JSON.parse(JSONbig.stringify(result))
                })
            } catch (err) { 
                res.status(401).send({
                    ok:false,
                    message: err.message
                });
            }  
  },
  
  post: async (req, res, next) => {
    const params = req.body;
    const paramArray = Object.values(params);
    const values = [null, ...paramArray]; 
    const values1 = [];
  try{
    const idExists = await excuteStatement(
      'SELECT EXISTS ( select id from menu where id = ? ) AS A ', [params.menu_id]);
    const stockCnt = await excuteStatement(
      'select menu_stock from menu where id = ?', [params.menu_id]);
  
    values.push(values[2]); 
    values.push(values[1]); 
  
  if(idExists[0].A > 0 && stockCnt[0].menu_stock !== 0){
    excuteStatement(
        'insert into orders(id, menu_id, order_amount, order_total) values (?,?,?,( select menu_price * ? from menu where id = ?) )', values).catch(err=>{
      res.send(`${err}`)
    }).then(
      (result) => {
  
        values1.push(values[2]);
        values1.push(values[1]);
  
        excuteStatement('update menu set menu_stock = menu_stock - ? where id = ?', values1).catch(err=>{
          res.send(`${err}`)
        }).then(
          (result) => {
            res.status(201).send({
              ok: true,
              data: JSON.parse(JSONbig.stringify(result))
          })
          },
        );
      },
    );
  }
  else if(idExists[0].A === 0){
		res.status(401).send({
			ok:false,
			message: "메뉴가 존재하지 않습니다."
	});
  }
  else if(stockCnt[0].menu_stock === 0){
		res.status(401).send({
			ok:false,
			message: "재고가 부족합니다."
	});
  }
  else{
		res.status(401).send({
			ok:false,
			message: "주문 실패"
	});
  }
  } catch (err) { 
    console.log(err.message);
    res.status(401).send({
        ok:false,
        message: err.message
    });
  }
  }
}