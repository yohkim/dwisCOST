/*
 * 제조 실적 입력 > Back#2 Cell QC > 설비 로그 조회
 */
const { ValueType } = require('realgrid');
const { rgDisplayDateTime1 } = require('@/utils/dateUtils');

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
    fixed: { colBarWidth: 1, colCount: 2 },
  },

  fields: [
    { fieldName: 'seqId', dataType: ValueType.NUMBER },
    { fieldName: 'runId', dataType: ValueType.TEXT },
    { fieldName: '작업차수', dataType: ValueType.NUMBER },
    { fieldName: 'in수량', dataType: ValueType.NUMBER },
    { fieldName: 'in확인수량', dataType: ValueType.NUMBER },
    { fieldName: 'tray구분', dataType: ValueType.TEXT },
    { fieldName: 'worker', dataType: ValueType.TEXT },
    { fieldName: 'shift', dataType: ValueType.TEXT },
    { fieldName: '작업조', dataType: ValueType.TEXT },
    { fieldName: 'startTime', dataType: ValueType.TEXT },
    { fieldName: 'endTime', dataType: ValueType.TEXT },
    { fieldName: '소포장단위', dataType: ValueType.NUMBER },
    { fieldName: '작업상태', dataType: ValueType.TEXT },
    { fieldName: 'runid타입', dataType: ValueType.TEXT },
    { fieldName: '작업구분', dataType: ValueType.TEXT },
    { fieldName: '완료여부', dataType: ValueType.NUMBER },
    { fieldName: '전공정구분', dataType: ValueType.TEXT },
    { fieldName: 'originNo', dataType: ValueType.TEXT },
    { fieldName: 'origin포장수량', dataType: ValueType.NUMBER },
    { fieldName: '특기사항', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'seqId', fieldName: 'seqId', width: '90', header: { text: 'SEQ_ID' }, autoFilter: true, numberFormat: '####', styleName: 'tr' },
    { name: 'runId', fieldName: 'runId', width: '180', header: { text: 'RUN_ID' }, autoFilter: true, styleName: 'tl' },
    { name: '작업차수', fieldName: '작업차수', width: '90', header: { text: '작업차수' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'in수량', fieldName: 'in수량', width: '90', header: { text: 'IN수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'in확인수량', fieldName: 'in확인수량', width: '110', header: { text: 'IN확인수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'tray구분', fieldName: 'tray구분', width: '90', header: { text: 'TRAY_구분' }, autoFilter: true,styleName: 'tl' },
    { name: 'worker', fieldName: 'worker', width: '90', header: { text: 'Worker' }, autoFilter: true, styleName: 'tl' },
    { name: 'shift', fieldName: 'shift', width: '90', header: { text: 'Shift' }, autoFilter: true, styleName: 'tl' },
    { name: '작업조', fieldName: '작업조', width: '90', header: { text: '작업조' }, autoFilter: true, styleName: 'tl' },
    { name: 'startTime', fieldName: 'startTime', width: '150', header: { text: 'Start_Time' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    { name: 'endTime', fieldName: 'endTime', width: '150', header: { text: 'End_Time' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    { name: '소포장단위', fieldName: '소포장단위', width: '110', header: { text: '소포장단위' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: '작업상태', fieldName: '작업상태', width: '90', header: { text: '작업상태' }, autoFilter: true, styleName: 'tl' },
    { name: 'runid타입', fieldName: 'runid타입', width: '110', header: { text: 'RUNID_타입' }, autoFilter: true, styleName: 'tl' },
    { name: '작업구분', fieldName: '작업구분', width: '90', header: { text: '작업구분' }, autoFilter: true, styleName: 'tl' },
    { name: '완료여부', fieldName: '완료여부', width: '90', header: { text: '완료여부' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: '전공정구분', fieldName: '전공정구분', width: '110', header: { text: '전공정구분' }, autoFilter: true, styleName: 'tl' },
    { name: 'originNo', fieldName: 'originNo', width: '190', header: { text: 'ORIGIN_NO' }, autoFilter: true, styleName: 'tl' },
    { name: 'origin포장수량', fieldName: 'origin포장수량', width: '110', header: { text: 'ORIGIN_포장수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: '특기사항', fieldName: '특기사항', width: '200', header: { text: '특기사항' }, autoFilter: true, styleName: 'tl' },
  
    

    ],
};

module.exports = grid;
