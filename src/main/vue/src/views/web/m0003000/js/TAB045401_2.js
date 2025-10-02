/*
 * 포장/출하 > 출하 대기 > Pallet 목록
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate } = require('@/utils/dateUtils');

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
    fixed: { colBarWidth: 1, colCount: 1 },
  },

  fields: [
    { fieldName: 'palletNo', dataType: ValueType.TEXT },
    { fieldName: '대포장Qrno', dataType: ValueType.TEXT },
    { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: 'code', dataType: ValueType.TEXT },
    { fieldName: '수량', dataType: ValueType.NUMBER },
    { fieldName: '검사결과', dataType: ValueType.TEXT },
    { fieldName: 'si의뢰일자', dataType: ValueType.TEXT },
    { fieldName: 'cell수량', dataType: ValueType.NUMBER },
  ],

  columns: [
    { name: 'palletNo', fieldName: 'palletNo', width: '160', header: { text: 'pallet_no' }, autoFilter: true, styleName: 'tl' },
    { name: '대포장Qrno', fieldName: '대포장Qrno', width: '220', header: { text: '대포장_QRNO' }, autoFilter: true, styleName: 'tl' },
    { name: 'model', fieldName: 'model', width: '80', header: { text: 'model' }, autoFilter: true, styleName: 'tl' },
    { name: 'code', fieldName: 'code', width: '80', header: { text: 'Code' }, autoFilter: true, styleName: 'tl' },
    { name: '수량', fieldName: '수량', width: '80', header: { text: '수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: '검사결과', fieldName: '검사결과', width: '80', header: { text: '검사결과' }, autoFilter: true, styleName: 'tl' },
    { name: 'si의뢰일자', fieldName: 'si의뢰일자', width: '80', header: { text: 'SI_의뢰일자' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: 'cell수량', fieldName: 'cell수량', width: '80', header: { text: 'cell수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
  ],
};

module.exports = grid;
