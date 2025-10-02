/*
 * 제조 실적 입력 > 포장/출하 > 내포장 실적
 */
const { ValueType } = require('realgrid');
const { rgDisplayDateTime1 } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: false },
    copy: { enabled: true, singleMode: true },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: 'NONE',
      hscrollBar: true,
      showEmptyMessage: true,
    },
    edit: { editable: false },
    footers: { visible: true },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colBarWidth: 1, colCount: 2 },
  },

  fields: [
    { fieldName: '작업구분', dataType: ValueType.TEXT },
    { fieldName: '구분', dataType: ValueType.TEXT },
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: 'originNo', dataType: ValueType.TEXT },
    { fieldName: 'packNo', dataType: ValueType.TEXT },
    { fieldName: 'cell수량', dataType: ValueType.NUMBER },
    { fieldName: '작업일자', dataType: ValueType.TEXT },
    { fieldName: '작업자', dataType: ValueType.TEXT },
    { fieldName: '설비', dataType: ValueType.TEXT },
    { fieldName: 'shift', dataType: ValueType.TEXT },
    { fieldName: 'svi', dataType: ValueType.TEXT },
    { fieldName: 'agb', dataType: ValueType.TEXT },
    { fieldName: 'pfl', dataType: ValueType.TEXT },
    { fieldName: '처리시각', dataType: ValueType.TEXT },
    { fieldName: '발행자', dataType: ValueType.TEXT },
    { fieldName: '발행자서명', dataType: ValueType.BOOLEAN },
    { fieldName: '승인자', dataType: ValueType.TEXT },
    { fieldName: '승인자서명', dataType: ValueType.BOOLEAN },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
    { fieldName: 'pack상태', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: '작업구분', fieldName: '작업구분', width: '80', header: { text: '작업구분' }, autoFilter: true, styleName: 'tl' },
    { name: '구분', fieldName: '구분', width: '80', header: { text: '구분' }, autoFilter: true, styleName: 'tl' },
    {
      name: 'runNo',
      fieldName: 'runNo',
      width: '150',
      header: { text: 'RUN NO' },
      autoFilter: true,
      mergeRule: {
        criteria: 'value',
      },
      styleName: 'tl',
      footer:{
        text: "PACK 개수===>"
			}, 
			
    },
    { 
      name: 'originNo', fieldName: 'originNo', width: '150', header: { text: 'ORIGIN NO' }, autoFilter: true, styleName: 'tl',
      footer:{
        "text": "0",
        valueCallback: function (grid, column, childIndex, summary, value) {
          let dataProvider = grid.getDataSource();
          let values = dataProvider.getDistinctValues("packNo").filter((elem)=>elem!='');
          return values.length;
        }
			}, 
    },
    { 
      name: 'packNo', fieldName: 'packNo', width: '220', header: { text: 'PACK NO' }, autoFilter: true, styleName: 'tl' ,
      footer: {
        text: "CELL 수량===>",
      },
    },
    { 
      name: 'cell수량', fieldName: 'cell수량', width: '80', header: { text: '수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr ',
      footer: {
        text: "0",
        expression: "sum",
        numberFormat: "#,##0",
      },
    },
    { name: '작업일자', fieldName: '작업일자', width: '150', header: { text: '작업일자' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    { name: '작업자', fieldName: '작업자', width: '80', header: { text: '작업자' }, autoFilter: true, styleName: 'tl' },
    { name: '설비', fieldName: '설비', width: '80', header: { text: 'LINE' }, autoFilter: true, styleName: 'tl' },
    { name: 'shift', fieldName: 'shift', width: '80', header: { text: 'Shift' }, autoFilter: true, styleName: 'tl' },
    { name: 'svi', fieldName: 'svi', width: '80', header: { text: 'SVI' }, autoFilter: true, styleName: 'tl' },
    { name: 'agb', fieldName: 'agb', width: '80', header: { text: 'AGB' }, autoFilter: true, styleName: 'tl' },
    { name: 'pfl', fieldName: 'pfl', width: '80', header: { text: 'PFL' }, autoFilter: true, styleName: 'tl' },
    { name: '처리시각', fieldName: '처리시각', width: '150', header: { text: '처리시각' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    { name: '발행자', fieldName: '발행자', width: '80', header: { text: '담당자' }, autoFilter: true, styleName: 'tl' },
    {
      name: '발행자서명',
      fieldName: '발행자서명',
      width: '60',
      header: { text: '승인' },
      autoFilter: true,
      renderer: {
        type: 'check',
      },
      styleName: 'tc',
    },
    { name: '승인자', fieldName: '승인자', width: '80', header: { text: '담당자' }, autoFilter: true, styleName: 'tl' },
    {
      name: '승인자서명',
      fieldName: '승인자서명',
      width: '60',
      header: { text: '서명' },
      autoFilter: true,
      renderer: {
        type: 'check',
      },
      styleName: 'tc',
    },
    { name: '특이사항', fieldName: '특이사항', width: '200', header: { text: '특이사항' }, autoFilter: true, styleName: 'tl' },
    { name: 'pack상태', fieldName: 'pack상태', width: '80', header: { text: 'PACK상태' }, autoFilter: true, styleName: 'tl' },
  ],

  layout: [
    '작업구분',
    '구분',
    {
      name: '제품현황',
      direction: 'horizontal',
      items: ['runNo', 'originNo', 'packNo', 'cell수량'],
      header: { text: '제품현황' },
    },
    {
      name: '이물제거작업현황',
      direction: 'horizontal',
      items: ['작업일자', '설비', 'shift', '작업자'],
      header: { text: '이물제거작업현황' },
    },
    'svi',
    'agb',
    'pfl',
    {
      name: '라벨수정',
      direction: 'horizontal',
      items: ['처리시각', '발행자', '발행자서명'],
      header: { text: '라벨수정' },
    },
    {
      name: '승인',
      direction: 'horizontal',
      items: ['승인자', '승인자서명'],
      header: { text: '승인' },
    },
    '특이사항',
    'pack상태',
  ],
};

module.exports = grid;
