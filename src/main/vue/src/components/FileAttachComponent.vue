<template>
  <div class="file-attachment-component">
    <div class="mb-3">
      <input
        type="file"
        id="fileInput"
        class="form-control"
        ref="fileInput"
        multiple
        @change="onFileChange"
        style="display:none"
      />
    <div class="d-flex justify-content-end">
      <b-button class="second me-2" @click="uploadAllPendingFiles" v-bind:disabled="!isModifyEnabled">업로드</b-button>
      <b-button class="main me-2" @click="triggerFileInput" v-bind:disabled="!isModifyEnabled">파일 추가</b-button>
    </div>
    </div>
    <div class="file-list-container">
      <h5>파일 목록</h5>
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th scope="col" class="">파일명</th>
            <th scope="col">크기</th>
            <th scope="col">상태</th>
            <th scope="col">다운로드</th>
            <th scope="col">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fileItem, index) in fileList" :key="index">
            <td>{{ fileItem.fileName }}</td>
            <td>{{ formatFileSize(fileItem.fileSize) }}</td>
            <td>
              <span
                class="badge"
                :class="statusClass(fileItem.status)"
              >
                {{ fileItem.status }}
              </span>
            </td>
            <td>
              <b-button 
                v-if="fileItem.status === 'Uploaded'"
                class="btn-sm bi bi-box-arrow-in-down main"
                @click="downloadFile(fileItem)"
              >
              </b-button>
            </td>
            <td>
              <b-button
                class="btn-sm bi bi-trash3 btn-danger"
                @click="removeFile(index)"
                v-bind:disabled="!isModifyEnabled"
             />
             
            </td>
          </tr>
          <tr v-if="fileList.length === 0">
            <td colspan="5" class="text-center">업로드된 파일이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Action Buttons -->
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "파일 첨부",
    },
    uploadUrl: {
      type: String,
      required: true,
    },
    downloadUrl: {
      type: String,
      default: "/api/download/",
    },
    groupId: {
      type: String,
      default: "",
    },
    isModifyEnabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fileList: [],
      currentGroupId: this.groupId || `${this.$moment().format('YYYYMMDDHHmmssSSS')}_${this.$uuid()}`,
    };
  },
  watch: {
    groupId(value) {
      if (value !== "") {
        this.currentGroupId = value;
      }else{
        this.currentGroupId = `${this.$moment().format('YYYYMMDDHHmmssSSS')}_${this.$uuid()}`;
      }
      this.resetFileList(); // 파일 목록 초기화
      this.fetchFilesByGroupId(); // 새로운 groupId로 파일 목록 불러오기
    },
  },
  methods: {
    formatFileSize(size) {
      if (size < 1024) {
        return `${size.toFixed(2)} B`;
      } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`;
      } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
      } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click(); // 파일 입력 필드 트리거
    },
    onFileChange(event) {
      const files = Array.from(event.target.files);

      // 중복 방지 및 초기 상태 추가
      const newFiles = files.filter(
        (file) => !this.fileList.some((f) => f.name === file.name)
      );

      this.fileList = [
        ...this.fileList,
        ...newFiles.map((file) => ({
          file,
          fileName: file.name,
          fileSize: file.size,
          status: "Pending", // 초기 상태
        })),
      ];

      // 파일 입력 필드 초기화
      event.target.value = "";
    },
    async fetchFilesByGroupId() {
      try {
        const response = await this.$axios.get(`/api/files/readFiles/${this.currentGroupId}`);
        this.fileList = response.data.map((file) => ({
          id: file.id,
          fileName: file.fileName,
          fileSize: file.fileSize,
          status: "Uploaded", // 서버에서 가져온 파일은 이미 업로드된 상태
        }));
      } catch (error) {
        console.error("파일 목록 로드 실패:", error.response?.data || error);
        this.$toast("error", "파일 목록을 가져오는 데 실패했습니다.");
      }
    },
    async removeFile(index) {
      const fileItem = this.fileList[index];

      if (fileItem.status === "Uploaded") {
        try {
          const response = await this.$axios.delete(`/api/files/removeFile/${fileItem.id}`);

          if (response.status === 200) {
            // 파일 삭제 성공 시 파일 목록에서 제거
            this.fetchFilesByGroupId();
            this.$toast("success", "파일이 성공적으로 삭제되었습니다.");
          } else {
            this.$toast("error", "파일 삭제에 실패했습니다.");
          }
        } catch (error) {
          console.error("파일 삭제 실패:", error.response?.data || error);
          this.$toast("error", "파일 삭제에 실패했습니다.");
        }
      } else {
        this.fileList.splice(index, 1); // 업로드되지 않은 파일은 바로 삭제
      }
    },
    resetFileList() {
      this.fileList = []; // 파일 리스트 초기화
    },
    async uploadAllPendingFiles() {
      const pendingFiles = this.fileList.filter(
        (fileItem) => fileItem.status === "Pending"
      );

      if (pendingFiles.length === 0) {
        this.$toast("info", "업로드할 파일이 없습니다.");
        return;
      }

      const formData = new FormData();
      formData.append("groupId", this.currentGroupId);
      pendingFiles.forEach((fileItem) => {
        formData.append("files", fileItem.file);
      });

      try {
        const response = await this.$axios.post(`/api/files/uploadFile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          const uploadedFiles = await response.data;
          uploadedFiles.forEach((uploadedFile) => {
            const fileItem = this.fileList.find(
              (item) => item.fileName === uploadedFile.fileName
            );
            if (fileItem){
              fileItem.status = uploadedFile.status;
              fileItem.id = uploadedFile.id;
            } 
          });
        } else {
          this.$toast('error',"File upload failed.");
        }
      } catch (error) {
        console.error("업로드 오류:", error);
        this.$toast('error',"업로드 중 오류가 발생했습니다.");
      }
    },
    async downloadFile(fileItem) {
      try {
        const response = await this.$axios.post(`/api/files/downloadFile/${fileItem.id}`, {},
          {
            responseType: "blob", // 파일 데이터를 Blob 형식으로 수신
          }
        );

        // 서버에서 반환한 파일명을 Content-Disposition 헤더에서 추출
        const contentDisposition = response.headers["content-disposition"];
        let fileName = fileItem.name; // 기본 파일명 설정
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename\*?=['"]?([^;\n"]+)/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = decodeURIComponent(fileNameMatch[1].replace("UTF-8''", ""));
          }
        }

        // Blob 객체 생성
        const blob = new Blob([response.data], { type: response.headers["content-type"] });

        // Blob을 사용하여 파일 다운로드
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link); // Firefox 호환성을 위해 필요
        link.click();
        document.body.removeChild(link); // 다운로드 후 링크 제거
      } catch (error) {
        console.error("파일 다운로드 실패:", error);
        this.$toast("error", "파일 다운로드에 실패했습니다.");
      }
    },
    statusClass(status) {
      switch (status) {
        case "Pending":
          return "bg-warning text-dark";
        case "Uploaded":
          return "bg-success";
        case "Error":
          return "bg-danger";
        default:
          return "bg-secondary";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .table-bordered{
  th,td{text-align: center;}
}
.badge {
  padding: 5px 10px;
  font-size: 0.9em;
}
</style>
