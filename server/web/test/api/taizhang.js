// 新增供应商
axios.post('http://localhost:8080/taizhang/add', {
    no: '',
    time: moment()._d.getTime(),
    deal_no: '',
    goods_no: '',
    goods_name: '',
    goods_guige: '',
    buy_quantity: 2.36,
    buy_price: 362.3,
    buy_money: 25636,
    sale_quantity: 25,
    sale_price: 2.36,
    sale_money: 23.25,
    store_quantity: 65,
    store_money: 26253.3,
    store_aprice: 12.3,
    comment: ''
})

axios.post('http://localhost:8080/taizhang/delete', {
  id: 'id'
})

axios.post('http://localhost:8080/taizhang/edit', {
  id: '001512809658141a99588e47f3d4ca0bbb6c5cf4a3a0e66000',
  no: 'T0002'
})

axios.get('http://localhost:8080/taizhang/list', {
	params: {
      no: '',
      pageOffset: 0,
      pageLimit: 10
    }
})

axios.get('http://localhost:8080/taizhang/byId', {
  params: {
      id: ''
  }
})