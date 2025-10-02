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
    { fieldName: '일치여부', dataType: ValueType.TEXT },
    { fieldName: 'runId', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'packQrno', fieldName: 'packQrno', width: '220', header: { text: 'Pack No.(확인)' }, editable: true, styleName: 'edit tl' },
    { name: '일치여부', fieldName: '일치여부', width: '90', header: { text: '일치여부' }, editable: false, styleName: 'tl' },
    { name: 'runId', fieldName: 'runId', width: '90', header: { text: 'RUN NO' }, editable: false, styleName: 'tl' },
  ],
};

module.exports = grid;
