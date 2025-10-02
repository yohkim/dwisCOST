/*
 * 포장/출하 > 출하 대기 > Pallet 구성
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
    edit: { editable: true },
    footers: { visible: false },
    paste: { enabled: true },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colBarWidth: 1, colCount: 3 },
  },

  fields: [
    { fieldName: 'palletNo', dataType: ValueType.TEXT },
    { fieldName: 'packQrno', dataType: ValueType.TEXT },
    { fieldName: '대포장Qrno', dataType: ValueType.TEXT },
    { fieldName: '검사결과', dataType: ValueType.TEXT },
    { fieldName: 'NG사유', dataType: ValueType.TEXT },
    { fieldName: 'si의뢰일자', dataType: ValueType.TEXT },
    { fieldName: 'boxno검증', dataType: ValueType.TEXT },
    { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: 'cell수량', dataType: ValueType.NUMBER },
  ],

  columns: [
    { name: 'palletNo', fieldName: 'palletNo', width: '180', header: { text: 'Pallet No.' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: 'packQrno', fieldName: 'packQrno', width: '270', header: { text: 'Pack No.' }, autoFilter: true, editable: true, styleName: 'edit tl' },
    { name: '대포장Qrno', fieldName: '대포장Qrno', width: '270', header: { text: 'Box No.' }, autoFilter: true, editable: true, styleName: 'edit tl' },
    { name: 'cell수량', fieldName: 'cell수량', width: '120', header: { text: 'cell수량' }, autoFilter: true, numberFormat: '#,###.###', editable: false, styleName: 'tr' },
    { name: 'si의뢰일자', fieldName: 'si의뢰일자', width: '170', header: { text: 'SI_의뢰일자' }, autoFilter: true, editable: false, styleName: 'tl', displayCallback: rgDisplayDate },
    { name: '검사결과', fieldName: '검사결과', width: '140', header: { text: '검사결과' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: 'NG사유', fieldName: 'NG사유', width: '140', header: { text: 'NG사유' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: 'boxno검증', fieldName: 'boxno검증', width: '140', header: { text: 'BoxNo_검증' }, autoFilter: true, editable: false, styleName: 'tl' },
    { name: 'model', fieldName: 'model', width: '100', header: { text: 'Model' }, autoFilter: true, editable: false, styleName: 'tl' },
  ],
};

module.exports = grid;
