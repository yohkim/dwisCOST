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
      // fitStyle: GridFitStyle.NONE,
      hscrollBar: true,
      showEmptyMessage: true,
      summaryMode: SummaryMode.AGGREGATE,
    },
    fixed: {colCount:4},
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
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: '공정명', dataType: ValueType.TEXT },
    { fieldName: '불량코드', dataType: ValueType.TEXT },
    { fieldName: '불량명', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'area', fieldName: 'area', header: { text: 'AREA' }, width: '150',autoFilter: true, styleName: "tl" },
    { name: '공정코드', fieldName: '공정코드', header: { text: '공정코드' }, width: '80',autoFilter: true, styleName: "tl"},
    { name: '공정명', fieldName: '공정명', header: { text: '공정명' }, width: '150',autoFilter: true, styleName: "tl"},
    { name: '불량코드', fieldName: '불량코드', header: { text: '불량코드' }, width: '80',autoFilter: true, styleName: "tl"},
    { name: '불량명', fieldName: '불량명', header: { text: '불량명' }, width: '150', autoFilter: true, styleName: "tl"},
  ],
  
  layout: [  
    "area","공정명","불량명"
  ],
};

module.exports = grid;
