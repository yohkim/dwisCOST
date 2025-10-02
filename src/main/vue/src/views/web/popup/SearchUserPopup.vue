<template>
  <b-modal v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>    
    <div class="grid_box">
      <RealGrid ref="grid" :uid="'grid'" :rows="list" style="height: 570px" />
    </div>
    <div class="bttn_wrap">      
      <b-button  block @click="confirmClick">확인</b-button>
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "SearchUserPopupo",
  setup() {
	},
  props: {},
  emits: ["confirm"],
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "사용자 목록",        
      },
      list:[],
      zIndex: 0,      
      grid:null,
      gridRows:[],
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
      this.getUserList();
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
    initializeGrid(){
      this.grid = _.cloneDeep(require(`@web/popup/js/SearchUserPopup.js`));
    },
    async getUserList(){
      let param = {menuId:'M0006009',queryId:'selectUserList',target: this.list};
			await this.$axios.api.search(param);		
      
    },
    async confirmClick(){
      let sl = this.gv().getCheckedRows();
      if(_.isEmpty(sl)){
        this.$toast("info","선택된 사용자가 없습니다.");
        return;
      }

      let userIds = [];
      sl.forEach(row => {
        userIds.push(this.dp().getValue(row, "userId"));
      });
      
      this.closeDialog();
      this.$emit("confirm",userIds);
    },
    
    

    
    
    
  },
};
</script>
