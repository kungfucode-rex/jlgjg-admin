// 新增供应商
axios.post('http://localhost:8080/provider/add', {
    no:'G0001',
    name: '供应商一',
    code: '12344',
    shuiwu: '',
    person: '',
    phone: '',
    mobile: '',
    address: '',
    email: '',
    url: '',
    postcode: '',
    fax: '',
    comment: '',
    creater: '',
    createtime: moment()._d.getTime()
})

axios.post('http://localhost:8080/provider/delete', {
  id: 'id'
})

axios.post('http://localhost:8080/provider/edit', {
  id: '0015128030654440cfb3fa734994be08f233ce0324e5a23000',
  no: 'G0002'
})

axios.get('http://localhost:8080/provider/list', {
  name: '',
  no: '',
  pageOffset: 1,
  pageLimit: 10
})

axios.get('http://localhost:8080/provider/byId', {
  id: ''
})