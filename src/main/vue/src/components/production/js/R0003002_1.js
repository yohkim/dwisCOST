/*
 * 제조 실적 입력 > Back#2 Cassette QC > 설비 로그 조회
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
    fixed: { colBarWidth: 1, colCount: 7 },
  },

  fields: [
    { fieldName: 'seqId', dataType: ValueType.NUMBER },
    { fieldName: '공장코드', dataType: ValueType.TEXT },
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: '시작시간', dataType: ValueType.TEXT },
    { fieldName: '종료시간', dataType: ValueType.TEXT },
    //{ fieldName: '설비호기', dataType: ValueType.TEXT },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: '승인리더', dataType: ValueType.TEXT },
    { fieldName: '검사차수', dataType: ValueType.TEXT },
    { fieldName: 'incstSu', dataType: ValueType.NUMBER },
    { fieldName: 'incstNo', dataType: ValueType.TEXT },
    { fieldName: 'cst작업자', dataType: ValueType.TEXT },
    { fieldName: 'cst검사시작', dataType: ValueType.TEXT },
    { fieldName: 'incell위치', dataType: ValueType.TEXT },
    { fieldName: 'result', dataType: ValueType.TEXT },
    { fieldName: 'scrap', dataType: ValueType.TEXT },
    { fieldName: 'outcstNo', dataType: ValueType.TEXT },
    { fieldName: 'outcell위치', dataType: ValueType.TEXT },
    { fieldName: 'cst검사종료', dataType: ValueType.TEXT },
    { fieldName: 'cell작업자', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'seqId', fieldName: 'seqId', width: '80', header: { text: 'SEQ_ID' }, autoFilter: true, numberFormat: '####', styleName: 'tr' },
    { name: '공장코드', fieldName: '공장코드', width: '80', header: { text: '공장코드' }, autoFilter: true, styleName: 'tl' },
    { name: '공정코드', fieldName: '공정코드', width: '80', header: { text: '공정코드' }, autoFilter: true, styleName: 'tl' },
    { name: '시작시간', fieldName: '시작시간', width: '120', header: { text: '시작시간' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime },
    { name: '종료시간', fieldName: '종료시간', width: '120', header: { text: '종료시간' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime },
    //{ name: '설비호기', fieldName: '설비호기', width: '80', header: { text: '설비호기' }, autoFilter: true, styleName: 'tl' },
    {
      name: '설비약명',
      fieldName: '설비약명',
      header: { text: '호기' },
      autoFilter: true,
      styleName: 'tl',
    },
    { name: 'runNo', fieldName: 'runNo', width: '120', header: { text: 'RUN_NO' }, autoFilter: true, styleName: 'tl' },
    { name: '승인리더', fieldName: '승인리더', width: '90', header: { text: '승인리더' }, autoFilter: true, styleName: 'tl' },
    { name: '검사차수', fieldName: '검사차수', width: '80', header: { text: '검사차수' }, autoFilter: true, styleName: 'tl' },
    { name: 'incstSu', fieldName: 'incstSu', width: '80', header: { text: 'INCST_SU' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'incstNo', fieldName: 'incstNo', width: '80', header: { text: 'INCST_NO' }, autoFilter: true, styleName: 'tl' },
    { name: 'cst작업자', fieldName: 'cst작업자', width: '90', header: { text: 'CST작업자' }, autoFilter: true, styleName: 'tl' },
    { name: 'cst검사시작', fieldName: 'cst검사시작', width: '120', header: { text: 'CST검사시작' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime },
    { name: 'incell위치', fieldName: 'incell위치', width: '100', header: { text: 'INCELL_위치' }, autoFilter: true, styleName: 'tl' },
    { name: 'result', fieldName: 'result', width: '80', header: { text: 'RESULT' }, autoFilter: true, styleName: 'tl' },
    { name: 'scrap', fieldName: 'scrap', width: '80', header: { text: 'SCRAP' }, autoFilter: true, styleName: 'tl' },
    { name: 'outcstNo', fieldName: 'outcstNo', width: '110', header: { text: 'OUTCST_NO' }, autoFilter: true, styleName: 'tl' },
    { name: 'outcell위치', fieldName: 'outcell위치', width: '110', header: { text: 'OUTCELL_위치' }, autoFilter: true, styleName: 'tl' },
    { name: 'cst검사종료', fieldName: 'cst검사종료', width: '120', header: { text: 'CST검사종료' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime },
    { name: 'cell작업자', fieldName: 'cell작업자', width: '100', header: { text: 'CELL작업자' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
