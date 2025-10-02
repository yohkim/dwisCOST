/*
 * 카세트 관리 > 카세트 반출 > 회수처리
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
    fixed: { colBarWidth: 1, colCount: 5 },
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
    { fieldName: '반출일', dataType: ValueType.TEXT },
    { fieldName: '반출시간', dataType: ValueType.TEXT },
    { fieldName: '반출부서', dataType: ValueType.TEXT },
    { fieldName: '반출자', dataType: ValueType.TEXT },
    { fieldName: '반출사유', dataType: ValueType.TEXT },
    { fieldName: '회수일', dataType: ValueType.TEXT },
    { fieldName: '회수시간', dataType: ValueType.TEXT },
    { fieldName: '회수자부서', dataType: ValueType.TEXT },
    { fieldName: '회수자', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: '공장코드', fieldName: '공장코드', width: '80', header: { text: '공장코드' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: '종류', fieldName: '종류', width: '50', header: { text: '종류' }, autoFilter: true, styleName: 'tl' },
    { name: '타입', fieldName: '타입', width: '60', header: { text: '타입' }, autoFilter: true, styleName: 'tl' },
    { name: '모델', fieldName: '모델', width: '50', header: { text: '모델' }, autoFilter: true, styleName: 'tl' },
    { name: 'cstNo', fieldName: 'cstNo', width: '80', header: { text: 'CST_NO' }, autoFilter: true, styleName: 'tl' },
    // { name: '열', fieldName: '열', width: '80', header: { text: '열' }, autoFilter: true, umberFormat: '#,###.###', editable: false, styleName: 'tr' },
    // { name: '행', fieldName: '행', width: '80', header: { text: '행' }, autoFilter: true, numberFormat: '#,###.###', editable: false , styleName: 'tr'},
    { name: '위치', fieldName: '위치', width: '80', header: { text: '위치' }, autoFilter: true, styleName: 'tl' },
    { name: '카세트상태', fieldName: '카세트상태', width: '90', header: { text: '카세트상태' }, autoFilter: true, styleName: 'tl' },
    { name: '카세트상태값', fieldName: '카세트상태값', width: '100', header: { text: '카세트상태값' }, autoFilter: true, styleName: 'tl', visible: false },
    { name: '반출일', fieldName: '반출일', width: '80', header: { text: '반출일' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: '반출시간', fieldName: '반출시간', width: '80', header: { text: '반출시간' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayTime },
    { name: '반출부서', fieldName: '반출부서', width: '80', header: { text: '반출부서' }, autoFilter: true, styleName: 'tl' },
    { name: '반출자', fieldName: '반출자', width: '80', header: { text: '반출자' }, autoFilter: true, styleName: 'tl' },
    { name: '반출사유', fieldName: '반출사유', width: '80', header: { text: '반출사유' }, autoFilter: true, styleName: 'tl' },
    { name: '회수일', fieldName: '회수일', width: '80', header: { text: '회수일' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: '회수시간', fieldName: '회수시간', width: '80', header: { text: '회수시간' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayTime },
    { name: '회수자부서', fieldName: '회수자부서', width: '90', header: { text: '회수자부서' }, autoFilter: true, styleName: 'tl' },
    { name: '회수자', fieldName: '회수자', width: '80', header: { text: '회수자' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
