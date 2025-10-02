<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Step" v-model="params.step" ref="stepField" />
            <label for="floating">종류</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Type" v-model="params.type" ref="typeField" />
            <label for="floating">타입</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Model" v-model="params.model" ref="modelField" />
            <label for="floating">모델</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="CstNo" v-model="params.cstNo" ref="cstNoField" name="cstNo" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter" />
            <label for="floating">CST NO</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Status" v-model="params.status" ref="statusField" />
            <label for="floating">상태</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area refresh ms-2">
        <b-button class="refresh" @click="clearClick" />
        <b-button @click="searchClick">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="worker_wrap">
      <div class="title">반출 입력 정보</div>
      <div class="row worker_info">
        <b-col cols="3">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="reason" v-model="reason" />
            <label for="floating">반출사유</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Department" v-model="dept" />
            <label for="floating">부서</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="InspectionCharger" v-model="inspectionCharger" />
            <label for="floating">담당자</label>
          </div>
        </b-col>
      </div>
    </div>
    <div class="grid_box material_box">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="main" @click="inspectionClick">반출신청</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="cstGrid" :uid="'cstGrid'" :rows="cstRows" style="height: 100%" />
      </div>
    </div>
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: 'TAB074001',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {},
  watch: {},
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  data() {
    return {
      menuId: 'M0007004',
      searchQueryId: 'M0007004_Sch1',
      inspectionQueryId: 'M0007004_U_Inspection1',
      params: {
        step: null,
        type: null,
        model: null,
        cstNo: null,
        status: null,
      },
      cstGrid: null,
      cstRows: [],
      reason: '',
      dept: '',
      inspectionCharger: '',
    };
  },
  computed: {
    cstGridDataProvider() {
      return this.$refs.cstGrid.getGridDataProvider();
    },
    cstGridView() {
      return this.$refs.cstGrid.getGridView();
    },
  },
  created() {
    this.initialize();
    this.initializeGrid();
  },
  mounted() {
    this.cstGridView.setCheckableExpression("values['카세트상태'] != '반출대기' ", true);
  },
  beforeUnmount() {},
  methods: {
    initialize() {
      this.dept = this.userAuthInfo.loginUserDeptName;
      this.inspectionCharger = this.userAuthInfo.loginUserName;
    },
    initializeGrid() {
      this.cstGrid = _.cloneDeep(require(`@web/m0007000/js/TAB074001.js`));
    },
    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },
    handleEnter(event) {
      event.preventDefault(); // 기본 이벤트 방지

      if (this.cstGridDataProvider.getRowCount() > 0) {
        this.findRow(); // cstNo 찾기
      } else {
        this.searchClick(); // 검색 실행

        this.$refs.cstNoField.focus();
        this.$refs.cstNoField.select();
      }
    },
    searchClick() {
      if (this.isProcessing) return;
      if (this.cstGridView != null) this.cstGridView.clearCurrent();
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.cstGridView.commit();
        this.cstGridDataProvider.clearRows();

        let params = {
          step: this.params.step,
          type: this.params.type,
          model: this.params.model,
          cstNo: this.params.cstNo,
          status: this.params.status,
        };

        let searchParam = [
          {
            menuId: this.menuId,
            queryId: this.searchQueryId,
            queryParams: params,
            target: this.cstRows,
          },
        ];
        let result = await this.$axios.api.searchAll(searchParam);
        if (result[0].length == 0) {
          return;
        }
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    async inspectionClick() {
      this.cstGridView.commit();
      if (await this.inspectionData()) {
        this.clearParams();
        this.searchClick();
      }
    },
    async inspectionData() {
      let result = false;

      let rows = this.cstGridView.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return;
      }

      if (_.isEmpty(this.reason) || _.isEmpty(this.dept) || _.isEmpty(this.inspectionCharger)) {
        this.$toast('info', '반출사유, 부서와 담당자를 입력 후 다시 반출신청을 클릭하세요.');
        return;
      }

      let current = new Date();
      let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
      let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;

      rows.forEach((dataRow) => {
        this.cstGridDataProvider.setValue(dataRow, '반출일', cDate);
        this.cstGridDataProvider.setValue(dataRow, '반출시간', cTime);
        this.cstGridDataProvider.setValue(dataRow, '반출부서', this.dept);
        this.cstGridDataProvider.setValue(dataRow, '반출자', this.inspectionCharger);
        this.cstGridDataProvider.setValue(dataRow, '반출사유', this.reason);
      });
      this.cstGridView.commit();
      let jsonRows = this.cstGridDataProvider.getJsonRows(0, -1);
      const updated = [];
      rows.forEach((dataRow) => {
        if ('부적합' == this.cstGridDataProvider.getValue(dataRow, '카세트상태값')) {
          updated.push(jsonRows[dataRow]);
        }
      });

      if (updated.length == 0) {
        this.$toast('info', '카세트상태값이 모두 부적합이 아닙니다.');
        return;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: this.inspectionQueryId, data: updated }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', `카세트상태값이 부적합인 건이 반출대기 상태로 ${updated.length}건 변경되었습니다.`);
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    clearParams() {
      this.params.step = null;
      this.params.type = null;
      this.params.model = null;
      this.params.cstNo = null;
      this.params.status = null;
    },
    clearClick() {
      this.clearParams();
      this.cstGridDataProvider.clearRows();
    },
    findRow() {
      if (_.isEmpty(this.params.cstNo)) return;

      let fields = ['cstNo'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: this.params.cstNo,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.cstGridView.searchCell(options);
        if (index == null) break;

        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        if (this.cstGridView.getValue(index.itemIndex, '카세트상태') != '반출대기') {
          this.cstGridView.checkRow(index.itemIndex, true);
          findCount++;
        }
      }

      if (findCount == 0 && this.cstGridDataProvider.getRowCount() > 0) {
        const message = `Cst No을 찾을 수 없거나 반출 대기 상태입니다.`;
        this.$toast('info', message);
      } else {
        // const message = `Cst No ${findCount}건이 선택되었습니다.`;
        // this.$toast('info', message);
      }

      this.params.cstNo = '';
      this.$refs.cstNoField.focus();
      this.$refs.cstNoField.select();
    },
  },
};
</script>
