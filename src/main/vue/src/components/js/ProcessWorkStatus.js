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
    { fieldName: '종료시간', dataType: ValueType.TEXT },
    { fieldName: '대기시간', dataType: ValueType.TEXT },
    { fieldName: '상태', dataType: ValueType.TEXT },
    { fieldName: '특이사항', dataType: ValueType.TEXT },
  ],

  columns: [
    { name: 'lotRunNo', fieldName: 'lotRunNo', header: { text: 'LotRunNo' }, width: 130, autoFilter: true, styleName: "tl" },
    { name: '수량', fieldName: '수량', header: { text: '수량' }, autoFilter: true, width: 80, styleName: "tr" },
    { name: '종료시간', fieldName: '종료시간', header: { text: '종료 시간' }, autoFilter: true, width: 120, styleName: "tl" },
    { name: '대기시간', fieldName: '대기시간', header: { text: '대기 시간' }, autoFilter: true, styleName: "tl" },
    { name: '상태', fieldName: '상태', header: { text: '상태' }, autoFilter: true, styleName: "tl" },
    { name: '특이사항', fieldName: '특이사항', header: { text: '특이사항' }, autoFilter: true, width: 350, autoFilter: true, renderer: { showTooltip: true }, styleName: "tl" },
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
    "상태","lotRunNo","수량","종료시간","대기시간","상세정보","실적입력","특이사항"
  ],
};

module.exports = grid;
