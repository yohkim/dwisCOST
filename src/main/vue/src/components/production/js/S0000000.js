/*
 * empty log
 */
const { ValueType } = require('realgrid');

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
  },

  fields: [],

  columns: [],
};

module.exports = grid;
