/**
 * Created by kungfucode on 17/7/14.
 */
module.exports = {
  SysCode: {
    __globalConfig: {
      actionType:'get',
      responseConfig: {
        data: 'data',
        value: 'value',
        label: 'label'
      }
    },
    ShuiwuType: [
      {value: '1', label: '一般纳税人'},
      {value: '2', label: '小规模纳税人'}
    ],
    UnitType: [
      {value: 'g', label: '克'},
      {value: 'kg', label: '千克'},
      {value: 'ton', label: '吨'},
      {value: 'm', label: '米'}
    ]
  }
};
