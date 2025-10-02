/*
 * 포장/출하 > 재고 현황
 */
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');

const grid = {
  options: {
    checkBar: { visible: false },
    copy: { enabled: true, singleMode: false },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      hscrollBar: true,
      showEmptyMessage: true,
      selectionStyle: SelectionStyle.BLOCK,
      selectionMode: SelectionMode.EXTENDED,
      fitStyle: 'NONE' , //GridFitStyle.EVEN_FILL
    },
    edit: { editable: false },
    footers: { visible: false },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colCount: 2 },
  },

  fields: [
    { fieldName: '상태', dataType: ValueType.TEXT },
    // { fieldName: '구분', dataType: ValueType.TEXT },
  ],

  columns: [
    {
      name: '상태',
      fieldName: '상태',
      width: '170',
      header: { text: '상태' },
      autoFilter: false,
      styleName: 'tl',
      mergeRule: {
        criteria: 'value',
      },
      mergeEdit: true, //*** 해당 속성 true
    },
    // { name: '구분', fieldName: '구분', width: '80', header: { text: '구분' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
