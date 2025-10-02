/*
 * 작업현황 > 재공/재고현황 >  Rework - 필름박리 - 작업중
 */
const { ValueType,SummaryMode,GridFitStyle } = require('realgrid');

const grid = {
  dataProvider: null,
	gridView: null,
  options: {
    checkBar: { visible: false },
    copy: { enabled: true,singleMode:false},
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: GridFitStyle.EVEN_FILL,
      hscrollBar: true,
      showEmptyMessage: true,
      summaryMode: SummaryMode.AGGREGATE,
    },
    // fixed: {colCount:3},
    edit: { editable: false },
    footers: { visible: true },
    header: { height: 25 },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },    
  },
  
  fields: [
    { fieldName: 'area', dataType: ValueType.TEXT },
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: 'objNo', dataType: ValueType.TEXT },
    { fieldName: '수량', dataType: ValueType.NUMBER },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
    { fieldName: '작업자', dataType: ValueType.TEXT },
    { fieldName: '시작시간', dataType: ValueType.TEXT },
    { fieldName: '상태', dataType: ValueType.TEXT },
    { fieldName: 'runNno', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'area', fieldName: 'area', header: { text: 'AREA' }, width: '80',autoFilter: true, styleName: "tl"},
    { name: '공정코드', fieldName: '공정코드', header: { text: '공정코드' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'objNo', fieldName: 'objNo', header: { text: 'OBJ NO' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: '수량', fieldName: '수량', header: { text: '수량' }, width: '80', styleName: "tr",footer: {expression: "sum",numberFormat: '#,##0'}},
    { name: '설비약명', fieldName: '설비약명', header: { text: '설비약명' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: '작업자', fieldName: '작업자', header: { text: '작업자' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: '시작시간', fieldName: '시작시간', header: { text: '시작시간' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: '상태', fieldName: '상태', header: { text: '상태' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'runNno', fieldName: 'runNno', header: { text: 'RUN NO' }, width: '80',autoFilter: true, styleName: "tc"},
  ],
};

module.exports = grid;
