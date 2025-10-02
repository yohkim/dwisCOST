<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="sm" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
    
    <b-form @submit.prevent="confirmClick">
      <b-form-group label="사용자 ID" label-for="userId">
        <b-form-input
          id="userId"
          v-model="params.userId"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="현재 비밀번호" label-for="currentPassword">
        <b-form-input
          id="currentPassword"
          v-model="params.currentPassword"
          type="password"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="새 비밀번호" label-for="newPassword">
        <b-form-input
          id="newPassword"
          v-model="params.newPassword"
          type="password"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="새 비밀번호 확인" label-for="confirmPassword">
        <b-form-input
          id="confirmPassword"
          v-model="params.confirmPassword"
          type="password"
          required
        ></b-form-input>
      </b-form-group>

      <div class="bttn_wrap">
        <b-button type="submit" class="main" block>확인</b-button>
        <b-button block @click="closeDialog">닫기</b-button>
      </div>
    </b-form>
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
        dialogTitle: "비밀번호 변경",
        userId:null,
        currentPassword:null,
        newPassword:null,
        confirmPassword:null,
      },
      list:[],
      zIndex: 0,      
    };
  },
  computed: {},
  created() {    
    // this.initializeGrid();		
  },
  mounted() {
    
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
    },
    closeDialog() {  
      this.$zIndexManager.release();
      this.isOpen = false;
    },
    gv(){
			return this.$refs[['grid']].getGridView();	
		},
		dp(){
			return this.$refs['grid'].getGridDataProvider();
		},
    
    confirmClick(){
      this.$confirmYesOrNo("선택", "변경 하시겠습니까?", (confirmed) => {
        if(confirmed){
          this.confirm();
        }
      });
    },
    async confirm(){
      // console.log("this.params:::",this.params);
      const response = await this.$axios.post('/api/auth/changepw',this.params);        
      let rs = response.data;
      if(rs !== 'OK'){
        this.$toast("info",rs);
      }else{
        this.$toast("info","정상 처리되었습니다.");
        this.closeDialog();
      }
    },
  },
};
</script>
