/*
 * 카세트 관리 > 카세트 마스터 > 카세트 마스터 > 카세트 상태 변경 팝업
 */
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');
const grid = {
  dataProvider: null,
  gridView: null,
  options: {
    checkBar: { visible: false },
    copy: { enabled: true, singleMode: false },
    //dataDrop: {},
    display: {
      columnMovable: false,
      editItemMerging: false,
      selectionStyle: SelectionStyle.BLOCK,
      selectionMode: SelectionMode.EXTENDED,
      fitStyle: GridFitStyle.EVEN_FILL,
    },
    edit: { editable: true },
    //editor: {},
    //filtering: {},
    //filterMode: {},
    //filterPanel: {},
    //fixed: {},
    footer: { visible: false },
    //footers: {},
    //format: {},
    header: { height: 25 },
    //headerSummaries: {},
    //headerSummary: {},
    //hideDeletedRows: {},
    paste: { enabled: true, eventEachRow: true },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    //sortMode: {},
    stateBar: { visible: true },
    //summaryMode: {},
  },

  fields: [
    { fieldName: 'cstNo', dataType: ValueType.TEXT },
    { fieldName: '카세트상태', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'cstNo', fieldName: 'cstNo', width: '80', header: { text: 'CST_NO' }, styleName: 'tl' },
    { name: '카세트상태', fieldName: '카세트상태', width: '90', header: { text: '카세트상태' }, editable: false, styleName: 'tl' },
  ],
};
module.exports = grid;
