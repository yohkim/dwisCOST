/*
 * 카세트 관리 > 카세트 세척
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: true, showAll: true },
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
    paste: { enabled: true },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colBarWidth: 1, colCount: 4 },
  },

  fields: [
    { fieldName: '공장코드', dataType: ValueType.TEXT },
    { fieldName: '종류', dataType: ValueType.TEXT },
    { fieldName: '타입', dataType: ValueType.TEXT },
    { fieldName: '모델', dataType: ValueType.TEXT },
    { fieldName: 'cstNo', dataType: ValueType.TEXT },
    { fieldName: '열', dataType: ValueType.NUMBER },
    { fieldName: '행', dataType: ValueType.NUMBER },
    { fieldName: '위치', dataType: ValueType.TEXT },
    { fieldName: '카세트상태', dataType: ValueType.TEXT },
    { fieldName: '카세트상태값', dataType: ValueType.TEXT },
    { fieldName: '최근세척시작일', dataType: ValueType.TEXT },
    { fieldName: '최근세척시작시간', dataType: ValueType.TEXT },
    { fieldName: '최근세척종료일', dataType: ValueType.TEXT },
    { fieldName: '최근세척종료시간', dataType: ValueType.TEXT },
    { fieldName: '세척작업자', dataType: ValueType.TEXT },
    { fieldName: '최근점검시작일', dataType: ValueType.TEXT },
    { fieldName: '최근점검시작시간', dataType: ValueType.TEXT },
    { fieldName: '최근점검종료일', dataType: ValueType.TEXT },
    { fieldName: '최근점검종료시간', dataType: ValueType.TEXT },
    { fieldName: '점검작업자', dataType: ValueType.TEXT },
    { fieldName: '점검결과', dataType: ValueType.TEXT },
    { fieldName: '세척설비', dataType: ValueType.TEXT },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
  ],

  columns: [
    // { name: '공장코드', fieldName: '공장코드', width: '80', header: { text: '공장코드' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: '종류', fieldName: '종류', width: '50', header: { text: '종류' }, autoFilter: true, styleName: 'tl' },
    { name: '타입', fieldName: '타입', width: '60', header: { text: '타입' }, autoFilter: true, styleName: 'tl' },
    { name: '모델', fieldName: '모델', width: '50', header: { text: '모델' }, autoFilter: true, styleName: 'tl' },
    { name: 'cstNo', fieldName: 'cstNo', width: '80', header: { text: 'CST_NO' }, autoFilter: true, styleName: 'tl' },
    // { name: '열', fieldName: '열', width: '80', header: { text: '열' }, autoFilter: true, numberFormat: '#,###.###', editable: false, styleName: 'tr' },
    // { name: '행', fieldName: '행', width: '80', header: { text: '행' }, autoFilter: true, numberFormat: '#,###.###', editable: false, styleName: 'tr' },
    { name: '위치', fieldName: '위치', width: '60', header: { text: '위치' }, autoFilter: true, styleName: 'tl' },
    { name: '카세트상태', fieldName: '카세트상태', width: '90', header: { text: '카세트상태' }, autoFilter: true, styleName: 'tl' },
    { name: '카세트상태값', fieldName: '카세트상태값', width: '100', header: { text: '카세트상태값' }, autoFilter: true, styleName: 'tl', visible: false },
    { name: '최근점검시작일', fieldName: '최근점검시작일', width: '100', header: { text: '최근점검시작일' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    // { name: '최근점검시작시간', fieldName: '최근점검시작시간', width: '80', header: { text: '최근점검시작시간' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayTime },
    // { name: '최근점검종료일', fieldName: '최근점검종료일', width: '80', header: { text: '최근점검종료일' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    // { name: '최근점검종료시간', fieldName: '최근점검종료시간', width: '80', header: { text: '최근점검종료시간' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayTime },
    // { name: '점검작업자', fieldName: '점검작업자', width: '80', header: { text: '점검작업자' }, autoFilter: true, styleName: 'tl' },
    { name: '점검결과', fieldName: '점검결과', width: '80', header: { text: '점검결과' }, autoFilter: true, styleName: 'tl' },
    { name: '세척설비', fieldName: '세척설비', width: '80', header: { text: '세척설비' } , autoFilter: true, styleName: 'tl', visible: false},
    { name: '설비약명', fieldName: '설비약명', width: '80', header: { text: '설비명' }, autoFilter: true, styleName: 'tl' },
    { name: '최근세척시작일', fieldName: '최근세척시작일', width: '100', header: { text: '세척시작일' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: '최근세척시작시간', fieldName: '최근세척시작시간', width: '100', header: { text: '세척시작시간' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayTime },
    { name: '최근세척종료일', fieldName: '최근세척종료일', width: '100', header: { text: '세척종료일' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: '최근세척종료시간', fieldName: '최근세척종료시간', width: '100', header: { text: '세척종료시간' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayTime },
    { name: '세척작업자', fieldName: '세척작업자', width: '80', header: { text: '작업자' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
