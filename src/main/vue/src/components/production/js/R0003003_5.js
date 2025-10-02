/*
 * 제조 실적 입력 > Back#2 Cell QC > 설비 로그 조회
 */
const { ValueType } = require('realgrid');

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
    footers: { visible: false },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colBarWidth: 1, colCount: 3 },
  },

  fields: [
    { fieldName: 'seqNo', dataType: ValueType.NUMBER },
    { fieldName: 'uniqueId', dataType: ValueType.TEXT },
    { fieldName: 'cellId', dataType: ValueType.TEXT },
    { fieldName: 'reportType', dataType: ValueType.NUMBER },
    { fieldName: 'location', dataType: ValueType.NUMBER },
    { fieldName: 'operName', dataType: ValueType.TEXT },
    { fieldName: 'operTeam', dataType: ValueType.TEXT },
    { fieldName: 'regDate', dataType: ValueType.TEXT },
    { fieldName: 'convertRegDate', dataType: ValueType.TEXT },
    { fieldName: 'convertRegTime', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'seqNo', fieldName: 'seqNo', width: '90', header: { text: 'SEQ_NO' }, autoFilter: true, numberFormat: '####', styleName: 'tr' },
    { name: 'uniqueId', fieldName: 'uniqueId', width: '300', header: { text: 'UNIQUE_ID' }, autoFilter: true, styleName: 'tl' },
    { name: 'cellId', fieldName: 'cellId', width: '260', header: { text: 'CELL_ID' }, autoFilter: true, styleName: 'tl' },
    { name: 'reportType', fieldName: 'reportType', width: '130', header: { text: 'REPORT_TYPE' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'location', fieldName: 'location', width: '100', header: { text: 'LOCATION' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'operName', fieldName: 'operName', width: '120', header: { text: 'OPER_NAME' }, autoFilter: true, styleName: 'tl' },
    { name: 'operTeam', fieldName: 'operTeam', width: '120', header: { text: 'OPER_TEAM' }, autoFilter: true, styleName: 'tl' },
    //{ name: 'regDate', fieldName: 'regDate', width: '80', header: { text: 'REG_DATE' }, autoFilter: true, styleName: 'tl' },
    { name: 'convertRegDate', fieldName: 'convertRegDate', width: '110', header: { text: 'REG_DATE' }, autoFilter: true, styleName: 'tl' },
    { name: 'convertRegTime', fieldName: 'convertRegTime', width: '110', header: { text: 'REG_TIME' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
