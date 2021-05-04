/*
  0：游客
  1：Vip
  2：管理员
*/
// 隐藏路由
const main = ['main', 'mainF']

// const person = ['person', 'personF']

const typhoon = [
  'TyphoonF', 'typhoon',
  'surgesF', 'surges',
  'rainF', 'rain',
  'windF', 'wind',
  'seawaterF', 'seawater',
  'satelliteF', 'satellite'
]

// 经过测试，Array.toString()并不会输出//背后的内容

// 抽离直接使用
const role0 = [
  // main,
  // ['optimizeCenter', 'example1', 'example2'], // 普通用户的样例
  // person
]

const role1 = [
  main,
  typhoon
  // ['powerManage', 'role', 'user'], // 权限中心
  // person
]

const role2 = [
  main,
  typhoon
  // ['powerManage', 'api', 'auth', 'role', 'user'], // 权限中心
  // person
]

export const allRole = {role0, role1, role2}
