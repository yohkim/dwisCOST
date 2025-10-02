/*
 * 제조 실적 입력 > FRONT > 설비 로그 조회
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

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
    edit: { editable: false },
    footers: { visible: false },
    header: { height: 25 },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true },
    stateBar: { visible: false },   
    filtering: {
      automating: {
        textCategorize: true,         
        textCategoryCallback: function (column, values) {}
      }
    } 
  },
  
  fields: [
    { fieldName: 'area', dataType: ValueType.TEXT },
    { fieldName: '공정명', dataType: ValueType.TEXT },
    { fieldName: 'model', dataType: ValueType.TEXT },
    { fieldName: 'poNo', dataType: ValueType.TEXT },
    { fieldName: 'panelId', dataType: ValueType.TEXT },
    { fieldName: 'lotNo', dataType: ValueType.TEXT },
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: 'runCell', dataType: ValueType.TEXT },
    { fieldName: 'machineCode', dataType: ValueType.TEXT },
    { fieldName: '설비명', dataType: ValueType.TEXT },
    { fieldName: '작업자', dataType: ValueType.TEXT },
    { fieldName: '작업조', dataType: ValueType.TEXT },
    { fieldName: 'shift', dataType: ValueType.TEXT },
    { fieldName: '작업시작', dataType: ValueType.TEXT },
    { fieldName: '시작시각', dataType: ValueType.TEXT },
    { fieldName: '작업종료', dataType: ValueType.TEXT },
    { fieldName: '종료시각', dataType: ValueType.TEXT },
    { fieldName: '투입수량', dataType: ValueType.NUMBER },
    { fieldName: '양품수량', dataType: ValueType.NUMBER },
    { fieldName: '불량수량', dataType: ValueType.NUMBER },
  ],

  columns: [
    { name: 'area', fieldName: 'area', header: { text: 'area' }, autoFilter: true, styleName: "tl" },
    { name: '공정명', fieldName: '공정명', header: { text: '공정명' }, autoFilter: true, styleName: "tl" },
    { name: 'model', fieldName: 'model', header: { text: 'model' }, autoFilter: true, styleName: "tl" },
    { name: 'poNo', fieldName: 'poNo', header: { text: 'po_no' }, width: 140, autoFilter: true, styleName: "tl" },
    { name: 'panelId', fieldName: 'panelId', header: { text: 'panel_id' }, width: 250, autoFilter: true, styleName: "tl" },
    { name: 'lotNo', fieldName: 'lotNo', header: { text: 'LOT_NO' }, width: 150, autoFilter: true, styleName: "tl" },
    { name: 'runCell', fieldName: 'runCell', header: { text: 'run_cell' }, autoFilter: true, styleName: "tr" },
    { name: 'runNo', fieldName: 'runNo', header: { text: 'run_no' }, width: 150, autoFilter: true, styleName: "tl",
      mergeRule: { criteria: "values['공정명'] + value" }
    },
    { name: 'machineCode', fieldName: 'machineCode', header: { text: 'Machine_code' }, autoFilter: true, styleName: "tl" },
    { name: '설비명', fieldName: '설비명', header: { text: '설비명' }, width: 230, autoFilter: true, styleName: "tl",
      mergeRule: { criteria: "values['공정명'] + value" }
    },
    { name: '작업자', fieldName: '작업자', header: { text: '작업자' }, autoFilter: true, styleName: "tl",
      mergeRule: { criteria: "values['공정명'] + value" }
    },
    { name: '작업조', fieldName: '작업조', header: { text: '작업조' }, autoFilter: true, styleName: "tl" },
    { name: 'shift', fieldName: 'shift', header: { text: 'Shift' }, autoFilter: true, styleName: "tl",
      mergeRule: { criteria: "values['공정명'] + value" }
    },
    { name: '작업시작', fieldName: '작업시작', header: { text: '작업시작' }, autoFilter: true, styleName: "tl",
      displayCallback: rgDisplayDate,
      mergeRule: { criteria: "values['공정명'] + value" }
    },
    { name: '시작시각', fieldName: '시작시각', header: { text: '시작시각' }, autoFilter: true, styleName: "tl",
      displayCallback: rgDisplayTime,
      mergeRule: { criteria: "values['공정명'] + value" }
    },
    { name: '작업종료', fieldName: '작업종료', header: { text: '작업종료' }, autoFilter: true, styleName: "tl",
      displayCallback: rgDisplayDate,
      mergeRule: { criteria: "values['공정명'] + value" }
    },
    { name: '종료시각', fieldName: '종료시각', header: { text: '종료시각' }, autoFilter: true, styleName: "tl",
      displayCallback: rgDisplayTime,
      mergeRule: { criteria: "values['공정명'] + value" }
    },
    { name: '투입수량', fieldName: '투입수량', header: { text: '투입수량' }, numberFormat: "#,##0", autoFilter: true, styleName: "tr",
      mergeRule: { criteria: "values['공정명'] + value" }
    },
    { name: '양품수량', fieldName: '양품수량', header: { text: '양품수량' }, numberFormat: "#,##0", autoFilter: true, styleName: "tr",
      mergeRule: { criteria: "values['공정명'] + value" }
    },
    { name: '불량수량', fieldName: '불량수량', header: { text: '불량수량' }, numberFormat: "#,##0", autoFilter: true, styleName: "tr",
      mergeRule: { criteria: "values['공정명'] + value" }
    }, 
  ],

  layout: [
    "area","공정명","model","poNo","panelId","lotNo","runCell","runNo","설비명","작업자","shift","작업시작","시작시각","작업종료","종료시각","투입수량","양품수량","불량수량"
  ],
};

module.exports = grid;
