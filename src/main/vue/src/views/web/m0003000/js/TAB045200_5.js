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
    edit: { editable: false },
    footers: { visible: false },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    fixed: { colBarWidth: 1, colCount: 2 },
  },

  fields: [
    { fieldName: '의뢰일자', dataType: ValueType.TEXT },
    { fieldName: '의뢰차수', dataType: ValueType.TEXT },
    { fieldName: '검사구분', dataType: ValueType.TEXT },
   // { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: 'runId', dataType: ValueType.TEXT },
    { fieldName: 'packNo', dataType: ValueType.TEXT },
    { fieldName: '수량', dataType: ValueType.NUMBER },
   // { fieldName: 'packdate', dataType: ValueType.TEXT },
    { fieldName: '작업자', dataType: ValueType.TEXT },
   // { fieldName: 'ism호기', dataType: ValueType.TEXT },
    { fieldName: 'agb', dataType: ValueType.TEXT },
    { fieldName: 'pfl', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: '의뢰일자', fieldName: '의뢰일자', width: '80', mergeRule: { criteria: "value" }, header: { text: '의뢰일자' }, autoFilter: true, styleName: 'tl' },
    { name: '의뢰차수', fieldName: '의뢰차수', width: '60', mergeRule: { criteria: "value['의뢰일자'] + '|' + value['의뢰차수']" }, header: { text: '의뢰차수' }, autoFilter: true, styleName: 'tl' },
    { name: '검사구분', fieldName: '검사구분', width: '120', mergeRule: { criteria: "value['의뢰일자'] + '|' + value['의뢰차수']" }, header: { text: '진행단계' }, autoFilter: true, styleName: 'tl' },
    //{ name: 'model', fieldName: 'model', width: '80', mergeRule: { criteria: "value['si의뢰일자'] + '|' + value['si의뢰차수']" }, header: { text: 'MODEL' }, autoFilter: true, styleName: 'tl' },
    { name: 'packNo', fieldName: 'packNo', width: '220', mergeRule: { criteria: "value"}, header: { text: 'Pack No.(요청)' }, autoFilter: true, styleName: 'tl' },
    { name: 'runId', fieldName: 'runId', width: '120', mergeRule: { criteria: "value"}, header: { text: 'RUN_ID' }, autoFilter: true, styleName: 'tl' },
    { name: '수량', fieldName: '수량', width: '60', header: { text: '수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
   // { name: 'packdate', fieldName: 'packdate', width: '130', header: { text: 'PackDate' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    { name: '작업자', fieldName: '작업자', width: '90', header: { text: '작업자' }, autoFilter: true, styleName: 'tl' },
   // { name: 'ism호기', fieldName: 'ism호기', width: '90', header: { text: 'ISM호기' }, autoFilter: true, styleName: 'tl' },
    { name: 'agb', fieldName: 'agb', width: '80', header: { text: 'AGB' }, autoFilter: true, styleName: 'tl' },
    { name: 'pfl', fieldName: 'pfl', width: '80', header: { text: 'PFL' }, autoFilter: true, styleName: 'tl' },
    { name: '특이사항', fieldName: '특이사항', width: '120', header: { text: '특이사항' }, autoFilter: true, styleName: 'tl' },
  ],
};

module.exports = grid;
