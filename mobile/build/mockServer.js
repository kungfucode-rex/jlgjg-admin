/**
 * Created by kungfucode on 17/7/31.
 */
var express = require('express')
var app = express()
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCrossDomain)
app.get('/user/list', function (req, res) {
  res.send([
    {
      username: 'zhangsan',
      cnname: '张三',
      sex: 'male',
      phone: '15339209281',
      address: '山西省西安市雁塔区',
      birth: '1989-03-16',
      id: '610323198903166855',
      idValidStart: '2017-04',
      idValidEnd: '2027-04',
      hobbies: ['eat', 'drink'],
      workOn: '08:30:00',
      workOff: '18:30:00'
    },
    {
      username: 'lisi',
      cnname: '李四',
      sex: 'male',
      phone: '15339209281',
      address: '山西省西安市雁塔区',
      birth: '1989-03-16',
      id: '610323198903166856',
      idValidStart: '2017-04',
      idValidEnd: '2027-04',
      hobbies: ['eat', 'drink'],
      workOn: '08:30:00',
      workOff: '18:30:00'
    }])
})
app.get('/carStatus', function (req, res) {
  res.send([
    {value: 'eat', label: '未上架'},
    {value: 'drink', label: '已上架'},
    {value: 'play', label: '已租出'},
    {value: 'fun', label: '未租出'}
  ])
})
app.get('/carStyles', function (req, res) {
  res.send([
    {value: 'MICRO', label: '微型车'},
    {value: 'MID', label: '中型车'},
    {value: 'BIG', label: '大型车'},
    {value: 'SUV', label: 'SUV'}
  ])
})
app.get('/hobbies', function (req, res) {
  res.send([
    {value: 'eat', label: '吃', disabled: true},
    {value: 'drink', label: '喝'},
    {value: 'play', label: '玩'},
    {value: 'fun', label: '乐'}
  ])
})
app.get('/province', function (req, res) {
  res.send([
    {value: 'shanxi', label: '陕西'},
    {value: 'hainan', label: '海南'}
  ])
})
app.get('/cities', function (req, res) {
  res.send({
    shanxi: [
      {value: 'xian', label: '西安'},
      {value: 'xianyang', label: '咸阳'},
      {value: 'caijiapo', label: '蔡家坡'}
    ],
    hainan: [
      {value: 'haikou', label: '海口'},
      {value: 'sanya', label: '三亚'},
      {value: 'wanning', label: '万宁'}
    ]
  }[req.query.data])
})
app.listen(8081, function () {
  console.log('MockServer listening on port 8081!')
})
