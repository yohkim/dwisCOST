/*
 * 제조 실적 입력 > Rework > 설비 로그 조회 > Rework 필름박리 DPF 설비
 */
const { ValueType } = require('realgrid');
const { rgDisplayDateTime } = require('@/utils/dateUtils');

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
    fixed: { colBarWidth: 1, colCount: 5 },
  },

  fields: [
    { fieldName: 'seqId', dataType: ValueType.NUMBER },
    { fieldName: '공장코드', dataType: ValueType.TEXT },
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: '작업구분', dataType: ValueType.TEXT },
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: '시작시각', dataType: ValueType.TEXT },
    { fieldName: '종료시각', dataType: ValueType.TEXT },
    //{ fieldName: '설비호기', dataType: ValueType.TEXT },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
    { fieldName: '근무조', dataType: ValueType.TEXT },
    { fieldName: '작업자', dataType: ValueType.TEXT },
    { fieldName: 'cellNo', dataType: ValueType.TEXT },
    { fieldName: 'cstNo', dataType: ValueType.TEXT },
    { fieldName: 'cstSu', dataType: ValueType.NUMBER },
    { fieldName: 'cst행', dataType: ValueType.TEXT },
    { fieldName: 'cst열', dataType: ValueType.TEXT },
    { fieldName: 'scrap위치', dataType: ValueType.TEXT },
    { fieldName: 'scrap', dataType: ValueType.TEXT },
    { fieldName: 'filmQr', dataType: ValueType.TEXT },
    { fieldName: 'portNo', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'seqId', fieldName: 'seqId', width: '80', header: { text: 'SEQ_ID' }, autoFilter: true, numberFormat: '####', styleName: 'tr' },
    { name: '공장코드', fieldName: '공장코드', width: '120', header: { text: '공장코드' }, autoFilter: true, styleName: 'tl' },
    { name: '공정코드', fieldName: '공정코드', width: '120', header: { text: '공정코드' }, autoFilter: true, styleName: 'tl' },
    { name: '작업구분', fieldName: '작업구분', width: '120', header: { text: '작업구분' }, autoFilter: true, styleName: 'tl' },
    { name: 'runNo', fieldName: 'runNo', width: '80', header: { text: 'RUN_NO' }, autoFilter: true, styleName: 'tl' },
    { name: '시작시각', fieldName: '시작시각', width: '120', header: { text: '시작시각' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime },
    { name: '종료시각', fieldName: '종료시각', width: '120', header: { text: '종료시각' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime },
    //{ name: '설비호기', fieldName: '설비호기', width: '120', header: { text: '설비호기' }, autoFilter: true, styleName: 'tl'},
    {
      name: '설비약명',
      fieldName: '설비약명',
      header: { text: '호기' },
      autoFilter: true,
      styleName: 'tl',
    },
    { name: '근무조', fieldName: '근무조', width: '90', header: { text: '근무조' }, autoFilter: true, styleName: 'tl' },
    { name: '작업자', fieldName: '작업자', width: '90', header: { text: '작업자' }, autoFilter: true, styleName: 'tl' },
    { name: 'cellNo', fieldName: 'cellNo', width: '80', header: { text: 'CELL_NO' }, autoFilter: true, styleName: 'tl' },
    { name: 'cstNo', fieldName: 'cstNo', width: '80', header: { text: 'CST_NO' }, autoFilter: true, styleName: 'tl' },
    { name: 'cstSu', fieldName: 'cstSu', width: '80', header: { text: 'CST_SU' }, autoFilter: true, numberFormat: '####', styleName: 'tr' },
    { name: 'cst행', fieldName: 'cst행', width: '80', header: { text: 'CST_행' }, autoFilter: true, styleName: 'tl' },
    { name: 'cst열', fieldName: 'cst열', width: '80', header: { text: 'CST_열' }, autoFilter: true, styleName: 'tl' },
    { name: 'scrap위치', fieldName: 'scrap위치', width: '110', header: { text: 'SCRAP위치' }, autoFilter: true, styleName: 'tl' },
    { name: 'scrap', fieldName: 'scrap', width: '80', header: { text: 'SCRAP' }, autoFilter: true, styleName: 'tl' },
    { name: 'filmQr', fieldName: 'filmQr', width: '80', header: { text: 'FILM_QR' }, autoFilter: true, styleName: 'tl' },
    { name: 'portNo', fieldName: 'portNo', width: '80', header: { text: 'PORT_NO' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
