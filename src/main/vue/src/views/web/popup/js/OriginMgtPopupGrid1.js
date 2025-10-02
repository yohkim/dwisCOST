/*
 * 내포장 ORIGIN 수량 수정
 */
const { ValueType } = require('realgrid');

const grid = {
  options: {
    checkBar: { visible: false },
    copy: { enabled: true, singleMode: false },
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
    sorting: { enabled: false },
    stateBar: { visible: false },
    filtering: { enabled: false },
  },

  fields: [
    { fieldName: 'cellId', dataType: ValueType.TEXT },
  ],

  columns: [
    {
      name: 'cellId',
      fieldName: 'cellId',
      width: '260',
      header: { text: 'CELL NO' },
      editable: true,
    },
  ],
};

module.exports = grid;
