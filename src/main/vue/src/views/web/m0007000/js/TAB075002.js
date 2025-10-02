/*
 * 카세트 관리 > 카세트 마스터 > 카세트 이력
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: false, showAll: false },
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
    { fieldName: '위치', dataType: ValueType.TEXT },
    { fieldName: '카세트상태', dataType: ValueType.TEXT },
    { fieldName: '카세트상태값', dataType: ValueType.TEXT },
    { fieldName: '시작일자', dataType: ValueType.TEXT },
    { fieldName: '시작시간', dataType: ValueType.TEXT },
    { fieldName: '종료일자', dataType: ValueType.TEXT },
    { fieldName: '종료시간', dataType: ValueType.TEXT },
    { fieldName: '담당자', dataType: ValueType.TEXT },
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: '공정명', dataType: ValueType.TEXT },
    { fieldName: '설비코드', dataType: ValueType.TEXT },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
    { fieldName: '투입수량', dataType: ValueType.NUMBER },
    { fieldName: '배출수량', dataType: ValueType.NUMBER },
    { fieldName: '비고', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: '공장코드', fieldName: '공장코드', width: '80', header: { text: '공장코드' }, autoFilter: true, styleName: 'tl' },
    { name: '종류', fieldName: '종류', width: '50', header: { text: '종류' }, autoFilter: true, styleName: 'tl' },
    { name: '타입', fieldName: '타입', width: '50', header: { text: '타입' }, autoFilter: true, styleName: 'tl' },
    { name: '모델', fieldName: '모델', width: '50', header: { text: '모델' }, autoFilter: true, styleName: 'tl' },
    { name: 'cstNo', fieldName: 'cstNo', width: '80', header: { text: 'CST_NO' }, autoFilter: true, styleName: 'tl' },
    { name: '위치', fieldName: '위치', width: '80', header: { text: '위치' }, autoFilter: true, styleName: 'tl' },
    { name: '카세트상태', fieldName: '카세트상태', width: '90', header: { text: '카세트상태' }, autoFilter: true, styleName: 'tl' },
    { name: '카세트상태값', fieldName: '카세트상태값', width: '100', header: { text: '카세트상태값' }, autoFilter: true, styleName: 'tl', visible: false },
    { name: '시작일자', fieldName: '시작일자', width: '80', header: { text: '시작일자' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: '시작시간', fieldName: '시작시간', width: '80', header: { text: '시작시간' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayTime },
    { name: '종료일자', fieldName: '종료일자', width: '80', header: { text: '종료일자' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: '종료시간', fieldName: '종료시간', width: '80', header: { text: '종료시간' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayTime },
    { name: '담당자', fieldName: '담당자', width: '90', header: { text: '담당자' }, autoFilter: true, styleName: 'tl' },
    { name: 'runNo', fieldName: 'runNo', width: '80', header: { text: 'RUN_NO' }, autoFilter: true, styleName: 'tl' },
    { name: '공정코드', fieldName: '공정코드', width: '80', header: { text: '공정코드' }, autoFilter: true, styleName: 'tl' },
    { name: '공정명', fieldName: '공정명', width: '80', header: { text: '공정명' }, autoFilter: true, styleName: 'tl' },
    { name: '설비코드', fieldName: '설비코드', width: '80', header: { text: '설비코드' }, autoFilter: true, styleName: 'tl' },
    { name: '설비약명', fieldName: '설비약명', width: '80', header: { text: '설비약명' }, autoFilter: true, styleName: 'tl' },
    { name: '투입수량', fieldName: '투입수량', width: '80', header: { text: '투입수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: '배출수량', fieldName: '배출수량', width: '80', header: { text: '배출수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: '비고', fieldName: '비고', width: '80', header: { text: '비고' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
