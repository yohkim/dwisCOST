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
    { fieldName: '강화브라켓지그일치유무', dataType: ValueType.TEXT },
    { fieldName: '강화슬롯상태', dataType: ValueType.TEXT },
    { fieldName: '강화Mesh올상태', dataType: ValueType.TEXT },
    { fieldName: '강화Mesh들뜸', dataType: ValueType.TEXT },
    { fieldName: '강화볼트체결', dataType: ValueType.TEXT },
    { fieldName: '강화외관', dataType: ValueType.TEXT },
  ],

  columns: [
    {
      name: '강화브라켓지그일치유무',
      fieldName: '강화브라켓지그일치유무',
      width: '200',
      header: { text: '브라켓지그일치유무' },
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
      name: '강화슬롯상태',
      fieldName: '강화슬롯상태',
      width: '100',
      header: { text: '슬롯상태' },
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
      name: '강화Mesh올상태',
      fieldName: '강화Mesh올상태',
      width: '120',
      header: { text: 'Mesh올상태' },
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
      name: '강화Mesh들뜸',
      fieldName: '강화Mesh들뜸',
      width: '110',
      header: { text: 'Mesh들뜸' },
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
      name: '강화볼트체결',
      fieldName: '강화볼트체결',
      width: '110',
      header: { text: '볼트체결' },
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
      name: '강화외관',
      fieldName: '강화외관',
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
  ],
};

module.exports = grid;
