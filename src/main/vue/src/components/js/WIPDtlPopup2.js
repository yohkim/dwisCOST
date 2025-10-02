/*
 * 작업현황 > 재공/재고현황 > 포장/출하 상세 팝업
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
    sorting: { enabled: true },
    stateBar: { visible: false },    
  },
  
  fields: [
    { fieldName: 'pack상태', dataType: ValueType.TEXT },
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: 'runId', dataType: ValueType.TEXT },
    { fieldName: 'packQrno', dataType: ValueType.TEXT },
    { fieldName: '대포장Qrno', dataType: ValueType.TEXT },
    { fieldName: '검사결과', dataType: ValueType.TEXT },
    { fieldName: 'si의뢰일자', dataType: ValueType.TEXT },
    { fieldName: 'cell수량', dataType: ValueType.NUMBER },
    { fieldName: 'palletNo', dataType: ValueType.TEXT },
    { fieldName: 'palletDate', dataType: ValueType.TEXT },
    { fieldName: '보관구역', dataType: ValueType.TEXT },
    { fieldName: 'code', dataType: ValueType.TEXT },
    { fieldName: 'model', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'pack상태', fieldName: 'pack상태', header: { text: 'PACK 상태' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'runId', fieldName: 'runId', header: { text: 'RUN_ID' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'packQrno', fieldName: 'packQrno', header: { text: 'PACK QRNO' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: '대포장Qrno', fieldName: '대포장Qrno', header: { text: '대포장 QRNO' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: '검사결과', fieldName: '검사결과', header: { text: '검사결과' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'si의뢰일자', fieldName: 'si의뢰일자', header: { text: 'SI의뢰일자' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'cell수량', fieldName: 'cell수량', header: { text: 'CELL 수량' }, width: '80',autoFilter: true, styleName: "tr", numberFormat: "#,##0", footer: {expression: "sum",numberFormat: "#,##0"}},
    { name: 'palletNo', fieldName: 'palletNo', header: { text: 'PALLET NO' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'palletDate', fieldName: 'palletDate', header: { text: 'PALLET DATE' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: '보관구역', fieldName: '보관구역', header: { text: '보관구역' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'code', fieldName: 'code', header: { text: 'CODE' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'model', fieldName: 'model', header: { text: 'model' }, width: '80',autoFilter: true, styleName: "tc"},
  ],
};

module.exports = grid;
