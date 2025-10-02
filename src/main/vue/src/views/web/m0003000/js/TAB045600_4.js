/*
 * 포장/출하 > 재고 현황 > 출하대기(창고 재고)
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate, rgDisplayDateTime1} = require('@/utils/dateUtils');

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
    //fixed: { colBarWidth: 1, colCount: 1 },
  },

  fields: [
    { fieldName: '상태', dataType: ValueType.TEXT },
    { fieldName: '모델', dataType: ValueType.TEXT },
    { fieldName: 'matCode', dataType: ValueType.TEXT },
    { fieldName: 'packNo', dataType: ValueType.TEXT },
    { fieldName: 'boxNo', dataType: ValueType.TEXT },
    { fieldName: 'cell수량', dataType: ValueType.NUMBER },
    { fieldName: '단위', dataType: ValueType.TEXT },
    { fieldName: 'packTime', dataType: ValueType.TEXT },
    { fieldName: 'si의뢰일자', dataType: ValueType.TEXT },
    { fieldName: '검사결과', dataType: ValueType.TEXT },
    { fieldName: 'palletNo', dataType: ValueType.TEXT },
    { fieldName: 'palletTime', dataType: ValueType.TEXT },
    { fieldName: '보관구역', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: '상태', fieldName: '상태', width: '150', mergeRule: { criteria: "value" }, header: { text: '상태' }, autoFilter: true, styleName: 'tl' },
    { name: '모델', fieldName: '모델', width: '80', mergeRule: { criteria: "value" }, header: { text: 'MODEL' }, autoFilter: true, styleName: 'tl' },
    { name: 'matCode', fieldName: 'matCode', width: '180', mergeRule: { criteria: "value" }, header: { text: 'MAT CODE' }, autoFilter: true, styleName: 'tl' },
    { name: 'palletNo', fieldName: 'palletNo', width: '150', mergeRule: { criteria: "value" }, header: { text: 'PALLET NO' }, autoFilter: true, styleName: 'tl' },
    { name: 'palletTime', fieldName: 'palletTime', width: '180', header: { text: 'PALLEET TIME' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    { name: 'packNo', fieldName: 'packNo', width: '280', header: { text: 'PACK NO' }, autoFilter: true, styleName: 'tl' },
    { name: 'boxNo', fieldName: 'boxNo', width: '280', header: { text: 'BOX NO' }, autoFilter: true, styleName: 'tl' },
    { name: 'cell수량', fieldName: 'cell수량', width: '50', header: { text: '수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: '단위', fieldName: '단위', width: '50', header: { text: '단위' }, autoFilter: true, styleName: 'tl' },
    { name: 'packTime', fieldName: 'packTime', width: '180', header: { text: 'PACK TIME' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    { name: 'si의뢰일자', fieldName: 'si의뢰일자', width: '180', header: { text: '출하검사의뢰일' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: '검사결과', fieldName: '검사결과', width: '80', header: { text: '검사결과' }, autoFilter: true, styleName: 'tl' },
    { name: '보관구역', fieldName: '보관구구역', width: '100', header: { text: '보관구역' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
