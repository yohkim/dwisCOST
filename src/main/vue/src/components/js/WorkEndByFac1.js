/*
 * 작업현황 > 설비별(작업완료) > 요약
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
      hscrollBar: true,
      showEmptyMessage: true,
      fitStyle: GridFitStyle.EVEN_FILL,
      summaryMode: SummaryMode.AGGREGATE,
    },
    // fixed: {colCount:3},
    edit: { editable: false },
    footer: { visible: true },
    header: { height: 25 },
    paste: { enabled: false },
    rowIndicator: { visible: false },
    sorting: { enabled: false },
    stateBar: { visible: false },    
  },
  
  fields: [
    { fieldName: '공정명', dataType: ValueType.TEXT },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
    { fieldName: '설비명', dataType: ValueType.TEXT },
    { fieldName: '투입수량', dataType: ValueType.NUMBER },
    { fieldName: '양품수량', dataType: ValueType.NUMBER },
    { fieldName: '불량수량', dataType: ValueType.NUMBER },
    { fieldName: '수율', dataType: ValueType.NUMBER },
    
  ],

  columns: [
    { name: '공정명', fieldName: '공정명', header: { text: '공정명' }, width: '100',autoFilter: true, styleName: "tl",mergeRule:{criteria: "value"}},
    { name: '설비약명', fieldName: '설비약명', header: { text: '설비약명' }, width: '100',autoFilter: true, styleName: "tl"},
    // { name: '설비명', fieldName: '설비명', header: { text: '설비명' }, width: '150',autoFilter: true, styleName: "tl"},
    { name: '투입수량', fieldName: '투입수량', header: { text: '투입수량' }, width: '100',styleName: "tr",numberFormat: '#,##0',footer:{expression: "sum",numberFormat: '#,##0'}},
    { name: '양품수량', fieldName: '양품수량', header: { text: '양품수량' }, width: '100',styleName: "tr",numberFormat: '#,##0',footer:{expression: "sum",numberFormat: '#,##0'}},
    { name: '불량수량', fieldName: '불량수량', header: { text: '불량수량' }, width: '100',styleName: "tr",numberFormat: '#,##0',footer:{expression: "sum",numberFormat: '#,##0'}},
    { name: '수율', fieldName: '수율', header: { text: '수율' }, width: '80',styleName: "tr",suffix:"%",numberFormat: '#,##0'},
  ],
};

module.exports = grid;
