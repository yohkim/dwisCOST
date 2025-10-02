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
  },
  
  fields: [],
  
  orgFields: [
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: 'lotNo', dataType: ValueType.TEXT },
    { fieldName: 'fCstno', dataType: ValueType.TEXT },
    { fieldName: '차수', dataType: ValueType.TEXT },
    { fieldName: 'tCstno', dataType: ValueType.TEXT },
    { fieldName: '설비명', dataType: ValueType.TEXT },
    { fieldName: '작업시작', dataType: ValueType.TEXT },
    { fieldName: '시작시각', dataType: ValueType.TEXT },
    { fieldName: '작업종료', dataType: ValueType.TEXT },
    { fieldName: '종료시각', dataType: ValueType.TEXT },
    { fieldName: '투입수', dataType: ValueType.NUMBER },
    { fieldName: '양품수', dataType: ValueType.NUMBER },
    { fieldName: '불량수량', dataType: ValueType.NUMBER },
    { fieldName: '수율', dataType: ValueType.NUMBER },
    { fieldName: '불량율', dataType: ValueType.NUMBER },
    { fieldName: '작업자', dataType: ValueType.TEXT },
    { fieldName: 'shift', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
  ],
  
  columns: [],

  orgColumns: [
    { name: 'runNo', fieldName: 'runNo', header: { text: 'RUN NO' }, width: 150, autoFilter: true, styleName: "tl" },
    { name: 'lotNo', fieldName: 'lotNo', header: { text: 'LOT NO' }, width: 150, autoFilter: true, styleName: "tl" },
    { name: 'fCstno', fieldName: 'fCstno', header: { text: '투입 카세트' }, autoFilter: true, styleName: "tl" },
    { name: '차수', fieldName: '차수', header: { text: '차수' }, autoFilter: true, styleName: "tl" },
    { name: 'tCstno', fieldName: 'tCstno', header: { text: '출고 카세트' }, autoFilter: true, styleName: "tl" },
    { name: '설비명', fieldName: '설비명', header: { text: '설비명' }, width: 120, autoFilter: true, styleName: "tl" },
    { name: '작업시작', fieldName: '작업시작', header: { text: '작업시작' }, autoFilter: true, styleName: "tl",
      displayCallback: rgDisplayDate
    },
    { name: '시작시각', fieldName: '시작시각', header: { text: '시작시각' }, autoFilter: true, styleName: "tl",
      displayCallback: rgDisplayTime
    },
    { name: '작업종료', fieldName: '작업종료', header: { text: '작업종료' }, autoFilter: true, styleName: "tl",
      displayCallback: rgDisplayDate
    },
    { name: '종료시각', fieldName: '종료시각', header: { text: '종료시각' }, autoFilter: true, styleName: "tl",
      displayCallback: rgDisplayTime
    },
    { name: '투입수', fieldName: '투입수', header: { text: '투입수' }, autoFilter: true, styleName: "tr", numberFormat: "#,##0" },
    { name: '양품수', fieldName: '양품수', header: { text: '양품수' }, autoFilter: true, styleName: "tr", numberFormat: "#,##0" },
    { name: '불량수량', fieldName: '불량수량', header: { text: '불량수량' }, autoFilter: true, styleName: "tr", numberFormat: "#,##0" },
    { name: '수율', fieldName: '수율', header: { text: '수율' }, numberFormat: "#,##0.00", autoFilter: true, styleName: "tr",
      renderer:{
		type:"html",
			callback: function(grid, cell, w, h) {
				if(_.isNil(cell.value))return ""
				return Math.round(cell.value*100, 2)+"%";
			}
		},
    },    
    { name: '불량율', fieldName: '불량율', header: { text: '불량율' }, styleName: "tr", numberFormat: "#,##0.00",
      renderer:{
		type:"html",
			callback: function(grid, cell, w, h) {
				if(_.isNil(cell.value))return ""
				return Math.round(cell.value*100, 2)+"%";
			}
		},
    },
    { name: '작업자', fieldName: '작업자', header: { text: '작업자' }, autoFilter: true, styleName: "tl" },
    { name: 'shift', fieldName: 'shift', header: { text: 'shift' }, autoFilter: true, styleName: "tl" },
    { name: '특이사항', fieldName: '특이사항', header: { text: '특이사항' }, autoFilter: true, styleName: "tl" },    
  ],

  layout: [],

  orgLayout: [
    "runNo","lotNo","fCstno","차수","tCstno","설비명","작업시작","시작시각","작업종료","종료시각","투입수","양품수","불량수량","수율","불량율","작업자","shift"
  ]
};

module.exports = grid;
