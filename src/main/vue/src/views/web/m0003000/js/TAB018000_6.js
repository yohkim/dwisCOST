/*
* DUV
*/
const { ValueType, SyncGridHeight } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "evenFill", syncGridHeight: SyncGridHeight.ALWAYS, },
		edit: { editable: true, showOnlyValidationMessage: true, erasable: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: {visible:true},
		//footers: {visible:false},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {visible:false},
		//headerSummary: {height:40},
		//hideDeletedRows: {},
		paste: { enabled: true, noEditEvent: true, eventEachRow: true },
		rowIndicator: { visible: false },
		sorting: { enabled: false },
		//sortMode: {},
		stateBar: { visible: false },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'blNo', dataType: ValueType.TEXT },
		{ fieldName: 'offSet추천값', dataType: ValueType.NUMBER },
		{ fieldName: 'offSet전', dataType: ValueType.NUMBER },
		{ fieldName: 'offSet후', dataType: ValueType.NUMBER },
		{ fieldName: '판정Control', dataType: ValueType.TEXT },
		{ fieldName: '판정Space', dataType: ValueType.TEXT },
		{ fieldName: '편차단축', dataType: ValueType.TEXT },
		{ fieldName: '편차장축', dataType: ValueType.TEXT },
		{ fieldName: '두께수치', dataType: ValueType.NUMBER },
		{ fieldName: '단측수치1', dataType: ValueType.NUMBER },
		{ fieldName: '단측수치2', dataType: ValueType.NUMBER },
		{ fieldName: '단측수치3', dataType: ValueType.NUMBER },
		{ fieldName: '장측수치1', dataType: ValueType.NUMBER },
		{ fieldName: '장측수치2', dataType: ValueType.NUMBER },
		{ fieldName: '장측수치3', dataType: ValueType.NUMBER },
		{ fieldName: '담당자', dataType: ValueType.TEXT },
		{ fieldName: '비고', dataType: ValueType.TEXT },
		{ fieldName: '단측수치', dataType: ValueType.NUMBER },
		{ fieldName: '장측수치', dataType: ValueType.NUMBER },
		{ fieldName: '두께수치1', dataType: ValueType.NUMBER },
		{ fieldName: '단측controlRangeOut', dataType: ValueType.NUMBER },
		{ fieldName: '장측controlRangeOut', dataType: ValueType.NUMBER },
		{ fieldName: '단측rangeOut', dataType: ValueType.NUMBER },
		{ fieldName: '장측rangeOut', dataType: ValueType.NUMBER },
		{ fieldName: '불량수량', dataType: ValueType.INT },
		{ fieldName: '불량입력', dataType: ValueType.TEXT },
		{ fieldName: 'block수', dataType: ValueType.NUMBER },
		{ fieldName: 'pre불량수량', dataType: ValueType.NUMBER },
	],
	columns: [		
		{ name: "blNo", fieldName: "blNo", header: { text: "BL_NO" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "offSet추천값", fieldName: "offSet추천값", header: { text: "추천값" }, editable: false, numberFormat: "#,##0.0##", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "offSet전", fieldName: "offSet전", header: { text: "전" }, editable: false, numberFormat: "#,##0.0##", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "offSet후", fieldName: "offSet후", header: { text: "후" }, editable: false, numberFormat: "#,##0.0##", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "판정Control", fieldName: "판정Control", header: { text: "Control" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "판정Space", fieldName: "판정Space", header: { text: "Spec" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "단측controlRangeOut", fieldName: "단측controlRangeOut", header: { text: "Control_Range_Out" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "단측rangeOut", fieldName: "단측rangeOut", header: { text: "Spec_Range_Out" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "편차단축", fieldName: "편차단축", header: { text: "단축" }, editable: false,
			renderer: { 
				showTooltip: true,
				type:"html",
				callback: function(grid, cell, w, h) {
					if(_.isNil(cell.value)) return "";
					return parseFloat(cell.value*1000).toFixed(2);
				}
			}, styleName: "tr",
			footer: {
				valueCallback: function(grid, column, footerIndex, columnFooter, value){
					const ds = grid.getDataSource();
					let rows = ds.getJsonRows(0, -1);
					const validValues = rows
					.map(item => parseFloat(item['편차단축']))
					.filter(t => !isNaN(t));
					const average = validValues.length > 0
					? validValues.reduce((sum, val) => sum + val, 0) / validValues.length
					: 0;
					return parseFloat(average*1000).toFixed(2);
				}
			}
		},
		{ name: "장측controlRangeOut", fieldName: "장측controlRangeOut", header: { text: "Control_Range_Out" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "장측rangeOut", fieldName: "장측rangeOut", header: { text: "Spec_Range_Out" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "편차장축", fieldName: "편차장축", header: { text: "장축" }, editable: false, 
			renderer: { 
				showTooltip: true,
				type:"html",
				callback: function(grid, cell, w, h) {
					if(_.isNil(cell.value)) return "";
					return parseFloat(cell.value*1000).toFixed(2);
				}
			}, styleName: "tr",
			footer: {
				valueCallback: function(grid, column, footerIndex, columnFooter, value){
					const ds = grid.getDataSource();
					let rows = ds.getJsonRows(0, -1);
					const validValues = rows
					.map(item => parseFloat(item['편차장축']))
					.filter(t => !isNaN(t));
					const average = validValues.length > 0
					? validValues.reduce((sum, val) => sum + val, 0) / validValues.length
					: 0;
					return parseFloat(average*1000).toFixed(2);
				}
			} 
		},
		{ name: "두께수치1", fieldName: "두께수치1", header: { text: "두께" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "두께수치", fieldName: "두께수치", header: { text: "두께" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "단측수치", fieldName: "단측수치", header: { text: "단(기본값)" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "단측수치1", fieldName: "단측수치1", header: { text: "단1" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "단측수치2", fieldName: "단측수치2", header: { text: "단2" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "단측수치3", fieldName: "단측수치3", header: { text: "단3" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "장측수치", fieldName: "장측수치", header: { text: "장(기본값)" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "장측수치1", fieldName: "장측수치1", header: { text: "장1" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "장측수치2", fieldName: "장측수치2", header: { text: "장2" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "장측수치3", fieldName: "장측수치3", header: { text: "장3" }, editable: false, numberFormat: "#,##0.###", renderer: { showTooltip: true }, styleName: "tr" },
		{ name: "담당자", fieldName: "담당자", header: { text: "담당자" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
		{ name: "불량입력", fieldName: "불량입력", header: { text: "item" },
			renderer:{
				type:"html",
				callback: function(grid, cell, w, h) {
					const ds = grid.getDataSource();
					const jsonData = ds.getJsonRow(cell.index.itemIndex);
					const str = '<button type="button" class="'+(jsonData['pre불량수량'] > 0 ? 'btn_block' : (jsonData['불량수량'] > 0 ? 'btn_sucess' : 'btn_error'))+'">불량입력</button>';
					return str;
				}
			},
		},
		{ name: "비고", fieldName: "비고", header: { text: "특이사항" }, editable: false, renderer: { showTooltip: true }, styleName: "tl" },
	],

	layout: [
		"blNo",
		{
			name: "Off-set",
			items: ["offSet추천값", "offSet전", "offSet후"],
			header: { text: "Off-set" },
		},
		{
			name: "판정",
			items: ["판정Control", "판정Space"],
			header: { text: "판정" },
		},
		{
			name: "편차",
			items: ["편차단축","편차장축"],
			header: { text: "편차" },
		},
		/*{
			name: "두께",
			items: ["두께수치1","두께수치"],
			header: { text: "두께" },
		},*/
		{
			name: "치수 Data",
			items: ["단측수치", "장측수치", "단측수치1", "단측수치2", "단측수치3", "장측수치1", "장측수치2", "장측수치3"],
			header: { text: "치수 Data" },
		},
		/*"담당자",*/ "불량입력", "비고"
	],
}

module.exports = grid;