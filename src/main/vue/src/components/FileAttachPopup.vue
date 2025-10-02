<template>
  <b-modal v-model="isOpen" hide-footer  no-close-on-backdrop class="modal-lg" centered>    
    <template #title>
      {{ params.dialogTitle }}
    </template>
        <FileAttachComponent ref="fileAttach" :groupId="params.groupId" :isModifyEnabled="params.isModifyEnabled"/>
      <div class="bttn_wrap">
        <b-button  block @click="closeDialog">닫기</b-button>
      </div>   
  </b-modal>  
</template>

<script>

export default {
  name: "FileAttachPopup",
  props: {},
	data () {
		return {
      excelDownloadGrid: null,
			isOpen: false,
			params: {
        dialogTitle: "첨부 팝업",
        uploadApi: "/api/sample/fileUpload",
        groupId: "",
        isModifyEnabled: true,
			},
		}
	},
  computed: {},
  methods: {
		async openDialog(params) {
      Object.assign(this.params, params);
      this.$nextTick(()=>{
        this.$refs.fileAttach.resetFileList();
        this.$refs.fileAttach.fetchFilesByGroupId().then(()=>{
          this.isOpen = true;
        });
      });
		},
    closeDialog() {
      this.isOpen = false;
    },
    confirm() {
      this.closeDialog();
    },
    getGroupId(){
      return this.$refs.fileAttach.currentGroupId;
    }
  },

};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>