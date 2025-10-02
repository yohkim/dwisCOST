/*
 * 포장/출하 > 출하 검사> 출하검사 SAMPLE PACK 인계
 */
const { ValueType } = require('realgrid');
const { rgDisplayDateTime1 } = require('@/utils/dateUtils');

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
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },
    filtering: { enabled: false },
  },

  fields: [
    { fieldName: 'packQrno', dataType: ValueType.TEXT },
    { fieldName: 'pack상태', dataType: ValueType.TEXT },
    { fieldName: '수량', dataType: ValueType.NUMBER },
    { fieldName: 'runid', dataType: ValueType.TEXT },
    { fieldName: '비고', dataType: ValueType.TEXT },
    { fieldName: 'gubun', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'packQrno', fieldName: 'packQrno', width: '180', header: { text: 'Pack No.(확인)' }, editable: true, styleName: 'edit tl' },
    { name: 'pack상태', fieldName: 'pack상태', width: '50', header: { text: 'PACK상태' }, editable: false, styleName: 'tl' , visible: false},
    { name: '수량', fieldName: '수량', width: '50', header: { text: '수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'runid', fieldName: 'runid', width: '90', header: { text: 'RUN NO' }, editable: false, styleName: 'tl' },
    { name: '비고', fieldName: '비고', width: '250', header: { text: '특이사항' }, editable: false, styleName: 'tl', renderer: { showTooltip:true }, },
    { name: 'gubun', fieldName: 'gubun', width: '100', header: { text: 'gubun' }, autoFilter: true, visible: false, editable: false, styleName: 'tl' },
  ],
};

module.exports = grid;
