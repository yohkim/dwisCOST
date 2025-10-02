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
    fixed: { colBarWidth: 1, colCount: 7 },
  },

  fields: [
    { fieldName: 'seqNo', dataType: ValueType.NUMBER },
    { fieldName: 'eqpId', dataType: ValueType.TEXT },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
    { fieldName: 'traySeq', dataType: ValueType.NUMBER },
    { fieldName: 'uniqueId', dataType: ValueType.TEXT },
    { fieldName: 'pocketRow', dataType: ValueType.NUMBER },
    { fieldName: 'pocketColumn', dataType: ValueType.NUMBER },
    { fieldName: 'pocketIndex', dataType: ValueType.NUMBER },
    { fieldName: 'cellId', dataType: ValueType.TEXT },
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: 'regDate', dataType: ValueType.TEXT },
    { fieldName: 'convertRegDate', dataType: ValueType.TEXT },
    { fieldName: 'convertRegTime', dataType: ValueType.TEXT },
    { fieldName: '샘플의뢰여부', dataType: ValueType.NUMBER },
    { fieldName: 'scrap', dataType: ValueType.TEXT },
    { fieldName: 'remark', dataType: ValueType.TEXT },
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
    { name: 'traySeq', fieldName: 'traySeq', width: '100', header: { text: 'TRAY_SEQ' }, autoFilter: true, numberFormat: '####', styleName: 'tr' },
    { name: 'uniqueId', fieldName: 'uniqueId', width: '300', header: { text: 'UNIQUE_ID' }, autoFilter: true, styleName: 'tl' },
    { name: 'cellId', fieldName: 'cellId', width: '260', header: { text: 'CELL_ID' }, autoFilter: true, styleName: 'tl' },
    { name: 'runNo', fieldName: 'runNo', width: '150', header: { text: 'RUN_NO' }, autoFilter: true, styleName: 'tl' },
    { name: 'pocketRow', fieldName: 'pocketRow', width: '120', header: { text: 'POCKET_ROW' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'pocketColumn', fieldName: 'pocketColumn', width: '150', header: { text: 'POCKET_COLUMN' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'pocketIndex', fieldName: 'pocketIndex', width: '140', header: { text: 'POCKET_INDEX' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    // { name: 'regDate', fieldName: 'regDate', width: '80', header: { text: 'REG_DATE' }, autoFilter: true, styleName: 'tl' },
    { name: 'convertRegDate', fieldName: 'convertRegDate', width: '110', header: { text: 'REG_DATE' }, autoFilter: true, styleName: 'tl' },
    { name: 'convertRegTime', fieldName: 'convertRegTime', width: '110', header: { text: 'REG_TIME' }, autoFilter: true, styleName: 'tl' },
    { name: '샘플의뢰여부', fieldName: '샘플의뢰여부', width: '120', header: { text: '샘플의뢰여부' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'scrap', fieldName: 'scrap', width: '100', header: { text: 'SCRAP' }, autoFilter: true, styleName: 'tl' },
    { name: 'remark', fieldName: 'remark', width: '120', header: { text: 'Remark' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
