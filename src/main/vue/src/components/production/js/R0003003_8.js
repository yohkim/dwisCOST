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
    fixed: { colBarWidth: 1, colCount: 6 },
  },

  fields: [
    { fieldName: 'seqNo', dataType: ValueType.NUMBER },
    { fieldName: 'eqpId', dataType: ValueType.TEXT },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
    { fieldName: 'uniqueId', dataType: ValueType.TEXT },
    { fieldName: 'packSeq', dataType: ValueType.NUMBER },
    { fieldName: 'trayId', dataType: ValueType.TEXT },
    { fieldName: 'trayTotalColumns', dataType: ValueType.TEXT },
    { fieldName: 'trayTotalRows', dataType: ValueType.TEXT },
    { fieldName: 'trayDirection', dataType: ValueType.TEXT },
    { fieldName: 'isFinishCover', dataType: ValueType.TEXT },
    { fieldName: 'operName', dataType: ValueType.TEXT },
    { fieldName: 'operTeam', dataType: ValueType.TEXT },
    { fieldName: 'regDate', dataType: ValueType.TEXT },
    { fieldName: 'convertRegDate', dataType: ValueType.TEXT },
    { fieldName: 'convertRegTime', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'seqNo', fieldName: 'seqNo', width: '90', header: { text: 'SEQ_NO' }, autoFilter: true, numberFormat: '####', styleName: 'tr' },
    { name: 'eqpId', fieldName: 'eqpId', width: '80', header: { text: 'EQP_ID' }, autoFilter: true, styleName: 'tl' },
    {
      name: '설비약명',
      fieldName: '설비약명',
      header: { text: '호기' },
      autoFilter: true,
      styleName: 'tl',
    },
    { name: 'uniqueId', fieldName: 'uniqueId', width: '300', header: { text: 'UNIQUE_ID' }, autoFilter: true, styleName: 'tl' },
    { name: 'packSeq', fieldName: 'packSeq', width: '100', header: { text: 'PACK_SEQ' }, autoFilter: true, numberFormat: '####', styleName: 'tr' },
    { name: 'trayId', fieldName: 'trayId', width: '160', header: { text: 'TRAY_ID' }, autoFilter: true, styleName: 'tl' },
    { name: 'trayTotalColumns', fieldName: 'trayTotalColumns', width: '180', header: { text: 'TRAY_TOTAL_COLUMNS' }, autoFilter: true, styleName: 'tl' },
    { name: 'trayTotalRows', fieldName: 'trayTotalRows', width: '160', header: { text: 'TRAY_TOTAL_ROWS' }, autoFilter: true, styleName: 'tl' },
    { name: 'trayDirection', fieldName: 'trayDirection', width: '150', header: { text: 'TRAY_DIRECTION' }, autoFilter: true, styleName: 'tl' },
    { name: 'isFinishCover', fieldName: 'isFinishCover', width: '150', header: { text: 'IS_FINISH_COVER' }, autoFilter: true, styleName: 'tl' },
    { name: 'operName', fieldName: 'operName', width: '120', header: { text: 'OPER_NAME' }, autoFilter: true, styleName: 'tl' },
    { name: 'operTeam', fieldName: 'operTeam', width: '120', header: { text: 'OPER_TEAM' }, autoFilter: true, styleName: 'tl' },
    // { name: 'regDate', fieldName: 'regDate', width: '80', header: { text: 'REG_DATE' }, autoFilter: true, styleName: 'tl' },
    { name: 'convertRegDate', fieldName: 'convertRegDate', width: '110', header: { text: 'REG_DATE' }, autoFilter: true, styleName: 'tl' },
    { name: 'convertRegTime', fieldName: 'convertRegTime', width: '110', header: { text: 'REG_TIME' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
