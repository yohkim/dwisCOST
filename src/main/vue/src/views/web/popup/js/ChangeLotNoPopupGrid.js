/*
 * LotNo 변경 관리 > LotNo 변경 > 1.구LotNo 리스트 불러오기
 */
const { ValueType, GridFitStyle } = require('realgrid');
const grid = {
  options: {
    checkBar: { visible: true },
    copy: { enabled: true, singleMode: false },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: GridFitStyle.EVEN_FILL,
      hscrollBar: true,
      showEmptyMessage: true,
    },
    edit: { editable: false },
    footers: { visible: false },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },
    filtering: { enabled: false },
  },
  fields: [
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: 'lotNo', dataType: ValueType.TEXT },
  ],
  columns: [
    { name: '공정코드', fieldName: '공정코드', width: '0', header: { text: '공정코드' }, visible: false, styleName: 'tl' },
    { name: 'lotNo', fieldName: 'lotNo', width: '180', header: { text: '구LotNo' }, styleName: 'tl' },
  ],
};
module.exports = grid;
