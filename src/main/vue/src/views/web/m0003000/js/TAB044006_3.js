/*
 * 포장/출하 > 내포장 실적 > PACK_NO 조회
 */
const { ValueType } = require('realgrid');
const { rgDisplayDateTime1 } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: false },
    copy: { enabled: true, singleMode: false },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.2',
      fitStyle: 'NONE',
      hscrollBar: true,
      showEmptyMessage: true,
    },
    header: { height: 40, showTooltip: true, tooltipEllipsisOnly: true },
    edit: { editable: false },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
  },

  fields: [
    { fieldName: '발행구분', dataType: ValueType.TEXT },
    { fieldName: 'pack상태', dataType: ValueType.TEXT },
    { fieldName: '처리일시', dataType: ValueType.TEXT },
    { fieldName: 'runId', dataType: ValueType.TEXT },
    { fieldName: 'originNo', dataType: ValueType.TEXT },
    { fieldName: 'packNo', dataType: ValueType.TEXT },
    { fieldName: 'boxNo', dataType: ValueType.TEXT },
    { fieldName: 'cellId', dataType: ValueType.TEXT },
    { fieldName: 'cell수량', dataType: ValueType.NUMBER },
    { fieldName: 'cell수량x', dataType: ValueType.NUMBER },
    //{ fieldName: 'svi', dataType: ValueType.TEXT },
    { fieldName: 'agb', dataType: ValueType.TEXT },
    { fieldName: 'pfl', dataType: ValueType.TEXT },
    { fieldName: 'palletNo', dataType: ValueType.TEXT },
    //{ fieldName: 'pack수량', dataType: ValueType.NUMBER },
    { fieldName: 'diffYn', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
    //{ fieldName: 'runIdCnt', dataType: ValueType.NUMBER },
  ],

  columns: [
    { name: '발행구분', fieldName: '발행구분', width: '80', header: { text: '발행구분' }, autoFilter: true, styleName: 'tl' },
    { name: 'pack상태', fieldName: 'pack상태', width: '100', header: { text: 'PACK상태' }, autoFilter: true, styleName: 'tl' },
    { name: '처리일시', fieldName: '처리일시', width: '130', header: { text: '처리일시' }, autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    { name: 'runId', fieldName: 'runId', width: '120', header: { text: 'RUN ID' }, mergeRule: { criteria: "value['runId'] + '|' + value['packNo']" }, autoFilter: true, styleName: 'tl' },
    { name: 'originNo', fieldName: 'originNo', width: '50', header: { text: 'ORIGIN\nNO', styleName:'multiline-header' }, mergeRule: { criteria: "value['runId'] + '|' + value['packNo']" }, autoFilter: true, styleName: 'tl' },
    { name: 'cell수량', fieldName: 'cell수량', width: '60', header: { text: "RUN\nCELL", styleName:'multiline-header' }, mergeRule: { criteria: "value['runId'] + '|' + value['packNo']" }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'packNo', fieldName: 'packNo', width: '200', header: { text: 'PACK NO' },  mergeRule: "value", autoFilter: true, styleName: 'tl' },
    { name: 'boxNo', fieldName: 'boxNo', width: '200', header: { text: 'BOX NO' },  mergeRule: "value", autoFilter: true, styleName: 'tl' },
    { name: 'cellId', fieldName: 'cellId', width: '200', header: { text: 'CELL ID' },  mergeRule: "value", autoFilter: true, styleName: 'tl' },
    { name: 'cell수량x', fieldName: 'cell수량x', width: '60', header: { text: 'PACK\nCELL', styleName:'multiline-header' }, autoFilter: true, numberFormat: '#,###', mergeRule: "value['packNo']", },
    //{ name: 'svi', fieldName: 'svi', width: '80', header: { text: 'SVI' }, autoFilter: true, styleName: 'tl' },
    { name: 'agb', fieldName: 'agb', width: '80', header: { text: 'AGB' }, autoFilter: true, styleName: 'tl' },
    { name: 'pfl', fieldName: 'pfl', width: '80', header: { text: 'PFL' }, autoFilter: true, styleName: 'tl' },
    { name: 'palletNo', fieldName: 'palletNo', width: '90', header: { text: 'PALLET NO' }, autoFilter: true, styleName: 'tl' },
    { name: 'diffYn', fieldName: 'diffYn', width: '50', header: { text: '차이\n여부', styleName:'multiline-header'}, autoFilter: true, styleName: 'tl' },
    { name: '특이사항', fieldName: '특이사항', width: '200', header: { text: '특이사항' }, autoFilter: true, styleName: 'tl' },
    //{ name: 'pack수량', fieldName: 'pack수량', width: '100', header: { text: 'pack수량' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    //{ name: 'runIdCnt', fieldName: 'runIdCnt', width: '100', header: { text: 'run_id_cnt' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
  ],
  styles: {
    footerColumn: {
      background: "#e6f7ff",
      foreground: "#1890ff",
      textAlignment: "far",
      fontBold: true,
      fontSize: 12
    },
    // 추가: footer 그룹 스타일
    footerGroup: {
      background: "#f0f0f0",
      textAlignment: "center"
    }
  }
};

module.exports = grid;
