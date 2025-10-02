/*
 * 포장/출하 > 재고 현황 > 출하대기(소포장 반출)
 */
const { ValueType } = require('realgrid');
const { rgDisplayDateTime1 } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: true },
    copy: { enabled: true, singleMode: true },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: 'NONE',
      hscrollBar: true,
      showEmptyMessage: true,
    },
    edit: { editable: false },
    footers: { visible: false },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    //fixed: { colBarWidth: 1, colCount: 1 },
  },

  fields: [
    { fieldName: 'pack상태', dataType: ValueType.TEXT },
    { fieldName: '작업구분', dataType: ValueType.TEXT },
    { fieldName: 'si의뢰일자', dataType: ValueType.TEXT },
    { fieldName: 'si의뢰차수', dataType: ValueType.TEXT },
    { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: 'boxNo', dataType: ValueType.TEXT },
    { fieldName: 'cell수량', dataType: ValueType.NUMBER },
    { fieldName: 'runId', dataType: ValueType.TEXT },
    { fieldName: '반출시각', dataType: ValueType.TEXT },
    { fieldName: '반출자', dataType: ValueType.TEXT },
    { fieldName: 'ism호기', dataType: ValueType.TEXT },
    { fieldName: 'pfl', dataType: ValueType.TEXT },
    { fieldName: 'eci', dataType: ValueType.TEXT },
    { fieldName: '비고', dataType: ValueType.TEXT },
    //{ fieldName: '샘플의뢰pack', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'pack상태', fieldName: 'pack상태', width: '100', mergeRule: { criteria: "value['si의뢰일자'] + '|' + value['si의뢰차수']" }, header: { text: 'PACK상태' }, autoFilter: true, styleName: 'tl' },
    { name: '작업구분', fieldName: '작업구분', width: '120', header: { text: '작업구분' }, autoFilter: true, styleName: 'tl' },
    { name: 'si의뢰일자', fieldName: 'si의뢰일자', width: '80', mergeRule: { criteria: "value" }, header: { text: '의뢰일자' }, autoFilter: true, styleName: 'tl' },
    { name: 'si의뢰차수', fieldName: 'si의뢰차수', width: '50', mergeRule: { criteria: "value['si의뢰일자'] + '|' + value['si의뢰차수']" }, header: { text: '의뢰차수' }, autoFilter: true, styleName: 'tl' },
    { name: 'model', fieldName: 'model', width: '80',  mergeRule: { criteria: "value['si의뢰일자'] + '|' + value['si의뢰차수'] + value['model']"}, header: { text: 'MODEL' }, autoFilter: true, styleName: 'tl' },
    { name: 'boxNo', fieldName: 'boxNo', width: '220', header: { text: 'BOX_NO' }, autoFilter: true, styleName: 'tl' },
    { name: 'cell수량', fieldName: 'cell수량', width: '60', header: { text: '수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'runId', fieldName: 'runId', width: '120', header: { text: 'RUN_ID' }, autoFilter: true, styleName: 'tl' },
    { name: '반출시각', fieldName: '반출시각', width: '130', header: { text: '반출시각' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    { name: '반출자', fieldName: '반출자', width: '90', header: { text: '반출자' }, autoFilter: true, styleName: 'tl' },
    { name: 'ism호기', fieldName: 'ism호기', width: '90', header: { text: 'ISM호기' }, autoFilter: true, styleName: 'tl' },
    { name: 'pfl', fieldName: 'pfl', width: '80', header: { text: 'PFL' }, autoFilter: true, styleName: 'tl' },
    { name: 'eci', fieldName: 'eci', width: '80', header: { text: 'ECI' }, autoFilter: true, styleName: 'tl' },
    { name: '비고', fieldName: '비고', width: '120', header: { text: '비고' }, autoFilter: true, styleName: 'tl' },
    //{ name: '샘플의뢰pack', fieldName: '샘플의뢰pack', width: '180', header: { text: '샘플의뢰PACK' }, autoFilter: true, numberFormat: '#', styleName: 'tl' },
  ],
};

module.exports = grid;
