/*
* FRONT INFO1
*/
const { ValueType } = require('realgrid');

const grid = {

    options: {
        checkBar: { visible: false },
        copy: { enabled: true, singleMode: true },
        //dataDrop: {},
        display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill" },
        edit: { editable: false },
        //editor: {},
        //filtering: {},
        //filterMode: {},
        //filterPanel: {},
        //fixed: {},
        //footer: {height:40},
        footers: {visible:false},
        //format: {},
        header: { height: 25 },
        //headerSummaries: {visible:false},
        //headerSummary: {height:40},
        //hideDeletedRows: {},
        paste: { enabled: false },
        rowIndicator: { visible: false },
        sorting: { enabled: false },
        //sortMode: {},
        stateBar: { visible: false },
        //summaryMode: {},
    },

    fields: [
        { fieldName: '근무조', dataType: ValueType.TEXT },
        { fieldName: '검사원', dataType: ValueType.TEXT },
        { fieldName: '물류작업자', dataType: ValueType.TEXT },
        { fieldName: '설비명', dataType: ValueType.TEXT },
        { fieldName: 'incstNo', dataType: ValueType.TEXT },
        { fieldName: 'outcstNo', dataType: ValueType.TEXT },
        { fieldName: 'result', dataType: ValueType.TEXT },
        { fieldName: 'scrap', dataType: ValueType.TEXT },
        { fieldName: '작업시작', dataType: ValueType.TEXT },
		{ fieldName: '시작시각', dataType: ValueType.TEXT },
		{ fieldName: '작업종료', dataType: ValueType.TEXT },
		{ fieldName: '종료시각', dataType: ValueType.TEXT },
        
    ],

    columns: [
        { name: "근무조", fieldName: "근무조", header: { text: "근무조" }, },
        { name: "검사원", fieldName: "검사원", header: { text: "검사원" }, },
        { name: "물류작업자", fieldName: "물류작업자", header: { text: "물류작업자" }, },
        { name: "설비명", fieldName: "설비명", header: { text: "설비명" }, },
        { name: "incstNo", fieldName: "incstNo", header: { text: "CST NO(IN)" }, },
        { name: "outcstNo", fieldName: "outcstNo", header: { text: "CST NO(OUT)" }, },
        { name: "result", fieldName: "result", header: { text: "RESULT" }, },
        { name: "scrap", fieldName: "scrap", header: { text: "SCRAP" }, },
        { name: "작업시작", fieldName: "작업시작", header: { text: "Date" }, },
        { name: "시작시각", fieldName: "시작시각", header: { text: "Time" }, },
        { name: "작업종료", fieldName: "작업종료", header: { text: "Date" }, },
        { name: "종료시각", fieldName: "종료시각", header: { text: "Time" }, },
    ],

    layout: [
        "근무조", "검사원", "물류작업자", 
        "설비명", "incstNo", "outcstNo",
        "result", "scrap",
        {
			name: "작업시작",
			items: ["작업시작", "시작시각"],
			header: { text: "작업시작" },
		},
		{
			name: "작업종료",
			items: ["작업종료", "종료시각"],
			header: { text: "작업종료" },
		},
     ],
}

module.exports = grid;