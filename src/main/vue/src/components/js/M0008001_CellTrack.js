/*
 * 품질검사 > 공정모니터링 > 검사의뢰(제조)
 */
const { ValueType } = require('realgrid');
const { rgDisplayDateTime } = require('@/utils/dateUtils');

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
    edit: { editable: false, commitByCell: true },
    footers: { visible: false },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colBarWidth: 1, colCount: 1 },
  },

  fields: [
    { fieldName: 'cellId', dataType: ValueType.TEXT },
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: '공정명', dataType: ValueType.TEXT },
    { fieldName: 'machinCode', dataType: ValueType.TEXT },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
    { fieldName: 'chamber', dataType: ValueType.TEXT },
    { fieldName: 'startTime', dataType: ValueType.TEXT },
    { fieldName: 'endTime', dataType: ValueType.TEXT },
    { fieldName: 'poNo', dataType: ValueType.TEXT },
    { fieldName: 'runId', dataType: ValueType.TEXT },
    { fieldName: 'lotNo', dataType: ValueType.TEXT },
    { fieldName: 'fromCstno', dataType: ValueType.TEXT },
    { fieldName: 'fromCst행렬', dataType: ValueType.TEXT },
    { fieldName: 'toCstno', dataType: ValueType.TEXT },
    { fieldName: 'toCst행렬', dataType: ValueType.TEXT },
    { fieldName: 'panelId', dataType: ValueType.TEXT },
    { fieldName: 'resinId', dataType: ValueType.TEXT },
    { fieldName: 'filmId상부', dataType: ValueType.TEXT },
    { fieldName: 'filmId하부', dataType: ValueType.TEXT },
    { fieldName: 'trayId', dataType: ValueType.TEXT },
    { fieldName: 'packNo', dataType: ValueType.TEXT },
    { fieldName: 'palletNo', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'cellId', fieldName: 'cellId', width: '220', header: { text: 'Cell ID' }, autoFilter: true, styleName: 'tl' },
    { name: '공정코드', fieldName: '공정코드', width: '80', header: { text: '공정코드' }, autoFilter: true, styleName: 'tl' },
    { name: '공정명', fieldName: '공정명', width: '110', header: { text: '공정명' }, autoFilter: true, styleName: 'tl' },
    { name: 'machinCode', fieldName: 'machinCode', width: '100', header: { text: 'machin_code' }, autoFilter: true, styleName: 'tl' },
    { name: '설비약명', fieldName: '설비약명', width: '110', header: { text: '설비약명' }, autoFilter: true, styleName: 'tl' },
    { name: 'chamber', fieldName: 'chamber', width: '80', header: { text: 'Chamber' }, autoFilter: true, styleName: 'tl' },
    { name: 'startTime', fieldName: 'startTime', width: '120', header: { text: 'start_time' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime },
    { name: 'endTime', fieldName: 'endTime', width: '120', header: { text: 'end_time' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime },
    { name: 'poNo', fieldName: 'poNo', width: '120', header: { text: 'PO No.' }, autoFilter: true, styleName: 'tl' },
    { name: 'runId', fieldName: 'runId', width: '150', header: { text: 'Run No.' }, autoFilter: true, styleName: 'tl' },
    { name: 'lotNo', fieldName: 'lotNo', width: '150', header: { text: 'Lot No.' }, autoFilter: true, styleName: 'tl' },
    { name: 'fromCstno', fieldName: 'fromCstno', width: '100', header: { text: 'from_cstno' }, autoFilter: true, styleName: 'tl' },
    { name: 'fromCst행렬', fieldName: 'fromCst행렬', width: '140', header: { text: 'from_cst행렬' }, autoFilter: true, styleName: 'tl' },
    { name: 'toCstno', fieldName: 'toCstno', width: '80', header: { text: 'to_cstno' }, autoFilter: true, styleName: 'tl' },
    { name: 'toCst행렬', fieldName: 'toCst행렬', width: '120', header: { text: 'to_cst행렬' }, autoFilter: true, styleName: 'tl' },
    { name: 'panelId', fieldName: 'panelId', width: '210', header: { text: 'panel_id' }, autoFilter: true, styleName: 'tl' },
    { name: 'resinId', fieldName: 'resinId', width: '160', header: { text: 'resin_id' }, autoFilter: true, styleName: 'tl' },
    { name: 'filmId상부', fieldName: 'filmId상부', width: '240', header: { text: 'Film_ID_상부' }, autoFilter: true, styleName: 'tl' },
    { name: 'filmId하부', fieldName: 'filmId하부', width: '240', header: { text: 'Film_ID_하부' }, autoFilter: true, styleName: 'tl' },
    { name: 'trayId', fieldName: 'trayId', width: '150', header: { text: 'tray_id' }, autoFilter: true, styleName: 'tl' },
    { name: 'packNo', fieldName: 'packNo', width: '230', header: { text: 'pack_no' }, autoFilter: true, styleName: 'tl' },
    { name: 'palletNo', fieldName: 'palletNo', width: '180', header: { text: 'pallet_no' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
