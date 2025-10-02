/*
 * 포장/출하 > 내포장 실적 > PACK_NO 조회
 */
const { ValueType, SelectionStyle, SelectionMode, GridFitStyle } = require('realgrid');
const { rgDisplayDateTime1, rgDisplayDate } = require('@/utils/dateUtils');

const grid = {
  options: {
    checkBar: { visible: false },
    copy: { enabled: true, singleMode: false },
    display: {
      columnMovable: false,
      emptyMessage: '조회된 데이터가 없습니다.2',
      selectionStyle: SelectionStyle.BLOCK,
      selectionMode: SelectionMode.EXTENDED,
      fitStyle: GridFitStyle.EVEN_FILL,
      fitStyle: 'NONE',
      hscrollBar: true,
      showEmptyMessage: true,
    },
    header: { height: 50, showTooltip: true, tooltipEllipsisOnly: true },
    grouping: {
      enabled: true,
      header: {
        styleName: "goldHeader",  // 그룹 헤더에 스타일 강제 적용
        height: 35
      }
    },
    edit: { editable: false },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },
    filtering: { enabled: true },
  },
  styles: {
    // 기본 스타일들
    tc: { textAlignment: "center" },
    tr: { textAlignment: "far" },
    'multiline-header': {
      textAlignment: "center",
      multiLine: true
    },
    
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
    { fieldName: '포장일', dataType: ValueType.TEXT },
    { fieldName: 'si의뢰일자', dataType: ValueType.TEXT },
    { fieldName: 'si의뢰차수', dataType: ValueType.TEXT },
    { fieldName: '출하검사결과', dataType: ValueType.TEXT },
    { fieldName: '외관검사', dataType: ValueType.TEXT },
    { fieldName: 'pfl', dataType: ValueType.TEXT },
    { fieldName: '현미경검사', dataType: ValueType.TEXT },
    { fieldName: '이물제거', dataType: ValueType.TEXT },
    { fieldName: '포장구분', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
    { fieldName: 'palletNo', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: '발행구분', fieldName: '발행구분', width: '80', header: { text: '발행구분',  styleName: 'customHeader', }, autoFilter: true },
    { name: 'pack상태', fieldName: 'pack상태', width: '100', header: { "text": 'PACK상태'}, autoFilter: true },
    { name: '처리일시', fieldName: '처리일시', width: '150', header: { text: '처리일시' }, autoFilter: true, styleName: 'tc', displayCallback: rgDisplayDateTime1 },
    { name: 'runId', fieldName: 'runId', width: '130', header: { text: 'RUN ID' },mergeRule: "value", autoFilter: true, styleName: 'tc' },
    { name: 'originNo', fieldName: 'originNo', width: '80', header: { text: 'ORIGIN\nNO', styleName:'multiline-header' }, autoFilter: true, styleName: 'tc' },
    { name: 'cell수량', fieldName: 'cell수량', width: '80', header: { text: "이물제거\nCELL", styleName:'multiline-header' }, autoFilter: true, numberFormat: '#,###.###', styleName: 'tr' },
    { name: 'packNo', fieldName: 'packNo', width: '260', header: { text: 'PACK NO' },  mergeRule: "value", autoFilter: true, styleName: 'tc' },
    { name: 'boxNo', fieldName: 'boxNo', width: '260', header: { text: 'BOX NO' },  mergeRule: "value", autoFilter: true, styleName: 'tc' },
    { name: 'cell수량x', fieldName: 'cell수량x', width: '80', header: { text: 'PACK\nCELL', styleName:'multiline-header' }, autoFilter: true, numberFormat: '#,###', mergeRule: "value['packNo']",styleName: 'tr'  },
    
    { name: '포장일', fieldName: '포장일', width: '150', header: { text: '포장일',styles :{background: "#FFD700" }}, autoFilter: true, displayCallback: rgDisplayDateTime1 },
    { name: 'si의뢰일자', fieldName: 'si의뢰일자', width: '100', header: { text: 'SI의뢰일자', styleName: "goldHeader" }, autoFilter: true,  displayCallback: rgDisplayDate},
    { name: 'si의뢰차수', fieldName: 'si의뢰차수', width: '80', header: { text: 'SI의뢰차수', styleName: "goldHeader" }, autoFilter: true },
    { name: '출하검사결과', fieldName: '출하검사결과', width: '80', header: { text: '출하검사결과', styleName: "goldHeader" }, autoFilter: true },
    { name: 'pfl', fieldName: 'pfl', width: '80', header: { text: 'PFL정보' }, autoFilter: true, styleName: "goldHeader" },
    { name: '외관검사', fieldName: '외관검사', width: '80', header: { text: '외관검사' }, autoFilter: true, styleName: "goldHeader" },
    { name: '현미경검사', fieldName: '현미경검사', width: '80', header: { text: '현미경검사' }, autoFilter: true, styleName: "goldHeader" },
    { name: '이물제거', fieldName: '이물제거', width: '80', header: { text: '이물제거' }, autoFilter: true, styleName: "goldHeader" },
    { name: '포장구분', fieldName: '포장구분', width: '80', header: { text: '포장구분' }, autoFilter: true, styleName: "tc" },
    { name: '특이사항', fieldName: '특이사항', width: '100', header: { text: '특이사항' }, autoFilter: true, styleName: "tl", renderer: { showTooltip:true },  },
    { name: 'palletNo', fieldName: 'palletNo', width: '200', header: { text: 'PALLET NO' }, autoFilter: true, styleName: 'tc' },
  ],
  layout: [
    '발행구분',
    'pack상태',
    '처리일시',
    'runId',
    'originNo',
    'cell수량',
    'packNo',
    'boxNo',
    'cell수량x',
    {
      name: 'SI RUN 정보',
      direction: 'horizontal',
      items: [
        "포장일", 
         "si의뢰일자",
        "si의뢰차수",
        "출하검사결과",,
        "외관검사",
        "pfl",
        "현미경검사",
        "이물제거",
        "포장구분",
        "특이사항"
      ],
      header: { 
        text: 'SI RUN 정보',
        styles: {
          background: "#FFD700",
          textAlignment: "center",
          fontBold: true,
          fontSize: "14px"
        }
      }
    },
    'palletNo'
  ],
};  
module.exports = grid;
