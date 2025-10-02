<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
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
            <input autocomplete="off" type="text" class="form-control label-80" id="floating" placeholder="Charger" v-model="params.charger" ref="chargerField" />
            <label for="floating">세척작업자</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area refresh ms-2">
        <b-button class="refresh" @click="clearClick" />
        <b-button @click="searchClick" :disabled="isQrInputCstNoProcessing">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="worker_wrap">
      <div class="title">세척 입력 정보</div>
      <div class="row worker_info">
        <b-col cols="2">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="facility">
              <option v-for="type in facilityList" :key="type.value" :value="type">
                {{ type.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">설비호기</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="InspectionCharger" v-model="inspectionCharger" />
            <label for="floating">작업자</label>
          </div>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-80" id="floating" placeholder="InputCstNo" v-model="params.inputCstNo" ref="inputCstNoField" name="inputCstNo" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter2" />
            <label for="floating">QR code(CST)</label>
          </div>
        </b-col>
      </div>
    </div>
    <div class="grid_box material_box">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <div class="hr"></div>
          <b-button-group class="toggle_btn">
            <b-button :class="{ on: isStartEnabled }" :disabled="!isStartEnabled" @click="actionClick('start')">세척시작</b-button>
            <b-button :class="{ on: isEndEnabled }" :disabled="!isEndEnabled" @click="actionClick('end')">세척종료</b-button>
          </b-button-group>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="cstGrid" :uid="'cstGrid'" :rows="cstRows" style="height: 100%" />
      </div>
    </div>
  </div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: 'TAB073000',
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
      stepMap: {
        TAB073000: '세정',
        TAB073000_1: '강화',
      },
      menuId: 'M0007003',
      searchQueryId: 'M0007003_Sch1',
      searchQrQueryId: 'M0007003_Sch1_Qr',
      saveQueryIdMap: {
        start: 'M0007003_TempSave1',
        end: 'M0007003_Save1',
      },
      params: {
        type: null,
        model: null,
        cstNo: null,
        charger: null,
        inputCstNo: null,
      },
      cstGrid: null,
      cstRows: [],
      facility: '',
      facilityList: [],
      inspectionCharger: '',
      isStartEnabled: false,
      isEndEnabled: false,
      isProcessing: false,
      isStartProcessing: false,
      isQrInputCstNoProcessing: false,
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
    this.getSelectFacilityOptions();
  },
  beforeUnmount() {},
  methods: {
    initialize() {
      this.inspectionCharger = this.userAuthInfo.loginUserName;
    },
    initializeGrid() {
      this.cstGrid = _.cloneDeep(require(`@web/m0007000/js/TAB073000.js`));
    },
    async getSelectFacilityOptions() {
      let queryParams = { step: this.stepMap[this.tabId] };

      let param = [
        {
          menuId: 'M0007003',
          queryId: 'getFacility',
          queryParams: queryParams,
          callback: (data) => {
            this.$utils.transformData(data, ['value', 'text'], ['설비번호', '설비약명'], this.facilityList);
          },
        },
      ];
      await this.$axios.api.searchAll(param);
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
      this.searchClick(); // 검색 실행

      this.$refs.cstNoField.focus();
      this.$refs.cstNoField.select();
    },
    handleEnter2(event) {
      event.preventDefault(); // 기본 이벤트 방지

      this.searchClick2(); // 검색 실행
    },
    searchClick() {
      if (this.isProcessing) return;
      if (this.cstGridView != null) this.cstGridView.clearCurrent();
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.cstGridView.commit();
        this.cstGridDataProvider.clearRows();
        this.cstGridView.setCheckBar({ visible: false });
        this.isStartEnabled = false;
        this.isEndEnabled = false;
        this.isStartProcessing = false;
        this.isQrInputCstNoProcessing = false;

        let params = {
          step: this.stepMap[this.tabId],
          type: this.params.type,
          model: this.params.model,
          cstNo: this.params.cstNo,
          charger: this.params.charger,
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
    async searchClick2() {
      if (this.isProcessing) return;

      if (!this.isQrInputCstNoProcessing) {
        this.isStartEnabled = false;
        this.isEndEnabled = false;
        this.isStartProcessing = false;
        this.isQrInputCstNoProcessing = true;
        this.cstGridView.commit();
        this.cstGridDataProvider.clearRows();
        this.cstGridView.setCheckBar({ visible: true });
      }

      this.isProcessing = true;

      let params = {
        step: this.stepMap[this.tabId],
        cstNo: this.params.inputCstNo,
      };

      let searchParam = {
        menuId: this.menuId,
        queryId: this.searchQrQueryId,
        queryParams: params,
        target: null,
      };
 
      if (this.findRow() > 0) {
        this.$toast('info', '해당 Cst No. 중복되었습니다.');
      } else {
        let result = await this.$axios.api.search(searchParam);
        if (_.isEmpty(result)) {
          this.$toast('info', '해당 Cst No.를 찾을 수 없습니다.');
        } else {
          result.forEach((item) => {
            this.cstGridDataProvider.insertRow(0, item);
            this.cstGridView.checkRow(0, true);
            this.cstGridDataProvider.setRowState(0, RowState.NONE);
          });
        }
      }

      this.isProcessing = false;
      this.params.inputCstNo = '';
      this.$refs.inputCstNoField.focus();
      this.$refs.inputCstNoField.select();
    },
    async saveClick(action) {
      this.cstGridView.commit();
      if (await this.saveData(action)) {
        if (action === 'end') {
          this.clearParams();
          this.searchClick();
        }
      }
    },
    async saveData(action) {
      let result = false;
      let saveData = this.$refs.cstGrid.getSaveData();
      if (saveData.update.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: this.saveQueryIdMap[action], data: saveData.update }],
      };
      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', '저장되었습니다.');
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    async actionClick(action) {
      if (action === 'start') {
        let rows = this.cstGridView.getCheckedRows(false);
        if (rows.length == 0) {
          this.$toast('info', '체크된 내용이 없습니다.');
          return;
        }

        if (_.isEmpty(this.facility) || _.isEmpty(this.facility.value) || _.isEmpty(this.inspectionCharger)) {
          this.$toast('info', '설비호기 선택과 작업자를 입력 후 다시 세척시작을 클릭하세요.');
          return;
        }

        this.isStartProcessing = true;
        let current = new Date();
        let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
        let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;
        rows.forEach((dataRow) => {
          if (this.cstGridDataProvider.getValue(dataRow, '카세트상태') != '세척중') {
            this.cstGridDataProvider.setValue(dataRow, '세척설비', this.facility.value);
            this.cstGridDataProvider.setValue(dataRow, '설비약명', this.facility.text);
            this.cstGridDataProvider.setValue(dataRow, '최근세척시작일', cDate);
            this.cstGridDataProvider.setValue(dataRow, '최근세척시작시간', cTime);
            this.cstGridDataProvider.setValue(dataRow, '세척작업자', this.inspectionCharger);
            this.cstGridDataProvider.setValue(dataRow, '카세트상태', '세척중');
            this.cstGridDataProvider.setValue(dataRow, '최근세척종료일', '');
            this.cstGridDataProvider.setValue(dataRow, '최근세척종료시간', '');
          }
        });

        this.isStartEnabled = false;
        this.isEndEnabled = true;
        this.saveClick(action);
      } else if (action === 'end') {
        let current = new Date();
        let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
        let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;

        let rows = this.cstGridView.getCheckedRows(false);
        if (rows.length == 0) {
          this.$toast('info', '체크된 내용이 없습니다.');
          return;
        }

        rows.forEach((dataRow) => {
          if (this.cstGridDataProvider.getValue(dataRow, '카세트상태') == '세척중') {
            this.cstGridDataProvider.setValue(dataRow, '최근세척종료일', cDate);
            this.cstGridDataProvider.setValue(dataRow, '최근세척종료시간', cTime);
          }
        });

        this.isEndEnabled = false;
        this.isStartProcessing = false;
        this.saveClick(action);
      }
    },
    clearParams() {
      this.params.type = null;
      this.params.model = null;
      this.params.cstNo = null;
      this.params.charger = null;
      this.params.inputCstNo = null;
    },
    clearClick() {
      this.clearParams();
      this.cstGridDataProvider.clearRows();
      this.isStartEnabled = false;
      this.isEndEnabled = false;
      this.isStartProcessing = false;
      this.isQrInputCstNoProcessing = false;
    },
    onItemCheckedCstGrid(grid, itemIndex, checked) {
      let rows = this.cstGridView.getCheckedRows(false);
      if (rows.length > 0) {
        let cleaningCnt = 0;
        rows.forEach((dataRow) => {
          if (this.cstGridDataProvider.getRowState(dataRow) === RowState.UPDATED) {
            this.cstGridDataProvider.setValue(dataRow, '카세트상태', '세척중');
          }
          if (this.cstGridDataProvider.getValue(dataRow, '카세트상태') == '세척중') {
            cleaningCnt += 1;
          }
        });
        if (cleaningCnt > 0) {
          this.isEndEnabled = true;
        } else {
          this.isEndEnabled = false;
        }

        if (cleaningCnt != rows.length) {
          this.isStartEnabled = true;
        } else {
          this.isStartEnabled = false;
        }
      } else {
        this.isStartEnabled = false;
        this.isEndEnabled = false;
      }
    },
    onItemAllCheckedCstGrid(grid, itemIndex, checked) {
      let rows = this.cstGridView.getCheckedRows(false);
      if (rows.length > 0) {
        let cleaningCnt = 0;
        rows.forEach((dataRow) => {
          if (this.cstGridDataProvider.getRowState(dataRow) === RowState.UPDATED) {
            this.cstGridDataProvider.setValue(dataRow, '카세트상태', '세척중');
          }
          if (this.cstGridDataProvider.getValue(dataRow, '카세트상태') == '세척중') {
            cleaningCnt += 1;
          }
        });
        if (cleaningCnt > 0) {
          this.isEndEnabled = true;
        } else {
          this.isEndEnabled = false;
        }

        if (cleaningCnt != rows.length) {
          this.isStartEnabled = true;
        } else {
          this.isStartEnabled = false;
        }
      } else {
        this.isStartEnabled = false;
        this.isEndEnabled = false;
      }
    },
    findRow() {
      if (_.isEmpty(this.params.inputCstNo)) return;

      let fields = ['cstNo'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: this.params.inputCstNo,
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
        findCount++;
      }

      return findCount;
    },
  },
};
</script>
