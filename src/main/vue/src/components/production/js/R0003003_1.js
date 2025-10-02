/*
 * 제조 실적 입력 > Back#2 Cell QC > 설비 로그 조회
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate, rgDisplayDateTime2, rgDisplayTimeFromSecondNum } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: true },
    copy: { enabled: true, singleMode: true },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: 'NONE',
      hscrollBar: true,
      showEmptyMessage: true,
    },
    hideDeletedRows: true,
    edit: { editable: false, columnEditableFirst: true, commitByCell: true, commitWhenLeave: true },
    footers: { visible: false },
    paste: { enabled: true, checkReadOnly: true, commitEdit: true, enableAppend: false, selectBlockPaste: true },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colBarWidth: 1, colCount: 6 },
  },

  fields: [
    { fieldName: 'seqId', dataType: ValueType.NUMBER },
    { fieldName: 'evId', dataType: ValueType.TEXT },
    { fieldName: 'stage', dataType: ValueType.TEXT },
    { fieldName: 'eqpId', dataType: ValueType.TEXT },
    { fieldName: 'runId', dataType: ValueType.TEXT },
    { fieldName: 'cellId', dataType: ValueType.TEXT },
    { fieldName: 'stepNo', dataType: ValueType.NUMBER },
    { fieldName: 'imageNo', dataType: ValueType.NUMBER },
    { fieldName: 'posX', dataType: ValueType.NUMBER },
    { fieldName: 'posY', dataType: ValueType.NUMBER },
    { fieldName: 'alignX', dataType: ValueType.NUMBER },
    { fieldName: 'alignY', dataType: ValueType.NUMBER },
    { fieldName: 'alignR', dataType: ValueType.NUMBER },
    { fieldName: 'result', dataType: ValueType.TEXT },
    { fieldName: 'startTime', dataType: ValueType.TEXT },
    { fieldName: 'endTime', dataType: ValueType.TEXT },
    { fieldName: 'tacttime', dataType: ValueType.TEXT },
    { fieldName: 'worker', dataType: ValueType.TEXT },
    { fieldName: 'shift', dataType: ValueType.TEXT },
    { fieldName: 'kind', dataType: ValueType.TEXT },
    { fieldName: 'scrap', dataType: ValueType.TEXT },
    { fieldName: '재공적용여부', dataType: ValueType.NUMBER },
  ],

  columns: [
    { name: 'seqId', fieldName: 'seqId', width: '80', header: { text: 'SEQ_ID' }, autoFilter: true, numberFormat: '####', styleName: 'tr' },
    { name: 'evId', fieldName: 'evId', width: '60', header: { text: 'EV_ID' }, autoFilter: true, styleName: 'tl' },
    { name: 'stage', fieldName: 'stage', width: '60', header: { text: 'STAGE' }, autoFilter: true, styleName: 'tl' },
    { name: 'eqpId', fieldName: 'eqpId', width: '70', header: { text: 'EQP_ID' }, autoFilter: true, styleName: 'tl' },
    { name: 'runId', fieldName: 'runId', width: '150', header: { text: 'RUN No.' }, autoFilter: true, styleName: 'tl' },
    { name: 'cellId', fieldName: 'cellId', width: '220', header: { text: 'CELL No.' }, autoFilter: true, styleName: 'edit tl', editable: true },
    { name: 'startTime', fieldName: 'startTime', width: '80', header: { text: 'Start_Date' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: 'startTime', fieldName: 'startTime', width: '80', header: { text: 'Time' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime2 },
    { name: 'endTime', fieldName: 'endTime', width: '80', header: { text: 'End_Date' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: 'endTime', fieldName: 'endTime', width: '80', header: { text: 'Time' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime2 },
    { name: 'tacttime', fieldName: 'tacttime', width: '80', header: { text: 'TactTime' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayTimeFromSecondNum },
    { name: 'worker', fieldName: 'worker', width: '70', header: { text: 'Worker' }, autoFilter: true, styleName: 'tl' },
    { name: 'shift', fieldName: 'shift', width: '50', header: { text: 'Shift' }, autoFilter: true, styleName: 'tl' },
    { name: 'result', fieldName: 'result', width: '80', header: { text: 'RESULT' }, autoFilter: true, styleName: 'tl' },
    { name: 'stepNo', fieldName: 'stepNo', width: '80', header: { text: 'STEP_NO' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'imageNo', fieldName: 'imageNo', width: '90', header: { text: 'IMAGE_NO' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'posX', fieldName: 'posX', width: '80', header: { text: 'POS_X' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'posY', fieldName: 'posY', width: '80', header: { text: 'POS_Y' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'alignX', fieldName: 'alignX', width: '80', header: { text: 'ALIGN_X' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'alignY', fieldName: 'alignY', width: '80', header: { text: 'ALIGN_Y' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'alignR', fieldName: 'alignR', width: '80', header: { text: 'ALIGN_R' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'kind', fieldName: 'kind', width: '50', header: { text: 'Kind' }, autoFilter: true, styleName: 'tl' },
    { name: 'scrap', fieldName: 'scrap', width: '60', header: { text: 'Scrap' }, autoFilter: true, styleName: 'tl' },
    { name: '재공적용여부', fieldName: '재공적용여부', width: '110', header: { text: '재공적용_여부' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
  ],
};

module.exports = grid;
