/*
 * 자재관리 > 자재 마스터
 */
const { ValueType } = require('realgrid');

const grid = {
  options: {
    checkBar: { visible: true, showAll: false },
    copy: { enabled: true, singleMode: false },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: 'NONE',
      hscrollBar: true,
      showEmptyMessage: true,
    },
    hideDeletedRows: true,
    edit: { editable: true },
    footers: { visible: false },
    paste: { enabled: true, checkReadOnly: true },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colBarWidth: 1, colCount: 1 },
  },

  fields: [
    { fieldName: '자재코드', dataType: ValueType.TEXT },
    { fieldName: '호환코드', dataType: ValueType.TEXT },
    { fieldName: '자재품명', dataType: ValueType.TEXT },
    { fieldName: 'pCode', dataType: ValueType.TEXT },
    { fieldName: '자재재질', dataType: ValueType.TEXT },
    { fieldName: '자재두께', dataType: ValueType.TEXT },
    { fieldName: '자재규격', dataType: ValueType.TEXT },
    { fieldName: '자재단위', dataType: ValueType.TEXT },
    { fieldName: '단가', dataType: ValueType.NUMBER },
    { fieldName: '공급단위', dataType: ValueType.NUMBER },
    { fieldName: '사용량Cell', dataType: ValueType.NUMBER },
    { fieldName: '사용처', dataType: ValueType.TEXT },
    { fieldName: '납기', dataType: ValueType.TEXT },
    { fieldName: '매입처', dataType: ValueType.TEXT },
    { fieldName: '비고', dataType: ValueType.TEXT },
    { fieldName: '사용여부', dataType: ValueType.NUMBER },
  ],

  columns: [
    {
      name: '자재코드',
      fieldName: '자재코드',
      width: '120',
      header: { text: '자재코드' },
      autoFilter: true,
      styleName: 'tl',
      editable: false,
      styleCallback: function (grid, dataCell) {
        var ret = {};

        if (dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting') {
          ret.editable = true;
          ret.styleName = 'edit tl';
        } else {
          ret.editable = false;
          ret.styleName = 'tl';
        }

        return ret;
      },
    },
    { name: '호환코드', fieldName: '호환코드', width: '120', header: { text: '호환코드' }, autoFilter: true, styleName: 'edit tl' },
    { name: '자재품명', fieldName: '자재품명', width: '200', header: { text: '자재품명' }, autoFilter: true, styleName: 'edit tl' },
    { name: 'pCode', fieldName: 'pCode', width: '100', header: { text: 'P_CODE' }, autoFilter: true, styleName: 'edit tl' },
    {
      name: '자재재질',
      fieldName: '자재재질',
      width: '100',
      header: { text: '자재재질' },
      autoFilter: true,
      styleName: 'edit tl',
      // editor: {
      //   type: 'dropdown',
      //   domainOnly: false, //*** dropdown 목록에 있는 값만 허용하고자 할때
      //   dropDownWhenClick: true, //셀을 클릭해도 dropdown 목록이 펼쳐지길 원할때
      // },
    },
    {
      name: '자재두께',
      fieldName: '자재두께',
      width: '100',
      header: { text: '자재두께' },
      autoFilter: true,
      styleName: 'edit tl',
      // editor: {
      //   type: 'dropdown',
      //   domainOnly: false, //*** dropdown 목록에 있는 값만 허용하고자 할때
      //   dropDownWhenClick: true, //셀을 클릭해도 dropdown 목록이 펼쳐지길 원할때
      // },
    },
    {
      name: '자재규격',
      fieldName: '자재규격',
      width: '200',
      header: { text: '자재규격' },
      autoFilter: true,
      styleName: 'edit tl',
      // editor: {
      //   type: 'dropdown',
      //   domainOnly: false, //*** dropdown 목록에 있는 값만 허용하고자 할때
      //   dropDownWhenClick: true, //셀을 클릭해도 dropdown 목록이 펼쳐지길 원할때
      // },
    },
    {
      name: '자재단위',
      fieldName: '자재단위',
      width: '100',
      header: { text: '자재단위' },
      autoFilter: true,
      styleName: 'edit tl',
      // editor: {
      //   type: 'dropdown',
      //   domainOnly: false, //*** dropdown 목록에 있는 값만 허용하고자 할때
      //   dropDownWhenClick: true, //셀을 클릭해도 dropdown 목록이 펼쳐지길 원할때
      // },
    },
    {
      name: '단가',
      fieldName: '단가',
      width: '80',
      header: { text: '단가' },
      autoFilter: true,
      numberFormat: '#,###.###',
      styleName: 'edit tr',
      editor: {
        type: 'number',
      },
    },
    {
      name: '공급단위',
      fieldName: '공급단위',
      width: '100',
      header: { text: '공급단위' },
      autoFilter: true,
      numberFormat: '#,###.###',
      styleName: 'edit tr',
      editor: {
        type: 'number',
      },
    },
    {
      name: '사용량Cell',
      fieldName: '사용량Cell',
      width: '100',
      header: { text: '사용량_cell' },
      autoFilter: true,
      numberFormat: '#,###.###',
      styleName: 'edit tr',
      editor: {
        type: 'number',
      },
    },
    { name: '사용처', fieldName: '사용처', width: '90', header: { text: '사용처' }, autoFilter: true, styleName: 'edit tl' },
    { name: '납기', fieldName: '납기', width: '80', header: { text: '납기' }, autoFilter: true, styleName: 'edit tl' },
    {
      name: '매입처',
      fieldName: '매입처',
      width: '90',
      header: { text: '매입처' },
      autoFilter: true,
      styleName: 'edit tl',
      // editor: {
      //   type: 'dropdown',
      //   domainOnly: false, //*** dropdown 목록에 있는 값만 허용하고자 할때
      //   dropDownWhenClick: true, //셀을 클릭해도 dropdown 목록이 펼쳐지길 원할때
      // },
    },
    { name: '비고', fieldName: '비고', width: '150', header: { text: '비고' }, autoFilter: true, styleName: 'edit tl' },
    { name: '사용여부', fieldName: '사용여부', width: '80', header: { text: '사용여부' }, autoFilter: true, styleName: 'tc', renderer: { type: 'check' }, editable: false },
  ],
};

module.exports = grid;
