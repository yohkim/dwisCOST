/*
 * 제조 실적 관리 > LotNo 변경 관리 > LotNo 변경
 */
const { ValueType } = require('realgrid');

const grid = {
  options: {
    checkBar: { visible: true, exclusive: false },
    copy: { enabled: true, singleMode: false, datetimeFormat: 'yyyy-MM-dd' },
    display: { columnMovable: false, editItemMerging: true, fitStyle: 'evenFill' },
    edit: { editable: true, commitByCell: true, enterToNextRow: true, enterToTab: true, enterToNextCell: false },
    hideDeletedRows: true,
    footer: { visible: false },
    header: { height: 25 },
    paste: { enabled: true, checkReadOnly: true, eventEachRow: true },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },
  },

  fields: [
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: '구lotNo', dataType: ValueType.TEXT },
    { fieldName: 'poNo', dataType: ValueType.TEXT },
    { fieldName: '신lotNo', dataType: ValueType.TEXT },
    { fieldName: '처리수량', dataType: ValueType.TEXT },
    { fieldName: '변경일자', dataType: ValueType.DATE },
    { fieldName: 'Lot변경가능여부', dataType: ValueType.TEXT },
    { fieldName: '담당자', dataType: ValueType.TEXT },
    { fieldName: '변환사유', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: '공정코드', fieldName: '공정코드', width: '100', header: { text: '공정코드' }, visible: true, readOnly: true, editable: false, autoFilter: true, styleName: 'tl' },
    { name: '구lotNo', fieldName: '구lotNo', width: '200', header: { text: '구lotNo' }, editable: true, autoFilter: true, styleName: 'edit tl' },
    { name: 'poNo', fieldName: 'poNo', width: '200', header: { text: 'PO_NO' }, readonly: true, editable: false, autoFilter: true, styleName: 'tl' },
    { name: '신lotNo', fieldName: '신lotNo', width: '200', header: { text: '신lotNo' }, editable: true, autoFilter: true, styleName: 'edit tl' },
    { name: '처리수량', fieldName: '처리수량', width: '150', header: { text: '수량' }, readOnly: true, editable: false, autoFilter: true, styleName: 'tl' },
    { name: '변경일자', fieldName: '변경일자', width: '100', header: { text: '처리일자' }, readOnly: true, editable: false, type: 'datetime', datetimeFormat: 'yyyy-MM-dd', autoFilter: true, styleName: 'tl' },
    { name: 'Lot변경가능여부', fieldName: 'Lot변경가능여부', width: '200', header: { text: 'Lot변경가능여부' }, width: 160, readOnly: true, editable: false, autoFilter: true, styleName: 'tl' },
    { name: '담당자', fieldName: '담당자', width: '150', header: { text: '담당자' }, readOnly: true, editable: false, autoFilter: true, styleName: 'tl' },
    { name: '변환사유', fieldName: '변환사유', width: '400', header: { text: '변환사유' }, width: 300, autoFilter: true, styleName: 'edit tl' },
  ],
};

module.exports = grid;
