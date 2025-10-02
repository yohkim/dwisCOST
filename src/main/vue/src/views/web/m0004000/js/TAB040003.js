/*
 * 제조 실적 관리 > LotNo 변경 관리 > LotNo 변경이력 조회
 */
const { ValueType } = require('realgrid');

const grid = {
  options: {
    checkBar: { visible: false, exclusive: false },
    copy: { enabled: true, singleMode: false, datetimeFormat: 'yyyy-MM-dd' },
    display: { columnMovable: false, editItemMerging: true, fitStyle: 'evenFill' },
    edit: { editable: true, commitByCell: true, enterToNextRow: true, enterToTab: true, enterToNextCell: false },
    footer: { visible: false },
    header: { height: 25 },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },
  },

  fields: [
    { fieldName: '공장코드', dataType: ValueType.TEXT },
    { fieldName: '변경일자', dataType: ValueType.DATE },
    { fieldName: '구lotNo', dataType: ValueType.TEXT },
    { fieldName: '신lotNo', dataType: ValueType.TEXT },
    { fieldName: '처리수량', dataType: ValueType.TEXT },
    { fieldName: '담당자', dataType: ValueType.TEXT },
    { fieldName: '처리여부', dataType: ValueType.TEXT },
    { fieldName: '변환사유', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: '구lotNo', fieldName: '구lotNo', width: '200', header: { text: '구lotNo' }, editable: false, autoFilter: true, styleName: 'tl' },
    { name: '신lotNo', fieldName: '신lotNo', width: '200', header: { text: '신lotNo' }, editable: false, autoFilter: true, styleName: 'tl' },
    { name: '처리수량', fieldName: '처리수량', width: '150', header: { text: '수량' }, editable: false, autoFilter: true, styleName: 'tl' },
    { name: '변경일자', fieldName: '변경일자', width: '100', header: { text: '처리일자' }, editable: false, type: 'datetime', datetimeFormat: 'yyyy-MM-dd', autoFilter: true, styleName: 'tl' },
    { name: '담당자', fieldName: '담당자', width: '150', header: { text: '담당자' }, editable: false, autoFilter: true, styleName: 'tl' },
    { name: '변환사유', fieldName: '변환사유', width: '400', header: { text: '변환사유' }, autoFilter: true, styleName: 'tl' },
    {
      name: '처리여부',
      fieldName: '처리여부',
      width: '100',
      header: { text: '처리여부' },
      autoFilter: true,
      renderer: {
        type: 'check',
        trueValues: '1',
        falseValues: '0',
      },
    },
  ],
};

module.exports = grid;
