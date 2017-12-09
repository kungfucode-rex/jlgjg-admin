// 新增供应商
axios.post('http://localhost:8080/goods/add', {
    no:'H0001',
    name: '供应商一',
    guige: '34*23',
    unit: '个',
    conversion: '',
    quantity: 300,
    aprice: 12.34
})

axios.post('http://localhost:8080/goods/delete', {
  id: '001512808869188a79c4ed509b74da9ae0e7c788f08341d000'
})

axios.post('http://localhost:8080/goods/edit', {
  id: '00151280880866782585dd3ce6e4128a59c3b3fd19527cb000',
  name: '商品1'
})

axios.get('http://localhost:8080/goods/list', {
	params: {
      name: '',
      no: '',
      pageOffset: 0,
      pageLimit: 10
    }
})

axios.get('http://localhost:8080/goods/byId', {
  params: {
      id: ''
  }
})