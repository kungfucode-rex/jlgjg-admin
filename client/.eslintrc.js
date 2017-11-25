// http://eslint.org/docs/user-guide/configuring
// 将全局的请求变量设置为Globals，防止使用时eslint报错
var apiConfig = require('./config/apiConfig')()
let globals = {}
for (let v in apiConfig) {
  globals[v] = true
}
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  globals: globals,
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': 0, //process.env.NODE_ENV === 'production' ? 2 : 0,
    'semi' : 0,
    'no-trailing-spaces' : 0
  }
};
