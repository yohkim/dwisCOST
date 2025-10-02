<template>
	<div>
         <b-tabs b-model="tab" class="three_depth_tab">
            <b-tab title="생산실적입력"></b-tab>
            <b-tab title="작업이력조회"></b-tab>
            <b-tab title="설비로그조회"></b-tab>
        </b-tabs>
		  <b-tabs b-model="tab" class="four_depth_tab">
            <b-tab title="생산실적입력"></b-tab>
            <b-tab title="작업이력조회"></b-tab>
            <b-tab title="설비로그조회"></b-tab>
        </b-tabs>
		<div class="grid_box four_d_box">
			<div class="left_box">
				<div class="title">title</div>
					<div class="btn_wrap">
						<b-button class="second" @click="alert('알림')">알림창</b-button>
						<b-button class="second" @click="alert('확인')">확인창</b-button>
						<b-button class="second" @click="alert('선택')">선택창</b-button>
						<b-button class="second" @click="upload">업로드</b-button>
						<b-button class="second" @click="fileAttach">파일첨부</b-button>
						<b-button class="second">미리보기</b-button>
						<b-button class="second">생성처리</b-button>
						<b-button class="sub"> 추가</b-button>
						<b-button >삭제</b-button>
						<b-button class="main"> 저장</b-button>
					</div> 
			</div>
				<b-container>
		<b-row>
			<b-col cols="3">
				<b-form-floating>
					<b-form-label for="floatingInput1">Email address</b-form-label>
					<b-form-input id="floatingInput1" placeholder="Enter your email" v-model="email" class="form-control"></b-form-input>
				</b-form-floating>
			</b-col>
			<b-col cols="6">
				<b-form-floating>
					<b-form-label for="floatingPassword1">Password</b-form-label>
					<b-form-input id="floatingPassword1" type="password" placeholder="Enter your password" v-model="password" class="form-control"></b-form-input>
				</b-form-floating>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
			
			</b-col>
		</b-row>
	</b-container>
			 <!-- <RealGrid class="grid-border-none"   ref="grid" :uid="'grid'" :step="'6'" :rows="rows"/>  -->
			  <div ref="grid" id="grid" style="height: 500px"></div>
		</div>
		<UploadPopup ref="uploadPopup1"/>
		<FileAttachPopup ref="fileAttachPopup1"/>
	</div>	
	
</template>

<script>
import {GridView, LocalDataProvider} from 'realgrid';
let dataProvider,gridView;
export default {
	name: "SampleType1",
	data () {
		return {
			grid:null,
			rows:[
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
				{roleId:'test id 입니다.',roleName:'가나다라 마바사',description:'AAAAAAAAAAAAABBBcccdddee'},
			],
		}
	},
	computed: {
		// getGridView(){
		// 	return this.$refs.grid.getGridView();
		// },
		// getDataProvider(){
		// 	return this.$refs.grid.getGridDataProvider();
		// }
	},
	created() {
		
	},	
	mounted() {
		this.initializeGrid();

	},
	methods: {
		initializeGrid() {
			this.grid = _.cloneDeep(require(`@web/m0006000/js/TAB064000.js`));

			dataProvider = new LocalDataProvider(false);
			gridView = new GridView(this.$refs.grid);

			gridView.setDataSource(dataProvider);
			dataProvider.setFields(this.grid.fields);
			gridView.setColumns(this.grid.columns);
			gridView.setOptions(this.grid.options);
			dataProvider.setRows(this.rows);
		},
		alert(type){
			if(type === '알림'){
				this.$alert("알림", "이 작업은 취소할 수 없습니다.", () => {
					console.log("Alert 닫힘");
				});
			}else if(type === '확인'){
				this.$confirm("확인", "이 작업을 <span style='color:blue'>진행</span>하시겠습니까?", (confirmed) => {
					if (confirmed) {
						console.log("사용자가 확인을 클릭했습니다.");
					} else {
						console.log("사용자가 취소를 클릭했습니다.");
					}
				});
			}else if(type === '선택'){
				this.$confirmYesOrNo("선택", "<span style='color:blue'>Yes</span> 또는 <span style='color:red'>No</span>를 선택하세요.", (confirmed) => {
					if (confirmed) {
						console.log("사용자가 '예'를 선택했습니다.");
					} else {
						console.log("사용자가 '아니오'를 선택했습니다.");
					}
				});
			}
		},
		upload(){
			let excelGrid = _.cloneDeep(this.grid);
			excelGrid.options.display.fitStyle = "none"; // 엑셀다운로드시 none 아니면 width 0이 됨.
			this.$refs.uploadPopup1.openDialog({
				dialogTitle: "샘플 업로드 팝업",
				uploadApi: "/api/sample/upload", 
				headers: ["field1","field2","field3","field4"],
				excelGrid,
				fileName: "샘플 업로드 양식"
			});
		},

		fileAttach() {
			this.$refs.fileAttachPopup1.openDialog({
				dialogTitle: "샘플 첨부 팝업",	
				groupId: "샘플 첨부파일"			
			});
		},

	}
}
</script>
<style lang="scss" scoped>
::v-deep table{
  border:1px solid #cacaca;
  th,td{
    padding: 2px 4px!important;
    border-right: 1px solid #dcdcdc;
    text-align: center!important;
    &:last-child{
      border-right: 0;
    }
    &.brd_r{
      border-right: 1px solid #dcdcdc!important;
    }
    &.head{
     background: #f0f8ff;
    }
    }
  thead{
    background: #f0f8ff;
    th{
      border-bottom: 1px solid #dcdcdc;
    }
  }
  td{
    border-bottom: 1px solid #dcdcdc;
  }
}
::v-deep .table-responsive{
  margin-bottom: 0;
  table{
    thead th {
      position: sticky;
      top: -1px;
      z-index: 1; /* 헤더가 다른 요소 위에 표시되도록 설정 */
      background-color: #f0f8ff; /* 헤더의 배경색 (부트스트랩 기본 배경색과 동일) */
    }
    .form-control-sm{
      min-height: 24px;
      height: 24px;
    }
  }
}
::v-deep .three_depth_tab{
    height: unset;
}
</style>