<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
    <div>
      <RealGrid ref="grid" :uid="'grid'" :rows="list" style="height: 570px" />
    </div>
    <div class="bttn_wrap">      
      <b-button class="main" block @click="confirmClick">확인</b-button>
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>


export default {
  name: "EquipLogPopupo",
  setup() {
	},
  emits: ["confirm"],
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "CST NO 변경",
        peelingDiv:'1',
      },
      list:[],
      zIndex: 0,      
      grid:null,
    };
  },
  computed: {},
  created() {    
    this.initializeGrid();		
  },
  mounted() {
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
      this.setList();
    },
    closeDialog() {  
      this.gv().cancel();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    gv(){
			return this.$refs[['grid']].getGridView();	
		},
		dp(){
			return this.$refs['grid'].getGridDataProvider();
		},
    setList(){
      let tl = _.cloneDeep(this.params.cstRows);      
      this.list = [];
      tl.forEach(el => {
        let o = {};
          o['fCstno'] = el['fCstno'];
          o['tCstno'] = el['tCstno'];
          o['inCstno'] = '';
          this.list.push(o);
      });

      if(this.params['jobDiv'] === "start"){
        this.gv().columnByName("fCstno").visible = true;
        this.gv().columnByName("tCstno").visible = false;
      }else{
        this.gv().columnByName("fCstno").visible = false;
        this.gv().columnByName("tCstno").visible = true;
      }
    },
    initializeGrid(){
      this.grid = _.cloneDeep(require(`@web/popup/js/ChangeCstNo.js`));
    },
    confirmClick(){
      this.gv().commit();
      this.$confirmYesOrNo("선택", "입력 하시겠습니까?", (confirmed) => {
        if(confirmed){
          this.confirm();
        }
      });
    },
    confirm(){
      let list = this.dp().getJsonRows(0, -1);
      for(let i=0; i < list.length; i++){
        if(!_.isEmpty(list[i]['inCstno'])){
          this.params['cstRows'][i]['inCstno'] = list[i]['inCstno'];   
          this.params['cstRows'][i]['tCstno'] = list[i]['inCstno'];   
        }  
      }
      
      this.$emit('confirm',this.params);
      this.closeDialog();
    },

    onCellEditedGrid(grid, itemIndex, row, field){      
      grid.commit();
      //공백제거 추가
      let iv = grid.getValue(row, field);
      iv = iv.replace(/ /g,"");
      grid.setValue(row,field,iv);

      let f = this.params['jobDiv'] === "start"?'fCstno':'tCstno';
      let fv = grid.getValue(row,f);
      let v = grid.getValue(row,'inCstno');
      for(let i = 0; i < this.list.length; i++){
        if(this.list[i][f] === fv){ 
          grid.setValue(i,'inCstno',v);
        }
      }
    },
  },
};
</script>
