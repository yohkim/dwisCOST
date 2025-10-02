/*
 * 작업현황 > 재공/재고현황 >  Rework - MRUN,필름박리
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
    { fieldName: 'mrunYymm', dataType: ValueType.TEXT },
    { fieldName: 'matId', dataType: ValueType.TEXT },
    { fieldName: 'mboxNo', dataType: ValueType.TEXT },
    { fieldName: 'befRunno', dataType: ValueType.TEXT },
    { fieldName: 'aftRunno', dataType: ValueType.TEXT },
    { fieldName: '작업시작', dataType: ValueType.TEXT },
    { fieldName: '작업종료', dataType: ValueType.TEXT },
    { fieldName: 'agb호기명', dataType: ValueType.TEXT },
    { fieldName: 'pfl설비명', dataType: ValueType.TEXT },
    { fieldName: 'pflStage', dataType: ValueType.TEXT },
    { fieldName: 'cellNo', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'mrunYymm', fieldName: 'mrunYymm', header: { text: 'MRUN YYMM' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'matId', fieldName: 'matId', header: { text: 'MAT ID' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'mboxNo', fieldName: 'mboxNo', header: { text: 'MBOX NO' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'befRunno', fieldName: 'befRunno', header: { text: 'BEF RUNNO' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'aftRunno', fieldName: 'aftRunno', header: { text: 'AFT RUNNO' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: '작업시작', fieldName: '작업시작', header: { text: '작업시작' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: '작업종료', fieldName: '작업종료', header: { text: '작업종료' }, width: '80',autoFilter: true, styleName: "tc"},
    { name: 'agb호기명', fieldName: 'agb호기명', header: { text: 'agb호기명' }, width: '80',autoFilter: true, styleName: "tl"},
    { name: 'pfl설비명', fieldName: 'pfl설비명', header: { text: 'pfl설비명' }, width: '80',autoFilter: true, styleName: "tl"},
    { name: 'pflStage', fieldName: 'pflStage', header: { text: 'PFL STAGE' }, width: '80',autoFilter: true, styleName: "tr"},
    { name: 'cellNo', fieldName: 'cellNo', header: { text: 'CELL NO' }, width: '80',autoFilter: true, styleName: "tc",footer: {expression: "count",numberFormat: '#,##0'}},
    { name: '특이사항', fieldName: '특이사항', header: { text: '특이사항' }, width: '80',autoFilter: true, styleName: "tc"},
  ],
};

module.exports = grid;
