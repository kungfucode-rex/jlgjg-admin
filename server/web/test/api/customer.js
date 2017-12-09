// 新增供应商
axios.post('http://localhost:8080/customer/add', {
    no:'G0001',
    name: '供应商一',
    code: '12344',
    shuiwu: '',
    person: '',
    phone: '',
    mobile: '',
    address: '',
    email: '',
    bank: '',
    bank_no: '',
    postcode: '',
    fax: '',
    comment: '',
    creater: '',
    createtime: moment()._d.getTime()
})

axios.post('http://localhost:8080/customer/delete', {
  id: 'id'
})

axios.post('http://localhost:8080/customer/edit', {
  id: '0015128030654440cfb3fa734994be08f233ce0324e5a23000',
  no: 'G0002'
})

axios.get('http://localhost:8080/customer/list', {
	params: {
      name: '',
      no: '',
      pageOffset: 0,
      pageLimit: 10
    }
})

axios.get('http://localhost:8080/customer/byId', {
  params: {
      id: ''
  }
})