/*
 * 작업현황 > 공정별/일별 불량현황
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
      fitStyle: GridFitStyle.EVEN_FILL,
      hscrollBar: true,
      showEmptyMessage: true,
      summaryMode: SummaryMode.AGGREGATE,
    },    
    edit: { editable: false },    
    header: { height: 25 },
    paste: { enabled: false },
    rowIndicator: { visible: false },
    sorting: { enabled: false },
    stateBar: { visible: false }, 
    footers: { 
      visible: true, 
      items:[
        {
          height: 30
        }, 
      ]
    },   
  },
  
  fields: [
    { fieldName: 'area', dataType: ValueType.TEXT },
    { fieldName: 'lotrunno', dataType: ValueType.TEXT },
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: '공정명', dataType: ValueType.TEXT },
    { fieldName: '불량코드', dataType: ValueType.TEXT },
    { fieldName: '불량명', dataType: ValueType.TEXT },
    { fieldName: '집계일자', dataType: ValueType.TEXT },
    { fieldName: '투입수', dataType: ValueType.NUMBER },
    { fieldName: 'totalNg', dataType: ValueType.NUMBER },
    { fieldName: 'ng수량', dataType: ValueType.NUMBER },
    { fieldName: '수율제외수량', dataType: ValueType.NUMBER },
    { fieldName: 'rework진행여부수량', dataType: ValueType.NUMBER },
  ],

  columns: [
    { name: 'area', fieldName: 'area', header: { text: 'AREA' }, width: '150',styleName: "tl" },
    { name: 'lotrunno', fieldName: 'lotrunno', header: { text: 'LotRunNO' }, width: '150',styleName: "tl", autoFilter: true },
    { name: '공정코드', fieldName: '공정코드', header: { text: '공정코드' }, width: '80',styleName: "tl"},
    { name: '공정명', fieldName: '공정명', header: { text: '공정명' }, width: '150',styleName: "tl"},
    { name: '불량코드', fieldName: '불량코드', header: { text: '불량코드' }, width: '80',styleName: "tl"},
    { name: '불량명', fieldName: '불량명', header: { text: '불량명' }, width: '150', styleName: "tl"},
    { name: '집계일자', fieldName: '집계일자', header: { text: '집계일자' }, width: '150', styleName: "tl"},
    { name: '투입수', fieldName: '투입수', header: { text: '투입수량' }, width: '150', numberFormat: "#,##0", styleName: "tr", footer: { expression: "sum", numberFormat: '#,##0' } },
    { name: 'totalNg', fieldName: 'totalNg', header: { text: '합계' }, width: '150', numberFormat: "#,##0", styleName: "tr", footer: { expression: "sum", numberFormat: '#,##0' } },
    { name: 'ng수량', fieldName: 'ng수량', header: { text: 'NG' }, width: '150', numberFormat: "#,##0", styleName: "tr", footer: { expression: "sum", numberFormat: '#,##0' } },
    { name: '수율제외수량', fieldName: '수율제외수량', header: { text: '수율제외' }, width: '150', numberFormat: "#,##0", styleName: "tr", footer: { expression: "sum", numberFormat: '#,##0' } },
    { name: 'rework진행여부수량', fieldName: 'rework진행여부수량', header: { text: 'Rework진행여부' }, width: '150', numberFormat: "#,##0", styleName: "tr", footer: { expression: "sum", numberFormat: '#,##0' } },
  ],
  
  layout: [  
    "lotrunno","투입수","totalNg","ng수량","수율제외수량","rework진행여부수량"
  ],
};

module.exports = grid;
