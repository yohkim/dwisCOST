/*
 * 포장/출하 > 출하
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate } = require('@/utils/dateUtils');

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
    edit: { editable: true },
    footers: { visible: false },
    paste: { enabled: true, commitEdit: true, enableAppend: true },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colBarWidth: 1, colCount: 2 },
  },

  fields: [
    { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: 'code', dataType: ValueType.TEXT },
    { fieldName: 'palletNo', dataType: ValueType.TEXT },
    { fieldName: 'cell수량', dataType: ValueType.NUMBER },
    { fieldName: '생산계획번호', dataType: ValueType.TEXT },
    { fieldName: '출하작업시각', dataType: ValueType.TEXT },
    { fieldName: '상태', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'model', fieldName: 'model', width: '80', header: { text: 'Mode' }, editable: false, autoFilter: true, styleName: 'tl' },
    { name: 'code', fieldName: 'code', width: '100', header: { text: 'Code' }, editable: false, autoFilter: true, styleName: 'tl' },
    { name: 'palletNo', fieldName: 'palletNo', width: '120', header: { text: 'Pallet No.' }, autoFilter: true, styleName: 'edit tl' },
    { name: 'cell수량', fieldName: 'cell수량', width: '80', header: { text: '수량' }, numberFormat: '#,###.###', editable: false, autoFilter: true, styleName: 'tl' },
    { name: '생산계획번호', fieldName: '생산계획번호', width: '120', header: { text: '생산 계획 번호(ERP)' }, autoFilter: true, styleName: 'edit tl' },
    { name: '출하작업시각', fieldName: '출하작업시각', width: '80', header: { text: '출하일' }, editable: false, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDate },
    {
      name: '상태',
      fieldName: '상태',
      width: '80',
      header: { text: '상태' },
      editable: false,
      autoFilter: true,
      styleName: 'tl',
      styleCallback: (grid, dataCell) => {
        if (dataCell.value === 'HOLD' || dataCell.value === 'NG') {
          return { styleName: 'red', editable: false };
        }
      },
    },
  ],
};

module.exports = grid;
