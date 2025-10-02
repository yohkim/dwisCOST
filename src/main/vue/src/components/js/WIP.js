/*
 * 작업현황 > 재공/재고현황
 */
const { ValueType,SummaryMode } = require('realgrid');

const grid = {
  dataProvider: null,
	gridView: null,
  options: {
    checkBar: { visible: false },
    copy: { enabled: true, singleMode: false },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      // fitStyle: GridFitStyle.NONE,
      hscrollBar: true,
      showEmptyMessage: true,
      summaryMode: SummaryMode.AGGREGATE,
    },
    fixed: {colCount:4},
    edit: { editable: false },
    footers: { 
      visible: true, 
      items:[
        {
          height: 28
        }, 
        {
          height: 28
        },
        {
          height: 28
        },
        {
          height: 28
        }, 
      ]
    },
    header: { height: 25 },
    paste: { enabled: false },
    rowIndicator: { visible: false },
    sorting: { enabled: false },
    stateBar: { visible: false },    
  },
  
  fields: [
    { fieldName: 'matId', dataType: ValueType.TEXT },
    { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: '작업구분', dataType: ValueType.TEXT },
    { fieldName: 'org작업구분', dataType: ValueType.TEXT },
    //{ fieldName: 'matDesc', dataType: ValueType.TEXT },
    { fieldName: 'type', dataType: ValueType.TEXT },
    // { fieldName: 'total', dataType: ValueType.NUMBER },
  ],

  columns: [
    { name: 'model', fieldName: 'model', header: { text: '모델' }, width: '65',autoFilter: true, styleName: "tc", mergeRule: { criteria: "values['model'] + value" }},
    { name: '작업구분', fieldName: '작업구분', header: { text: '작업\n구분', styleName: 'multiline-header' }, width: '50',autoFilter: true, styleName: "tc", mergeRule: { criteria: "values['model'] + value" }},
    //{ name: 'matDesc', fieldName: 'matDesc', header: { text: '특이사항' }, width: '100',autoFilter: true, styleName: "tl",footer: [{text: "합계"},{text: ""},{text: ""},{text: ""}]},
    { name: 'type', fieldName: 'type', header: { text: '상태' }, width: '80',autoFilter: false, styleName: "tc",footer: [{text: "Total"},{text: "작업대기"},{text: "작업중"},{text: "HOLD"}] ,autoFilter:true},
    // { name: 'total', fieldName: 'total', header: { text: 'Total' }, width: '80', styleName: "tr",numberFormat: '#,##0'},
  ],
  
  layout: [  
    {name: "품번",header:{ text: "품번" }, items:["model","작업구분"]},"type",
  ],
};

module.exports = grid;
