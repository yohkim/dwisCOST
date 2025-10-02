/*
 * 제조 실적 입력 > FRONT > 설비 로그 조회
 */
const { ValueType } = require('realgrid');
const { rgDisplayDate, rgDisplayTime } = require('@/utils/dateUtils');

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
    header: { height: 25 },
    paste: { enabled: false },
    rowIndicator: { visible: true },
    sorting: { enabled: true, style: "inclusive" },
    stateBar: { visible: false },    
  },
  
  fields: [
    { fieldName: '공정코드', dataType: ValueType.TEXT },
    { fieldName: 'lotRunNo', dataType: ValueType.TEXT },
    { fieldName: 'area', dataType: ValueType.TEXT },
    { fieldName: 'lotNo', dataType: ValueType.TEXT },
    { fieldName: 'runNo', dataType: ValueType.TEXT },
    { fieldName: '상세정보', dataType: ValueType.TEXT },
    { fieldName: '실적입력', dataType: ValueType.TEXT },
    { fieldName: '수량', dataType: ValueType.INT },
    { fieldName: '설비약명', dataType: ValueType.TEXT },
    { fieldName: '작업자', dataType: ValueType.TEXT },
    { fieldName: '시작시간', dataType: ValueType.TEXT },
    { fieldName: '대기시간', dataType: ValueType.TEXT },
    { fieldName: '상태', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'lotRunNo', fieldName: 'lotRunNo', header: { text: 'LotRunNo' }, autoFilter: true, styleName: "tl" },
    { name: '수량', fieldName: '수량', header: { text: '수량' }, styleName: "tr", autoFilter: true },
    { name: '설비약명', fieldName: '설비약명', header: { text: '설비약명' }, autoFilter: true, styleName: "tl" },
    { name: '작업자', fieldName: '작업자', header: { text: '작업자' }, autoFilter: true, styleName: "tl" },
    { name: '시작시간', fieldName: '시작시간', header: { text: '시작시간' }, autoFilter: true, styleName: "tl" },
    { name: '대기시간', fieldName: '대기시간', header: { text: '작업시간' }, autoFilter: true, styleName: "tl" },
    { name: '상태', fieldName: '상태', header: { text: '상태' }, autoFilter: true, styleName: "tl" },
    { name: "상세정보", fieldName: "상세정보", header: { text: "상세정보" },
		renderer:{
			type:"html",
			callback: function(grid, cell, w, h) {
				return '<button type="button" class="btn_sucess">상세보기</button>';
			}
		},
	},
    { name: "실적입력", fieldName: "실적입력", header: { text: "실적입력" },
			renderer:{
			type:"html",
				callback: function(grid, cell, w, h) {
					return '<button type="button" class="btn_sucess">바로가기</button>';
				}
      },
		},
  ],
  
  layout: [
    "상태","lotRunNo","수량","설비약명","작업자","시작시간","대기시간","상세정보","실적입력"
  ],
};

module.exports = grid;
