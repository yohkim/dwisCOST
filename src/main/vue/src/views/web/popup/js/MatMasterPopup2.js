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
    { fieldName: '거래처코드', dataType: ValueType.TEXT },
    { fieldName: '거래처명', dataType: ValueType.TEXT },
    { fieldName: '거래처약명', dataType: ValueType.TEXT },
    { fieldName: '대표자', dataType: ValueType.TEXT },
    { fieldName: '사업자등록번호', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: '거래처코드', fieldName: '거래처코드', width: '80', header: { text: '코드' }, sortable: true },
    { name: '거래처명', fieldName: '거래처명', width: '180', header: { text: '거래처명' }, sortable: true },
    { name: '거래처약명', fieldName: '거래처약명', width: '120', header: { text: '약명' }, sortable: true },
    { name: '대표자', fieldName: '대표자', width: '70', header: { text: '대표자' }, sortable: true },
    { name: '사업자등록번호', fieldName: '사업자등록번호', width: '100', header: { text: '사업자번호' }, sortable: true },
  ],
};

module.exports = grid;
