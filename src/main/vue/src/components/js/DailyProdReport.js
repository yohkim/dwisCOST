/*
 * 작업현황 > 생산일보
 */
const { ValueType,SummaryMode,GridFitStyle } = require('realgrid');

const grid = {
  dataProvider: null,
	gridView: null,
  options: {
    checkBar: { visible: false },
    copy: { enabled: true, singleMode: true },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      // fitStyle: GridFitStyle.NONE,
      hscrollBar: true,
      showEmptyMessage: true,
      summaryMode: SummaryMode.AGGREGATE,
    },
    fixed: {colCount:3},
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
        {
          height: 28
        },
        {
          height: 28
        },
      ]
    },
    header: { heights: [25, 50] },
    paste: { enabled: false },
    rowIndicator: { visible: false },
    sorting: { enabled: false },
    stateBar: { visible: false },    
  },
  
  fields: [
    { fieldName: 'matId', dataType: ValueType.TEXT },
    { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: '작업구분', dataType: ValueType.TEXT },
    { fieldName: 'type', dataType: ValueType.TEXT },
    // { fieldName: 'total', dataType: ValueType.NUMBER },
  ],

  columns: [
    { name: 'model', fieldName: 'model', header: { text: 'MODEL' }, width: '80',autoFilter: true, styleName: "tc" ,mergeRule:{criteria: "row div 6"}},
    { name: '작업구분', fieldName: '작업구분', header: { text: '작업구분' }, width: '100',autoFilter: true, styleName: "tc" ,mergeRule:{criteria: "row div 6"}},
    // { name: 'matId', fieldName: 'matId', header: { text: 'MAT ID' }, width: '100',autoFilter: true, styleName: "tc" ,mergeRule:{criteria: "row div 3"},footer: [{text: "합계"},{text: ""},{text: ""}] },
    { name: 'type', fieldName: 'type', header: { text: 'TYPE' }, width: '100',autoFilter: true, styleName: "tc",footer: [{text: "IN", styleName: "tc"},{text: "OUT", styleName: "tc"},{text: "LOSS", styleName: "tc"},{text: "NG", styleName: "tc"},{text: "수율제외", styleName: "tc"},{text: "재공재고", styleName: "tc"}] },
    // { name: 'total', fieldName: 'total', header: { text: 'Total' }, width: '80', styleName: "tr",numberFormat: '#,##0'},
  ],
  
  layout: [  
    {name: "품번",header:{ text: "품번" }, items:["model","작업구분"]},"type",
  ],
};

module.exports = grid;
