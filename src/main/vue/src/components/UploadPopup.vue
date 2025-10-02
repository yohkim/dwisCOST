<template>
  <b-modal v-model="isOpen" hide-footer no-close-on-backdrop centered>
    <template #title>
      {{ params.dialogTitle }}
    </template>
    <div>
      <form id="fileUploadForm">
        <div class="mb-3">
          <label for="fileInput" class="form-label"><strong>업로드 파일</strong></label>
          <input type="file" class="form-control" id="fileInput" @dragover.prevent="handleDragOver" @drop.prevent="handleDrop" @change="handleFileChange" />
        </div>
      </form>
      <div class="d-flex justify-content-center">
        <b-button class="second" @click="downloadFile">다운로드</b-button>
        <b-button class="main" @click="uploadFile">업로드</b-button>
      </div>
    </div>
    <RealGrid ref="excelDownloadGrid" :uid="'excelDownloadGrid'" :rows="rows" style="display: none" />
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>
import { GridView, LocalDataProvider } from 'realgrid';

export default {
  name: 'UploadPopup',
  props: {},
  data() {
    return {
      excelDownloadGrid: null,
      isOpen: false,
      params: {
        dialogTitle: '업로드 팝업',
        uploadApi: '/api/sample/upload',
        headers: [],
        excelGrid: null,
        fileName: '',
        exportOptions: null,
      },
      selectedFile: null,
      fileError: null,
      allowedExtensions: [],
    };
  },
  computed: {
    isValidFile() {
      return this.selectedFile && !this.fileError;
    },
  },
  methods: {
    async openDialog(params) {
      this.resetFile();
      this.headers = [];
      Object.assign(this.params, params);
      this.excelDownloadGrid = this.params.excelGrid;
      this.$refs.excelDownloadGrid.created();
      this.isOpen = true;
    },
    closeDialog() {
      this.$emit('closePopup');
      this.isOpen = false;
    },
    confirm() {
      this.closeDialog();
    },
    excelDownloadGridGV() {
      return this.$refs.excelDownloadGrid?.getGridView();
    },
    excelDownloadGridDP() {
      return this.$refs.excelDownloadGrid?.getGridDataProvider();
    },
    resetFile() {
      this.selectedFile = null;
      this.fileError = null;

      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.value = '';
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (this.allowedExtensions.length == 0 || this.allowedExtensions.includes(fileExtension)) {
          this.selectedFile = file;
          this.fileError = null;
        } else {
          this.fileError = `Invalid file type. Only ${this.allowedExtensions.join(', ')} files are allowed.`;
          this.selectedFile = null;
        }
      } else {
        this.resetFile();
      }
    },
    handleDragOver(event) {
      console.log('Drag over detected on file input.');
    },
    handleDrop(event) {
      console.log('File drop detected, but prevented.');
    },
    async uploadFile() {
      if (this.isValidFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('headers', this.params.headers.join(','));
        try {
          const response = await this.$axios.post(this.params.uploadApi, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.status === 200) {
            console.log(response);
            if (_.isEmpty(response.data)) {
              this.$toast('info', 'File uploaded successfully!');
            } else {
              this.$toast('info', response.data);
            }
          } else {
            this.$toast('error', 'File upload failed.');
          }
        } catch (error) {
          this.$toast('error', 'An error occurred during file upload.');
        }
      }
    },
    downloadFile() {
      let options = {
        type: 'excel',
        target: 'local',
        fileName: this.params.fileName,
      };

      if (!_.isNil(this.params.exportOptions)) {
        options = {
          ...options,
          ...this.params.exportOptions,
        };
      }

      this.excelDownloadGridGV().exportGrid(options);
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  .btn {
    margin: 0 5px;
    border: 0;
    &.main {
      background-color: #232f4e;
      color: #2dc1dd;
    }
    &.second {
      background-color: #7487ad;
      color: #fff;
    }
  }
}
</style>
