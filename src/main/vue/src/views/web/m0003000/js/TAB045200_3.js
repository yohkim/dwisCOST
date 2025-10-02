/*
 * 포장/출하 > 출하검사 의뢰 > PACK_NO 조회
 */
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');
const { rgDisplayDateTime1, rgDisplayDate, rgDisplayTime3 } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: true ,exclusive:true },
    copy: { enabled: true, singleMode: false },
    display: {
      columnMovable: false,
			editItemMerging: false,
			selectionStyle: SelectionStyle.BLOCK,
			selectionMode: SelectionMode.EXTENDED,
      //emptyMessage: '조회된 데이터가 없습니다.',
      fitStyle: 'even',
      //hscrollBar: true,
      showEmptyMessage: true,
      minRowHeight: 30,
      rowHeight : -1,
    },
    edit: { editable: false },
    footers: { visible: false },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
    //fixed: { colBarWidth: 1, colCount: 10 },
  },

  fields: [
    { fieldName: '발행구분', dataType: ValueType.TEXT },
    { fieldName: 'pack상태', dataType: ValueType.TEXT },
    { fieldName: '처리일시', dataType: ValueType.TEXT },
    { fieldName: 'runId', dataType: ValueType.TEXT },
    { fieldName: 'originNo', dataType: ValueType.TEXT },
    { fieldName: 'packNo', dataType: ValueType.TEXT },
    { fieldName: 'boxNo', dataType: ValueType.TEXT },
    { fieldName: 'cell수량', dataType: ValueType.NUMBER },
    { fieldName: 'cell수량x', dataType: ValueType.NUMBER },
    //{ fieldName: 'svi', dataType: ValueType.TEXT },
    { fieldName: 'agb', dataType: ValueType.TEXT },
    { fieldName: 'pfl', dataType: ValueType.TEXT },
    //{ fieldName: 'palletNo', dataType: ValueType.TEXT },
    //{ fieldName: 'pack수량', dataType: ValueType.NUMBER },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
    //{ fieldName: 'runIdCnt', dataType: ValueType.NUMBER },
  ],

  columns: [
    { name: '발행구분', fieldName: '발행구분', width: '80', header: { text: '발행구분' }, mergeRule: { criteria: "value['packNo']"}, autoFilter: true, styleName: 'tl' },
    { name: 'pack상태', fieldName: 'pack상태', width: '100', header: { text: 'PACK상태' }, mergeRule: { criteria: "value['packNo']"}, autoFilter: true, styleName: 'tl' },
    { name: '처리일시', fieldName: '처리일시', width: '150', header: { text: '포 장 일' },  mergeRule: "value", autoFilter: true, styleName: 'tl', displayCallback: rgDisplayDateTime1 },
    { name: 'packNo', fieldName: 'packNo', width: '220', header: { text: 'PACK NO' },  mergeRule: "value", autoFilter: true, styleName: 'tl' },
    { name: 'boxNo', fieldName: 'boxNo', width: '220', header: { text: 'BOX NO' },  mergeRule: "value", autoFilter: true, styleName: 'tl' },
    { name: 'cell수량x', fieldName: 'cell수량x', width: '110', header: { text: 'PACK\nCELL', styleName:'multiline-header' }, autoFilter: true, numberFormat: '#,###', mergeRule: "value['packNo']", },
    { name: 'runId', fieldName: 'runId', width: '150', header: { text: 'RUN ID' },mergeRule: "value", autoFilter: true, styleName: 'tl' },
    { name: 'originNo', fieldName: 'originNo', width: '50', header: { text: 'ORIGIN\nNO', styleName:'multiline-header' }, autoFilter: true, styleName: 'tc' },
    { name: 'cell수량', fieldName: 'cell수량', width: '80', header: { text: "RUN\nCELL", styleName:'multiline-header' }, autoFilter: true, numberFormat: '#,###.###' },
    //{ name: 'svi', fieldName: 'svi', width: '80', header: { text: 'svi' }, autoFilter: true, styleName: 'tl' },
    { name: 'agb', fieldName: 'agb', width: '80', header: { text: 'AGB' }, autoFilter: true, styleName: 'tl' },
    { name: 'pfl', fieldName: 'pfl', width: '80', header: { text: 'PFL' }, autoFilter: true, styleName: 'tl' },
    //{ name: 'palletNo', fieldName: 'palletNo', width: '90', header: { text: 'PALLET NO' }, autoFilter: true, styleName: 'tl' },
    //{ name: '특이사항', fieldName: '특이사항', width: '100', header: { text: '특이사항' }, mergeRule: { criteria: "value['packNo']"}, autoFilter: true, styleName: 'tl' },
    { name: "특이사항",
      fieldName: "특이사항",
      width: 100,
      mergeRule: { criteria: "value['packNo']"}, 
      autoFilter: true,
      styleName: 'tl',
      //  {
      //   textAlignment: "left",
      //   textWrap: "explicit" // 명시적 줄바꿈 허용
      // },
      renderer: { type: "text", showTooltip:true },
      displayCallback: function(grid, index, value) {
        // 10자만 표시 (한글/영문 모두 고려)
        if (!value) return "";
        return value.length > 15 ? value.substring(0, 15) + "..." : value;
      },
    } 
  ],
  layout: [
    {
      name: 'PACK정보',
      direction: 'horizontal',
      items: [ "발행구분","pack상태","packNo", "boxNo","cell수량x","처리일시", "특이사항"],
      header: { text: 'PACK 구성 정보'}
    },'runId','originNo','cell수량', 'agb','pfl'
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
