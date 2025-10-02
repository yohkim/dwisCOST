/*
 * 자재마스터 팝업
 */
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');

const grid = {
  options: {
    checkBar: { visible: true, exclusive: true },
    copy: { enabled: true, singleMode: true },
    display: {
      columnMovable: false,
      editItemMerging: false,
      selectionStyle: SelectionStyle.ROWS,
      selectionMode: SelectionMode.SINGLE,
      fitStyle: GridFitStyle.EVEN_FILL,
    },
    edit: { editable: false },
    footer: { visible: false },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },
  },

  fields: [
    { fieldName: 'majCode', dataType: ValueType.TEXT },
    { fieldName: 'code', dataType: ValueType.TEXT },
    { fieldName: 'codeName', dataType: ValueType.TEXT },
    { fieldName: 'useYn', dataType: ValueType.BOOLEAN },
  ],

  columns: [
    { name: 'majCode', fieldName: 'majCode', width: '200', header: { text: '대분류' }, sortable: false, autoFilter: true },
    { name: 'code', fieldName: 'code', width: '200', header: { text: '코드' }, sortable: true, autoFilter: true },
    { name: 'codeName', fieldName: 'codeName', width: '500', header: { text: '코드명' }, autoFilter: true },
    {
      name: 'useYn',
      fieldName: 'useYn',
      width: '140',
      header: { text: '사용여부' },
      sortable: false,
      autoFilter: true,
      renderer: {
        type: 'check',
        editable: true,
        trueValues: '1',
        falseValues: '0',
      },
    },
  ],
};

module.exports = grid;
