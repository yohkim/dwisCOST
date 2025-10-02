/*
 * 카세트 관리 > 카세트 불출 > ?? 카세트 > 검사 진행
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
    { fieldName: '검사결과', dataType: ValueType.TEXT },
  ],

  columns: [
    {
      name: '검사결과',
      fieldName: '검사결과',
      width: '80',
      header: { text: '검사결과' },
      values: ['OK', 'NG'],
      editor: {
        type: 'dropdown',
        domainOnly: true, //*** dropdown 목록에 있는 값만 허용하고자 할때
        dropDownWhenClick: true, //셀을 클릭해도 dropdown 목록이 펼쳐지길 원할때
      },
      styleName: 'edit',
      editable: true,
    },
  ],
};

module.exports = grid;
