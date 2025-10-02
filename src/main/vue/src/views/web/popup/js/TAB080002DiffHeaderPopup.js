/*
 * 품질검사 > 공정모니터링 > 검사의뢰(제조)
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
    { fieldName: '판정1', dataType: ValueType.TEXT },
    { fieldName: '판정2', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
  ],

  columns: [
    {
      name: '판정1',
      fieldName: '판정1',
      width: '80',
      header: { text: '전면판정' },
      values: ['PASS', 'NG'],
      editor: {
        type: 'dropdown',
        domainOnly: true, //*** dropdown 목록에 있는 값만 허용하고자 할때
        dropDownWhenClick: true, //셀을 클릭해도 dropdown 목록이 펼쳐지길 원할때
      },
      autoFilter: true,
      styleName: 'edit',
      editable: true,
    },
    {
      name: '판정2',
      fieldName: '판정2',
      width: '80',
      header: { text: '배면판정' },
      values: ['PASS', 'NG'],
      editor: {
        type: 'dropdown',
        domainOnly: true, //*** dropdown 목록에 있는 값만 허용하고자 할때
        dropDownWhenClick: true, //셀을 클릭해도 dropdown 목록이 펼쳐지길 원할때
      },
      autoFilter: true,
      styleName: 'edit',
      editable: true,
    },
    { name: '특이사항', fieldName: '특이사항', width: '120', header: { text: '특이사항' }, autoFilter: true, styleName: 'edit', editable: true },
  ],
};

module.exports = grid;
