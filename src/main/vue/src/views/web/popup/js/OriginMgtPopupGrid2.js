/*
 * 내포장 ORIGIN 수량 수정
 */
const { ValueType } = require('realgrid');

const grid = {
  options: {
    checkBar: { visible: true },
    copy: { enabled: true, singleMode: false },
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
    filtering: { enabled: false },
  },

  fields: [
    { fieldName: 'cellId', dataType: ValueType.TEXT },
    { fieldName: 'remark', dataType: ValueType.TEXT },
  ],

  columns: [
    {
      name: 'cellId',
      fieldName: 'cellId',
      width: '260',
      header: { text: 'CELL NO' },
      editable: true,
      styleCallback: function (grid, dataCell) {
        var ret = {};

        if (dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting') {
          ret.editable = true;
          ret.styleName = 'edit';
        } else {
          ret.editable = false;
        }

        return ret;
      },
    },
    {
      name: 'remark',
      fieldName: 'remark',
      width: '80',
      header: { text: '삭제이유' },
      editor: {
        type: 'dropdown',
        domainOnly: true, //*** dropdown 목록에 있는 값만 허용하고자 할때
        dropDownWhenClick: true, //셀을 클릭해도 dropdown 목록이 펼쳐지길 원할때
      },
      styleCallback: function (grid, dataCell) {
        var ret = {};

        if (dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting') {
          ret.editable = true;
          ret.styleName = 'edit';
        } else {
          ret.editable = false;
        }

        return ret;
      },
    },
  ],
};

module.exports = grid;
