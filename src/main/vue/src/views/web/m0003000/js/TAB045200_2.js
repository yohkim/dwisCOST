/*
 * 포장/출하 > 출하 대기 > 출하 검사 의뢰 Cell
 */
const { ValueType } = require('realgrid');
const { rgDisplayTime3 } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: false },
    copy: { enabled: true, singleMode: false },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: 'NONE',
      hscrollBar: true,
      showEmptyMessage: true,
    },
    edit: { editable: true },
    footers: { visible: false },
    paste: { enabled: true,eventEachRow:true },
    rowIndicator: { visible: true },
    sorting: { enabled: false },
    stateBar: { visible: false },
    filtering: { enabled: true },
   // fixed: { colBarWidth: 1, colCount: 5 },
  },

  fields: [
    { fieldName: 'pack상태', dataType: ValueType.TEXT },
    { fieldName: '구분', dataType: ValueType.TEXT },
    { fieldName: '작업구분', dataType: ValueType.TEXT },
    { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: 'packqrno', dataType: ValueType.TEXT },
    { fieldName: '수량', dataType: ValueType.NUMBER },
    { fieldName: 'runid', dataType: ValueType.TEXT },
    { fieldName: 'packdate', dataType: ValueType.TEXT },
    { fieldName: '작업자', dataType: ValueType.TEXT },
    { fieldName: '외관검사', dataType: ValueType.TEXT },
    { fieldName: 'agb', dataType: ValueType.TEXT },
    { fieldName: 'pfl', dataType: ValueType.TEXT },
    { fieldName: 'eci', dataType: ValueType.TEXT },
    { fieldName: '비고', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'pack상태', fieldName: 'pack상태', width: '100', header: { text: 'PACK상태' }, autoFilter: true, editable: false },
    { name: '구분', fieldName: '구분', width: '140', header: { text: '구분' }, autoFilter: true, editable: false },
    { name: '작업구분', fieldName: '작업구분', width: '100', header: { text: '작업구분' }, autoFilter: true, editable: false },
    { name: 'model', fieldName: 'model', width: '100', header: { text: 'MODEL' }, autoFilter: true, editable: false },
    { name: 'packqrno', fieldName: 'packqrno', width: '270', header: { text: 'PACK_QRNO' }, autoFilter: true, editable: true, styleName: 'edit' },
    { name: '수량', fieldName: '수량', width: '80', header: { text: '수량' }, autoFilter: true, numberFormat: '#,###.###', editable: false },
    { name: 'runid', fieldName: 'runid', width: '140', header: { text: 'RUN_ID' }, autoFilter: true, editable: false },
    { name: 'packdate', fieldName: 'packdate', width: '150', header: { text: 'Pack Date' }, autoFilter: true, editable: false }, //, displayCallback: rgDisplayDateTime1
    { name: '작업자', fieldName: '작업자', width: '110', header: { text: '작업자' }, autoFilter: true, editable: false },
    { name: '외관검사', fieldName: '외관검사', width: '130', header: { text: '외관검사' }, autoFilter: true, editable: false },
    { name: 'agb', fieldName: 'agb', width: '100', header: { text: 'AGB' }, autoFilter: true, editable: false },
    { name: 'pfl', fieldName: 'pfl', width: '100', header: { text: 'PFL' }, autoFilter: true, editable: false },
    { name: 'eci', fieldName: 'eci', width: '100', header: { text: 'ECI' }, autoFilter: true, editable: false },
    { name: '비고', fieldName: '비고', width: '100', header: { text: '비고' }, autoFilter: true, editable: false },
    { name: '특이사항', fieldName: '특이사항', width: '100', header: { text: '특이사항' },styleName:"edit", visible: false, placeHolder: '출하대기 특이사항 입력'},
  ],
};

module.exports = grid;
