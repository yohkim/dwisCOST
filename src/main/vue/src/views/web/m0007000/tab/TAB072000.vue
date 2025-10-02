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
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Charger" v-model="params.charger" ref="chargerField" />
            <label for="floating">점검자</label>
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
      <div class="title">점검 입력 정보</div>
      <div class="row worker_info">
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="InspectionCharger" v-model="inspectionCharger" />
            <label for="floating">점검자</label>
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
          <b-button class="second me-0" @click="refreshClick">초기화</b-button>
          <div class="hr"></div>
          <b-button-group class="toggle_btn">
            <b-button :class="{ on: isStartEnabled }" :disabled="!isStartEnabled" @click="actionClick('start')">검사시작</b-button>
            <b-button class="sub" :disabled="!isEndEnabled" @click="updateResultValue">점검결과 일괄업데이트</b-button>
            <b-button :class="{ on: isEndEnabled }" :disabled="!isEndEnabled" @click="actionClick('end')">검사종료</b-button>
          </b-button-group>
          <div class="hr"></div>
          <b-button class="sub" :disabled="!isTempSaveEnabled" @click="saveClick">임시저장</b-button>
          <b-button class="main ms-2" :disabled="isStartProcessing" @click="inspectionClick">점검완료</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="cstGrid" :uid="'cstGrid'" :rows="cstRows" style="height: 100%" />
      </div>
    </div>
    <SelectUpdateValue ref="selectUpdateValue" @confirm="handleUpdateValueConfirm" />
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import SelectUpdateValue from '@web/popup/SelectUpdateValue.vue';
import { RowState } from 'realgrid';

export default {
  name: 'TAB072000',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: { SelectUpdateValue },
  watch: {},
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  data() {
    return {
      stepMap: {
        TAB072000: '세정',
        TAB072000_1: '강화',
      },
      gridSrcMap: {
        TAB072000: 'TAB072000',
        TAB072000_1: 'TAB072000_1',
      },
      menuId: 'M0007002',
      searchQueryIdMap: {
        TAB072000: 'M0007002_Sch1',
        TAB072000_1: 'M0007002_Sch2',
      },
      searchQrQueryIdMap: {
        TAB072000: 'M0007002_Sch1_Qr',
        TAB072000_1: 'M0007002_Sch2_Qr',
      },
      deleteTempQueryIdMap: {
        TAB072000: 'M0007002_TempDelete1',
        TAB072000_1: 'M0007002_TempDelete1',
      },
      tempSaveQueryIdMap: {
        TAB072000: 'M0007002_TempSave1',
        TAB072000_1: 'M0007002_TempSave2',
      },
      inspectionQueryIdMap: {
        TAB072000: 'M0007002_U_Inspection1',
        TAB072000_1: 'M0007002_U_Inspection1',
      },
      selectUpdateValueGridMap: {
        TAB072000: 'TAB072000Popup',
        TAB072000_1: 'TAB072000_1Popup',
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
      inspectionCharger: '',
      isStartEnabled: false,
      isEndEnabled: false,
      isTempSaveEnabled: false,
      isProcessing: false,
      isStartProcessing: false,
      isQrInputCstNoProcessing: false,
      aCheckList: ['세정외관', '세정Bar위치', '세정평탄도바닥과Cst', '세정평탄도앞면옆면', '세정평탄도뒷면옆면'],
      aCheckNameList: ['외관', ' Bar위치', ' 평탄도(바닥,CST)', ' 평탄도(앞,옆)', ' 평탄도(뒷,옆)'],
      bCheckList: ['강화브라켓지그일치유무', '강화슬롯상태', '강화Mesh올상태', '강화Mesh들뜸', '강화볼트체결', '강화외관'],
      bCheckNameList: ['브라켓지그일치유무', ' 슬롯상태', ' Mesh올상태', ' Mesh들뜸', ' 볼트체결', ' 외관'],
      tempSaved: [],
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
    this.cstGridView.setRowStyleCallback(this.rowStyleCallbackCheckStatus);
    this.cstGridView.setCheckableExpression("(values['카세트상태'] != '공정투입')", true);
  },
  beforeUnmount() {},
  methods: {
    initialize() {
      this.inspectionCharger = this.userAuthInfo.loginUserName;
    },
    initializeGrid() {
      this.cstGrid = _.cloneDeep(require(`@web/m0007000/js/` + this.gridSrcMap[this.tabId] + `.js`));
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

      this.isStartEnabled = false;
      this.isEndEnabled = false;
      this.isTempSaveEnabled = false;
      this.isStartProcessing = false;
      this.isQrInputCstNoProcessing = false;
      if (this.tabId == 'TAB072000') {
        this.cstGridView.setCheckableExpression("(values['카세트상태'] != '공정투입') and (values['종류'] = '세정')", true);
      } else if (this.tabId == 'TAB072000_1') {
        this.cstGridView.setCheckableExpression("(values['카세트상태'] != '공정투입') and (values['종류'] = '강화')", true);
      }

      this.isProcessing = true;

      this.$nextTick(async () => {
        this.cstGridView.commit();
        this.cstGridDataProvider.clearRows();
        this.cstGridView.setCheckBar({ visible: false });

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
            queryId: this.searchQueryIdMap[this.tabId],
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
        this.isTempSaveEnabled = false;
        this.isStartProcessing = false;
        this.isQrInputCstNoProcessing = true;
        if (this.tabId == 'TAB072000') {
          this.cstGridView.setCheckableExpression("(values['카세트상태'] != '공정투입') and (values['종류'] = '세정')", true);
        } else if (this.tabId == 'TAB072000_1') {
          this.cstGridView.setCheckableExpression("(values['카세트상태'] != '공정투입') and (values['종류'] = '강화')", true);
        }
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
        queryId: this.searchQrQueryIdMap[this.tabId],
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
            if (item['카세트상태'] == '공정투입') {
              this.$toast('info', '해당 Cst No.는 공정투입 상태라 추가되지 않습니다.');
            } else {
              this.cstGridDataProvider.insertRow(0, item);
              this.cstGridView.checkRow(0, true);
              this.cstGridDataProvider.setRowState(0, RowState.NONE);
            }
          });
        }
      }

      this.isProcessing = false;
      this.params.inputCstNo = '';
      this.$refs.inputCstNoField.focus();
      this.$refs.inputCstNoField.select();
    },
    async refreshClick() {
      this.cstGridView.commit();
      if (await this.deleteTempData()) {
        this.clearParams();
        this.searchClick();
      }
      this.isStartEnabled = false;
      this.isEndEnabled = false;
      this.isTempSaveEnabled = false;
      this.isStartProcessing = false;
      this.isQrInputCstNoProcessing = false;
      if (this.tabId == 'TAB072000') {
        this.cstGridView.setCheckableExpression("(values['카세트상태'] != '공정투입') and (values['종류'] = '세정')", true);
      } else if (this.tabId == 'TAB072000_1') {
        this.cstGridView.setCheckableExpression("(values['카세트상태'] != '공정투입') and (values['종류'] = '강화')", true);
      }
    },
    async deleteTempData() {
      let result = false;
      if (this.tempSaved.length <= 0) {
        return true;
      }

      let param = {
        menuId: this.menuId,
        delete: [{ queryId: this.deleteTempQueryIdMap[this.tabId], data: this.tempSaved }],
      };
      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', '임시저장 데이터가 삭제되었습니다.');
        this.tempSaved = [];
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    async saveClick() {
      this.cstGridView.commit();
      if (await this.saveData()) {
        // this.clearParams();
        // this.searchClick();
      }
    },
    async saveData() {
      let result = false;
      let saveData = this.$refs.cstGrid.getSaveData();
      if (saveData.update.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return;
      }
      let param = {
        menuId: this.menuId,
        insert: [{ queryId: this.tempSaveQueryIdMap[this.tabId], data: saveData.update }],
      };
      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', '저장되었습니다.');
        saveData.update.forEach((item) => {
          this.tempSaved.push(JSON.parse(JSON.stringify(item)));
        });
        this.isTempSaveEnabled = false;
        result = true;
        let stateRows = this.cstGridDataProvider.getAllStateRows();
        stateRows.updated.forEach((dataRow) => {
          this.cstGridDataProvider.setRowState(dataRow, RowState.NONE);
        });
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    async actionClick(action) {
      if (action === 'start' && !this.isStartProcessing) {
        let rows = this.cstGridView.getCheckedRows(false);
        if (rows.length == 0) {
          this.$toast('info', '체크된 내용이 없습니다.');
          return;
        }

        if (_.isEmpty(this.inspectionCharger)) {
          this.$toast('info', '검사자를 입력 후 다시 검사시작을 클릭하세요.');
          return;
        }

        this.isStartProcessing = true;
        let current = new Date();
        let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
        let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;
        if (this.tabId == 'TAB072000') {
          this.cstGridView.setCheckableExpression("(values['카세트상태'] != '공정투입') and (values['종류'] != '세정')", true);
          rows.forEach((dataRow) => {
            this.cstGridDataProvider.setValue(dataRow, '세정외관', '');
            this.cstGridDataProvider.setValue(dataRow, '세정Bar위치', '');
            this.cstGridDataProvider.setValue(dataRow, '세정평탄도바닥과Cst', '');
            this.cstGridDataProvider.setValue(dataRow, '세정평탄도앞면옆면', '');
            this.cstGridDataProvider.setValue(dataRow, '세정평탄도뒷면옆면', '');
            this.cstGridDataProvider.setValue(dataRow, '점검자', this.inspectionCharger);
            this.cstGridDataProvider.setValue(dataRow, '시작일자', cDate);
            this.cstGridDataProvider.setValue(dataRow, '시작시간', cTime);
            this.cstGridDataProvider.setValue(dataRow, '종료일자', '');
            this.cstGridDataProvider.setValue(dataRow, '종료시간', '');
            this.cstGridDataProvider.setValue(dataRow, '점검결과', '');
          });
        } else if (this.tabId == 'TAB072000_1') {
          this.cstGridView.setCheckableExpression("(values['카세트상태'] != '공정투입') and (values['종류'] != '강화')", true);
          rows.forEach((dataRow) => {
            this.cstGridDataProvider.setValue(dataRow, '강화브라켓지그일치유무', '');
            this.cstGridDataProvider.setValue(dataRow, '강화슬롯상태', '');
            this.cstGridDataProvider.setValue(dataRow, '강화Mesh올상태', '');
            this.cstGridDataProvider.setValue(dataRow, '강화Mesh들뜸', '');
            this.cstGridDataProvider.setValue(dataRow, '강화볼트체결', '');
            this.cstGridDataProvider.setValue(dataRow, '강화외관', '');
            this.cstGridDataProvider.setValue(dataRow, '점검자', this.inspectionCharger);
            this.cstGridDataProvider.setValue(dataRow, '시작일자', cDate);
            this.cstGridDataProvider.setValue(dataRow, '시작시간', cTime);
            this.cstGridDataProvider.setValue(dataRow, '종료일자', '');
            this.cstGridDataProvider.setValue(dataRow, '종료시간', '');
            this.cstGridDataProvider.setValue(dataRow, '점검결과', '');
          });
        }
        this.isStartEnabled = false;
        this.isEndEnabled = true;
      } else if (action === 'end' && this.isStartProcessing) {
        this.cstGridView.clearCurrent();
        this.cstGridView.commit();
        let rows = this.cstGridView.getCheckedRows(false);
        let jsonRows = this.cstGridDataProvider.getJsonRows(0, -1);
        let isEmpty = false;
        rows.forEach((dataRow) => {
          if (this.tabId == 'TAB072000' && !this.$utils.isRequiredFieldsFilled(jsonRows[dataRow], this.aCheckList)) {
            isEmpty = true;
          } else if (this.tabId == 'TAB072000_1' && !this.$utils.isRequiredFieldsFilled(jsonRows[dataRow], this.bCheckList)) {
            isEmpty = true;
          }
        });

        if (isEmpty) {
          if (this.tabId == 'TAB072000') {
            this.$toast('info', this.aCheckNameList.join() + '필수 입력입니다.');
          } else if (this.tabId == 'TAB072000_1') {
            this.$toast('info', this.bCheckNameList.join() + '필수 입력입니다.');
          }
          return;
        }

        let current = new Date();
        let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
        let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;
        rows.forEach((dataRow) => {
          this.cstGridDataProvider.setValue(dataRow, '종료일자', cDate);
          this.cstGridDataProvider.setValue(dataRow, '종료시간', cTime);
        });

        if (this.tabId == 'TAB072000') {
          this.cstGridView.setCheckableExpression("(values['카세트상태'] != '공정투입') and (values['종류'] = '세정')", true);
        } else if (this.tabId == 'TAB072000_1') {
          this.cstGridView.setCheckableExpression("(values['카세트상태'] != '공정투입') and (values['종류'] = '강화')", true);
        }
        this.isEndEnabled = false;
        this.isStartProcessing = false;
        this.isTempSaveEnabled = true;
      }
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
      let saveData = this.$refs.cstGrid.getSaveData();
      if (saveData.update.length > 0) {
        this.$toast('info', '변경된 내용이 있습니다. 임시저장 후 선택하세요.');
        return result;
      }

      let rows = this.cstGridView.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return result;
      }

      if (this.tempSaved.length == 0) {
        this.$toast('info', '점검결과를 임시저장한 내용이 없습니다.');
        return result;
      }

      let jsonRows = this.cstGridDataProvider.getJsonRows(0, -1);
      const updated = [];
      rows.forEach((dataRow) => {
        updated.push(jsonRows[dataRow]);
      });

      const checked = this.$utils.getCheckedRows(updated, [{ fieldName: '점검결과' }]);
      if (checked.length == 0) {
        this.$toast('info', '점검결과가 없습니다. 검사 후 임시저장을 완료해주세요.');
        return true;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: this.inspectionQueryIdMap[this.tabId], data: checked }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', `점검결과가 있는 항목이 대기 상태로 ${checked.length}건 변경되었습니다.`);
        this.tempSaved = [];
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    updateResultValue() {
      this.cstGridView.clearCurrent();
      this.cstGridView.commit();

      let params = {
        popUpSize: 'lg',
        popUpTitle: '점검결과 일괄업데이트 선택',
        tabId: this.tabId,
        gridJs: this.selectUpdateValueGridMap[this.tabId],
      };
      this.$refs.selectUpdateValue.openDialog(params);
    },
    handleUpdateValueConfirm(params) {
      let batchResults = params.jsonRows[0];

      let rows = this.cstGridView.getCheckedRows(false);
      rows.forEach((dataRow) => {
        if (this.tabId === 'TAB072000') {
          this.aCheckList.forEach((col) => {
            if (!_.isEmpty(batchResults[col])) this.cstGridDataProvider.setValue(dataRow, col, batchResults[col]);
          });
          this.setResultCheckList(this.cstGridDataProvider, dataRow);
        } else if (this.tabId === 'TAB072000_1') {
          this.bCheckList.forEach((col) => {
            if (!_.isEmpty(batchResults[col])) this.cstGridDataProvider.setValue(dataRow, col, batchResults[col]);
          });
          this.setResultCheckList(this.cstGridDataProvider, dataRow);
        }
      });

      if (rows.length > 0) {
        this.$toast('info', `점검결과 ${rows.length}건 변경되었습니다.`);
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
      this.isTempSaveEnabled = false;
      this.isStartProcessing = false;
      this.isQrInputCstNoProcessing = false;
    },
    rowStyleCallbackCheckStatus(grid, item, fixed) {
      var ret = {};
      if (!this.isStartProcessing || !item.checked) {
        ret.editable = false;
      }

      return ret;
    },
    onGetEditValueCstGrid(grid, index, result) {
      if (this.tabId === 'TAB072000') {
        if (this.aCheckList.includes(index.column) && result['value']) {
          let isOk = true;
          this.aCheckList.forEach((item) => {
            if (item != index.column && grid.getValue(index.itemIndex, item) != '적합' && isOk) {
              isOk = false;
            } else if (item == index.column && result['value'] != '적합' && isOk) {
              isOk = false;
            }
          });
          let isNotOk = false;
          if (!isOk) {
            this.aCheckList.forEach((item) => {
              if (item != index.column && grid.getValue(index.itemIndex, item) === '부적합') {
                isNotOk = true;
              } else if (item == index.column && result['value'] == '부적합') {
                isNotOk = true;
              }
            });
          }

          if (isOk) {
            grid.setValue(index.itemIndex, '점검결과', '적합');
          } else if (isNotOk) {
            grid.setValue(index.itemIndex, '점검결과', '부적합');
          } else {
            grid.setValue(index.itemIndex, '점검결과', '');
          }
        }
      } else if (this.tabId === 'TAB072000_1') {
        if (this.bCheckList.includes(index.column) && result['value']) {
          let isOk = true;
          this.bCheckList.forEach((item) => {
            if (item != index.column && grid.getValue(index.itemIndex, item) != '적합' && isOk) {
              isOk = false;
            } else if (item == index.column && result['value'] != '적합' && isOk) {
              isOk = false;
            }
          });
          let isNotOk = false;
          if (!isOk) {
            this.bCheckList.forEach((item) => {
              if (item != index.column && grid.getValue(index.itemIndex, item) === '부적합') {
                isNotOk = true;
              } else if (item == index.column && result['value'] == '부적합') {
                isNotOk = true;
              }
            });
          }

          if (isOk) {
            grid.setValue(index.itemIndex, '점검결과', '적합');
          } else if (isNotOk) {
            grid.setValue(index.itemIndex, '점검결과', '부적합');
          } else {
            grid.setValue(index.itemIndex, '점검결과', '');
          }
        }
      }
    },
    onItemCheckedCstGrid(grid, itemIndex, checked) {
      let rows = this.cstGridView.getCheckedRows(false);
      if (rows.length > 0) {
        this.isStartEnabled = true;
      } else {
        this.isStartEnabled = false;
      }
    },
    onItemAllCheckedCstGrid(grid, checked) {
      if (this.isStartProcessing) return;

      let rows = this.cstGridView.getCheckedRows(false);
      if (rows.length > 0 && checked) {
        this.isStartEnabled = true;
      } else {
        this.isStartEnabled = false;
      }
    },
    onEditRowPastedCstGrid(grid, itemIndex, row, fields, oldValues, newValues) {
      this.setResultCheckList(grid, itemIndex);
    },
    setResultCheckList(grid, itemIndex) {
      if (this.tabId === 'TAB072000') {
        let isNotOk = false;
        let isEmpty = false;
        this.aCheckList.forEach((item) => {
          if (grid.getValue(itemIndex, item) === '부적합') {
            isNotOk = true;
          } else if (_.isEmpty(grid.getValue(itemIndex, item))) {
            isEmpty = true;
          }
        });
        if (isNotOk) {
          grid.setValue(itemIndex, '점검결과', '부적합');
        } else if (isEmpty) {
          grid.setValue(itemIndex, '점검결과', '');
        } else {
          grid.setValue(itemIndex, '점검결과', '적합');
        }
      } else if (this.tabId === 'TAB072000_1') {
        let isNotOk = false;
        let isEmpty = false;
        this.bCheckList.forEach((item) => {
          if (grid.getValue(itemIndex, item) === '부적합') {
            isNotOk = true;
          } else if (_.isEmpty(grid.getValue(itemIndex, item))) {
            isEmpty = true;
          }
        });
        if (isNotOk) {
          grid.setValue(itemIndex, '점검결과', '부적합');
        } else if (isEmpty) {
          grid.setValue(itemIndex, '점검결과', '');
        } else {
          grid.setValue(itemIndex, '점검결과', '적합');
        }
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
