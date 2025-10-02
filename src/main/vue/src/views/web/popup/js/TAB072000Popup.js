/*
 * 카세트 관리 > 카세트 점검
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
    edit: { editable: true },
    footers: { visible: false },
    paste: { enabled: true },
    rowIndicator: { visible: false },
    sorting: { enabled: false },
    stateBar: { visible: false },
    filtering: { enabled: false },
  },

  fields: [
    { fieldName: '세정외관', dataType: ValueType.TEXT },
    { fieldName: '세정Bar위치', dataType: ValueType.TEXT },
    { fieldName: '세정평탄도바닥과Cst', dataType: ValueType.TEXT },
    { fieldName: '세정평탄도앞면옆면', dataType: ValueType.TEXT },
    { fieldName: '세정평탄도뒷면옆면', dataType: ValueType.TEXT },
  ],

  columns: [
    {
      name: '세정외관',
      fieldName: '세정외관',
      width: '80',
      header: { text: '외관' },
      values: ['적합', '부적합'],
      editor: {
        type: 'dropdown',
        domainOnly: true,
        dropDownWhenClick: true,
      },
      autoFilter: true,
      styleName: 'edit',
      editable: true,
    },
    {
      name: '세정Bar위치',
      fieldName: '세정Bar위치',
      width: '80',
      header: { text: 'Bar위치' },
      values: ['적합', '부적합'],
      editor: {
        type: 'dropdown',
        domainOnly: true,
        dropDownWhenClick: true,
      },
      autoFilter: true,
      styleName: 'edit',
      editable: true,
    },
    {
      name: '세정평탄도바닥과Cst',
      fieldName: '세정평탄도바닥과Cst',
      width: '80',
      header: { text: '평탄도(바닥,CST)' },
      values: ['적합', '부적합'],
      editor: {
        type: 'dropdown',
        domainOnly: true,
        dropDownWhenClick: true,
      },
      autoFilter: true,
      styleName: 'edit',
      editable: true,
    },
    {
      name: '세정평탄도앞면옆면',
      fieldName: '세정평탄도앞면옆면',
      width: '80',
      header: { text: '평탄도(앞,옆)' },
      values: ['적합', '부적합'],
      editor: {
        type: 'dropdown',
        domainOnly: true,
        dropDownWhenClick: true,
      },
      autoFilter: true,
      styleName: 'edit',
      editable: true,
    },
    {
      name: '세정평탄도뒷면옆면',
      fieldName: '세정평탄도뒷면옆면',
      width: '80',
      header: { text: '평탄도(뒷,옆)' },
      values: ['적합', '부적합'],
      editor: {
        type: 'dropdown',
        domainOnly: true,
        dropDownWhenClick: true,
      },
      autoFilter: true,
      styleName: 'edit',
      editable: true,
    },
  ],
};

module.exports = grid;
