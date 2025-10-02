/*
* 작업이력조회>Cell작업이력조회
*/
const { ValueType } = require('realgrid');

const grid = {

	options: {
		checkBar: { visible: false, exclusive: false,syncHeadCheck:true },
		copy: { enabled: true, singleMode: false },
		//dataDrop: {},
		display: { columnMovable: false, editItemMerging: true, fitStyle: "fill" },
		edit: { editable: false, commitByCell: true },
		//editor: {},
		//filtering: {},
		//filterMode: {},
		//filterPanel: {},
		//fixed: {},
		footer: { visible: false },
		//footers: {},
		//format: {},
		header: { height: 25 },
		//headerSummaries: {},
		//headerSummary: {},
		//hideDeletedRows: true,
		//paste: { enabled: true },
		//rowIndicator: { visible: true },
		sorting: { enabled: false },
		//sortMode: {},
		//stateBar: { visible: true },
		//summaryMode: {},
	},

	fields: [
		{ fieldName: 'cellId', dataType: ValueType.TEXT },
		{ fieldName: 'runId', dataType: ValueType.TEXT },
		{ fieldName: '10021종료', dataType: ValueType.TEXT },
		{ fieldName: '10021작업자', dataType: ValueType.TEXT },
		{ fieldName: '10023호기', dataType: ValueType.TEXT },
		{ fieldName: '10023시작', dataType: ValueType.TEXT },
		{ fieldName: '10023종료', dataType: ValueType.TEXT },
		{ fieldName: '10023작업자', dataType: ValueType.TEXT },
		{ fieldName: '10027호기', dataType: ValueType.TEXT },
		{ fieldName: '10027시작', dataType: ValueType.TEXT },
		{ fieldName: '10027종료', dataType: ValueType.TEXT },
		{ fieldName: '10027작업자', dataType: ValueType.TEXT },
		{ fieldName: '10033호기', dataType: ValueType.TEXT },
		{ fieldName: '10033시작', dataType: ValueType.TEXT },
		{ fieldName: '10033종료', dataType: ValueType.TEXT },
		{ fieldName: '10033작업자', dataType: ValueType.TEXT },
		{ fieldName: '10035호기', dataType: ValueType.TEXT },
		{ fieldName: '10035시작', dataType: ValueType.TEXT },
		{ fieldName: '10035종료', dataType: ValueType.TEXT },
		{ fieldName: '10035작업자', dataType: ValueType.TEXT },
		{ fieldName: '10037호기', dataType: ValueType.TEXT },
		{ fieldName: '10037시작', dataType: ValueType.TEXT },
		{ fieldName: '10037종료', dataType: ValueType.TEXT },
		{ fieldName: '10037작업자', dataType: ValueType.TEXT },
		{ fieldName: '10040호기', dataType: ValueType.TEXT },
		{ fieldName: '10040시작', dataType: ValueType.TEXT },
		{ fieldName: '10040종료', dataType: ValueType.TEXT },
		{ fieldName: '10040작업자', dataType: ValueType.TEXT },
		{ fieldName: '10043호기', dataType: ValueType.TEXT },
		{ fieldName: '10043시작', dataType: ValueType.TEXT },
		{ fieldName: '10043종료', dataType: ValueType.TEXT },
		{ fieldName: '10043작업자', dataType: ValueType.TEXT },
		{ fieldName: '10047호기', dataType: ValueType.TEXT },
		{ fieldName: '10047시작', dataType: ValueType.TEXT },
		{ fieldName: '10047종료', dataType: ValueType.TEXT },
		{ fieldName: '10047작업자', dataType: ValueType.TEXT },
		{ fieldName: '10050호기', dataType: ValueType.TEXT },
		{ fieldName: '10050시작', dataType: ValueType.TEXT },
		{ fieldName: '10050종료', dataType: ValueType.TEXT },
		{ fieldName: '10050작업자', dataType: ValueType.TEXT },
		{ fieldName: '10054호기', dataType: ValueType.TEXT },
		{ fieldName: '10054시작', dataType: ValueType.TEXT },
		{ fieldName: '10054종료', dataType: ValueType.TEXT },
		{ fieldName: '10054작업자', dataType: ValueType.TEXT },
		{ fieldName: '10055호기', dataType: ValueType.TEXT },
		{ fieldName: '10055시작', dataType: ValueType.TEXT },
		{ fieldName: '10055종료', dataType: ValueType.TEXT },
		{ fieldName: '10055작업자', dataType: ValueType.TEXT },
		{ fieldName: '10056호기', dataType: ValueType.TEXT },
		{ fieldName: '10056시작', dataType: ValueType.TEXT },
		{ fieldName: '10056종료', dataType: ValueType.TEXT },
		{ fieldName: '10056작업자', dataType: ValueType.TEXT },
		{ fieldName: '10058호기', dataType: ValueType.TEXT },
		{ fieldName: '10058시작', dataType: ValueType.TEXT },
		{ fieldName: '10058종료', dataType: ValueType.TEXT },
		{ fieldName: '10058작업자', dataType: ValueType.TEXT },
		{ fieldName: '11022호기', dataType: ValueType.TEXT },
		{ fieldName: '11022시작', dataType: ValueType.TEXT },
		{ fieldName: '11022종료', dataType: ValueType.TEXT },
		{ fieldName: '11022작업자', dataType: ValueType.TEXT },
		{ fieldName: '11059호기', dataType: ValueType.TEXT },
		{ fieldName: '11059시작', dataType: ValueType.TEXT },
		{ fieldName: '11059종료', dataType: ValueType.TEXT },
		{ fieldName: '11059작업자', dataType: ValueType.TEXT },
		{ fieldName: '11061호기', dataType: ValueType.TEXT },
		{ fieldName: '11061시작', dataType: ValueType.TEXT },
		{ fieldName: '11061종료', dataType: ValueType.TEXT },
		{ fieldName: '11061작업자', dataType: ValueType.TEXT },
		{ fieldName: '11067호기', dataType: ValueType.TEXT },
		{ fieldName: '11067시작', dataType: ValueType.TEXT },
		{ fieldName: '11067종료', dataType: ValueType.TEXT },
		{ fieldName: '11067작업자', dataType: ValueType.TEXT },
		{ fieldName: '11072호기', dataType: ValueType.TEXT },
		{ fieldName: '11072시작', dataType: ValueType.TEXT },
		{ fieldName: '11072종료', dataType: ValueType.TEXT },
		{ fieldName: '11072작업자', dataType: ValueType.TEXT },
		{ fieldName: '12068호기', dataType: ValueType.TEXT },
		{ fieldName: '12068시작', dataType: ValueType.TEXT },
		{ fieldName: '12068종료', dataType: ValueType.TEXT },
		{ fieldName: '12068작업자', dataType: ValueType.TEXT },
		{ fieldName: '12070호기', dataType: ValueType.TEXT },
		{ fieldName: '12070시작', dataType: ValueType.TEXT },
		{ fieldName: '12070종료', dataType: ValueType.TEXT },
		{ fieldName: '12070작업자', dataType: ValueType.TEXT },
		{ fieldName: '13073호기', dataType: ValueType.TEXT },
		{ fieldName: '13073시작', dataType: ValueType.TEXT },
		{ fieldName: '13073종료', dataType: ValueType.TEXT },
		{ fieldName: '13073작업자', dataType: ValueType.TEXT },
		{ fieldName: '14073호기', dataType: ValueType.TEXT },
		{ fieldName: '14073시작', dataType: ValueType.TEXT },
		{ fieldName: '14073종료', dataType: ValueType.TEXT },
		{ fieldName: '14073작업자', dataType: ValueType.TEXT },
		{ fieldName: '14074시작', dataType: ValueType.TEXT },
		{ fieldName: '14074packNo', dataType: ValueType.TEXT },
		{ fieldName: '14074작업자', dataType: ValueType.TEXT },
		{ fieldName: '14077시작', dataType: ValueType.TEXT },
		{ fieldName: '14077packNo', dataType: ValueType.TEXT },
		{ fieldName: '14077작업자', dataType: ValueType.TEXT },
		{ fieldName: '14080시작', dataType: ValueType.TEXT },
		{ fieldName: '14080packNo', dataType: ValueType.TEXT },
		{ fieldName: '14080작업자', dataType: ValueType.TEXT },
		{ fieldName: '14081시작', dataType: ValueType.TEXT },
		{ fieldName: '14081packNo', dataType: ValueType.TEXT },
		{ fieldName: '14081작업자', dataType: ValueType.TEXT },
		{ fieldName: '14082시작', dataType: ValueType.TEXT },
		{ fieldName: '14082palletNo', dataType: ValueType.TEXT },
		{ fieldName: '14082작업자', dataType: ValueType.TEXT },
		{ fieldName: '14087시작', dataType: ValueType.TEXT },
		{ fieldName: '14087palletNo', dataType: ValueType.TEXT },
		{ fieldName: '14087작업자', dataType: ValueType.TEXT }
	],
	
	columns: [
		{ 
			name: 'cellId', 
			fieldName: 'cellId', 
			width: '280', 
			header: { text: 'CELL ID' }, 
			autoFilter: true 
		},
		{ 
			name: 'runId', 
			fieldName: 'runId', 
			width: '150', 
			header: { text: 'RUN ID' }, 
			autoFilter: true 
		},
		{
			name: '10021종료',
			fieldName: '10021종료',
			width: '100',
			header: { text: '발행일자' },
			autoFilter: true
		},
		{
			name: '10021작업자',
			fieldName: '10021작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10023호기',
			fieldName: '10023호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10023시작',
			fieldName: '10023시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10023종료',
			fieldName: '10023종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10023작업자',
			fieldName: '10023작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10027호기',
			fieldName: '10027호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10027시작',
			fieldName: '10027시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10027종료',
			fieldName: '10027종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10027작업자',
			fieldName: '10027작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10033호기',
			fieldName: '10033호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10033시작',
			fieldName: '10033시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10033종료',
			fieldName: '10033종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10033작업자',
			fieldName: '10033작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10035호기',
			fieldName: '10035호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10035시작',
			fieldName: '10035시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10035종료',
			fieldName: '10035종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10035작업자',
			fieldName: '10035작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10037호기',
			fieldName: '10037호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10037시작',
			fieldName: '10037시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10037종료',
			fieldName: '10037종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10037작업자',
			fieldName: '10037작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10040호기',
			fieldName: '10040호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10040시작',
			fieldName: '10040시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10040종료',
			fieldName: '10040종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10040작업자',
			fieldName: '10040작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10043호기',
			fieldName: '10043호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10043시작',
			fieldName: '10043시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10043종료',
			fieldName: '10043종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10043작업자',
			fieldName: '10043작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10047호기',
			fieldName: '10047호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10047시작',
			fieldName: '10047시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10047종료',
			fieldName: '10047종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10047작업자',
			fieldName: '10047작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10050호기',
			fieldName: '10050호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10050시작',
			fieldName: '10050시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10050종료',
			fieldName: '10050종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10050작업자',
			fieldName: '10050작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10054호기',
			fieldName: '10054호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10054시작',
			fieldName: '10054시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10054종료',
			fieldName: '10054종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10054작업자',
			fieldName: '10054작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10055호기',
			fieldName: '10055호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10055시작',
			fieldName: '10055시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10055종료',
			fieldName: '10055종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10055작업자',
			fieldName: '10055작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10056호기',
			fieldName: '10056호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10056시작',
			fieldName: '10056시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10056종료',
			fieldName: '10056종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10056작업자',
			fieldName: '10056작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '10058호기',
			fieldName: '10058호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '10058시작',
			fieldName: '10058시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '10058종료',
			fieldName: '10058종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '10058작업자',
			fieldName: '10058작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '11022호기',
			fieldName: '11022호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '11022시작',
			fieldName: '11022시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '11022종료',
			fieldName: '11022종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '11022작업자',
			fieldName: '11022작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '11059호기',
			fieldName: '11059호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '11059시작',
			fieldName: '11059시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '11059종료',
			fieldName: '11059종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '11059작업자',
			fieldName: '11059작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '11061호기',
			fieldName: '11061호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '11061시작',
			fieldName: '11061시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '11061종료',
			fieldName: '11061종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '11061작업자',
			fieldName: '11061작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '11067호기',
			fieldName: '11067호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '11067시작',
			fieldName: '11067시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '11067종료',
			fieldName: '11067종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '11067작업자',
			fieldName: '11067작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '11072호기',
			fieldName: '11072호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '11072시작',
			fieldName: '11072시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '11072종료',
			fieldName: '11072종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '11072작업자',
			fieldName: '11072작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
			{
			name: '12068호기',
			fieldName: '12068호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '12068시작',
			fieldName: '12068시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '12068종료',
			fieldName: '12068종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '12068작업자',
			fieldName: '12068작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '12070호기',
			fieldName: '12070호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '12070시작',
			fieldName: '12070시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '12070종료',
			fieldName: '12070종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '12070작업자',
			fieldName: '12070작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '13073호기',
			fieldName: '13073호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '13073시작',
			fieldName: '13073시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '13073종료',
			fieldName: '13073종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '13073작업자',
			fieldName: '13073작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '14073호기',
			fieldName: '14073호기',
			width: '100',
			header: { text: '호기' },
			autoFilter: true
		},
		{
			name: '14073시작',
			fieldName: '14073시작',
			width: '100',
			header: { text: '시작' },
			autoFilter: true
		},
		{
			name: '14073종료',
			fieldName: '14073종료',
			width: '100',
			header: { text: '종료' },
			autoFilter: true
		},
		{
			name: '14073작업자',
			fieldName: '14073작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '14074시작',
			fieldName: '14074시작',
			width: '100',
			header: { text: '작업일시' },
			autoFilter: true
		},
		{
			name: '14074작업자',
			fieldName: '14074작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '14074packNo',
			fieldName: '14074packNo',
			width: '100',
			header: { text: 'PACK NO' },
			autoFilter: true
		},
		{
			name: '14077시작',
			fieldName: '14077시작',
			width: '100',
			header: { text: '작업일시' },
			autoFilter: true
		},
		{
			name: '14077작업자',
			fieldName: '14077작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '14077packNo',
			fieldName: '14077packNo',
			width: '100',
			header: { text: 'PACK NO' },
			autoFilter: true
		},
		{
			name: '14080시작',
			fieldName: '14080시작',
			width: '100',
			header: { text: '작업일시' },
			autoFilter: true
		},
		{
			name: '14080작업자',
			fieldName: '14080작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '14080packNo',
			fieldName: '14080packNo',
			width: '100',
			header: { text: 'PACK NO' },
			autoFilter: true
		},
		{
			name: '14081시작',
			fieldName: '14081시작',
			width: '100',
			header: { text: '작업일시' },
			autoFilter: true
		},
		{
			name: '14081작업자',
			fieldName: '14081작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '14081packNo',
			fieldName: '14081packNo',
			width: '100',
			header: { text: 'PACK NO' },
			autoFilter: true
		},
		{
			name: '14082시작',
			fieldName: '14082시작',
			width: '100',
			header: { text: '작업일시' },
			autoFilter: true
		},
		{
			name: '14082작업자',
			fieldName: '14082작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '14082palletNo',
			fieldName: '14082palletNo',
			width: '100',
			header: { text: 'PALLET NO' },
			autoFilter: true
		},
		{
			name: '14087시작',
			fieldName: '14087시작',
			width: '100',
			header: { text: '작업일시' },
			autoFilter: true
		},
		{
			name: '14087작업자',
			fieldName: '14087작업자',
			width: '100',
			header: { text: '작업자' },
			autoFilter: true
		},
		{
			name: '14087palletNo',
			fieldName: '14087palletNo',
			width: '100',
			header: { text: 'PALLET NO' },
			autoFilter: true
		},
	],
	layout: [
		'cellId',
		'runId',
		{
			name : "10021",
			direction: "horizontal",
			items: [
				'10021종료',
				'10021작업자'
			],
			header: {
				text : "Run Card 발행"
			}
		},
		{
			name : "10023",
			direction: "horizontal",
			items: [
				'10023호기',
				'10023시작',
				'10023종료',
				'10023작업자'
			],
			header: {
				text : "박리"
			}
		},
		{
			name: "10027",
			direction: "horizontal",
			items: [
				"10027호기",
				"10027시작",
				"10027종료",
				"10027작업자"
			],
			header: {
				text: "박리 후 세정"
			}
		},
		{
			name: "10033",
			direction: "horizontal",
			items: [
				"10033호기",
				"10033시작",
				"10033종료",
				"10033작업자"
			],
			header: {
				text: "BTP"
			}
		},
		{
			name: "10035",
			direction: "horizontal",
			items: [
				"10035호기",
				"10035시작",
				"10035종료",
				"10035작업자"
			],
			header: {
				text: "재세정"
			}
		},
		{
			name: "10037",
			direction: "horizontal",
			items: [
				"10037호기",
				"10037시작",
				"10037종료",
				"10037작업자"
			],
			header: {
				text: "강화 전 환적"
			}
		},
		{
			name: "10040",
			direction: "horizontal",
			items: [
				"10040호기",
				"10040시작",
				"10040종료",
				"10040작업자"
			],
			header: {
				text: "화학 강화"
			}
		},
		{
			name: "10043",
			direction: "horizontal",
			items: [
				"10043호기",
				"10043시작",
				"10043종료",
				"10043작업자"
			],
			header: {
				text: "강화 후 환적"
			}
		},
		{
			name: "10047",
			direction: "horizontal",
			items: [
				"10047호기",
				"10047시작",
				"10047종료",
				"10047작업자"
			],
			header: {
				text: "강화 후 세정"
			}
		},
		{
			name: "10050",
			direction: "horizontal",
			items: [
				"10050호기",
				"10050시작",
				"10050종료",
				"10050작업자"
			],
			header: {
				text: "ATP"
			}
		},
		{
			name: "10054",
			direction: "horizontal",
			items: [
				"10054호기",
				"10054시작",
				"10054종료",
				"10054작업자"
			],
			header: {
				text: "M-FQC"
			}
		},
		{
			name: "10055",
			direction: "horizontal",
			items: [
				"10055호기",
				"10055시작",
				"10055종료",
				"10055작업자"
			],
			header: {
				text: "ISM"
			}
		},
		{
			name: "10056",
			direction: "horizontal",
			items: [
				"10056호기",
				"10056시작",
				"10056종료",
				"10056작업자"
			],
			header: {
				text: "AGB"
			}
		},
		{
			name: "10058",
			direction: "horizontal",
			items: [
				"10058호기",
				"10058시작",
				"10058종료",
				"10058작업자"
			],
			header: {
				text: "검사 후 세정"
			}
		},
		{
			name: "11022",
			direction: "horizontal",
			items: [
				"11022호기",
				"11022시작",
				"11022종료",
				"11022작업자"
			],
			header: {
				text: "필름박리"
			}
		},
		{
			name: "11059",
			direction: "horizontal",
			items: [
				"11059호기",
				"11059시작",
				"11059종료",
				"11059작업자"
			],
			header: {
				text: "재세정"
			}
		},
		{
			name: "11061",
			direction: "horizontal",
			items: [
				"11061호기",
				"11061시작",
				"11061종료",
				"11061작업자"
			],
			header: {
				text: "PFL"
			}
		},
		{
			name: "11067",
			direction: "horizontal",
			items: [
				"11067호기",
				"11067시작",
				"11067종료",
				"11067작업자"
			],
			header: {
				text: "BFL"
			}
		},
		{
			name: "11072",
			direction: "horizontal",
			items: [
				"11072호기",
				"11072시작",
				"11072종료",
				"11072작업자"
			],
			header: {
				text: "필름 포장 검사"
			}
		},
		{
			name: "12068",
			direction: "horizontal",
			items: [
				"12068호기",
				"12068시작",
				"12068종료",
				"12068작업자"
			],
			header: {
				text: "ECI"
			}
		},
		{
			name: "12070",
			direction: "horizontal",
			items: [
				"12070호기",
				"12070시작",
				"12070종료",
				"12070작업자"
			],
			header: {
				text: "VRS"
			}
		},
		{
			name: "13073",
			direction: "horizontal",
			items: [
				"13073호기",
				"13073시작",
				"13073종료",
				"13073작업자"
			],
			header: {
				text: "설비(PACL)"
			}
		},
		{
			name: "14073",
			direction: "horizontal",
			items: [
				"14073호기",
				"14073시작",
				"14073종료",
				"14073작업자"
			],
			header: {
				text: "수동(S-LINE)"
			}
		},
		{
			name: "14074",
			direction: "horizontal",
			items: [
				"14074시작",
				"14074작업자",
				"14074packNo",
			],
			header: {
				text: "출하검사대기"
			}
		},
		{
			name: "14077",
			direction: "horizontal",
			items: [
				"14077시작",
				"14077작업자",
				"14077packNo",
			],
			header: {
				text: "출하검사의뢰"
			}
		},
		{
			name: "14080",
			direction: "horizontal",
			items: [
				"14080시작",
				"14080작업자",
				"14080packNo",
			],
			header: {
				text: "반출대기"
			}
		},
		{
			name: "14081",
			direction: "horizontal",
			items: [
				"14081시작",
				"14081작업자",
				"14081packNo",
			],
			header: {
				text: "소포장반출"
			}
		},
		{
			name: "14082",
			direction: "horizontal",
			items: [
				"14082시작",
				"14082작업자",
				"14082palletNo",
			],
			header: {
				text: "출하대기"
			}
		},
		{
			name: "14087",
			direction: "horizontal",
			items: [
				"14087시작",
				"14087작업자",
				"14087palletNo",
			],
			header: {
				text: "출하"
			}
		}
	]
}

module.exports = grid;