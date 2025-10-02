/** * 제조 실적 입력 > 포장/출하 > 출하 검사 의뢰 */
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3" class="period">
          <div class="form-floating me-1">
            <date-picker label="시작일" v-model="srchInfo.startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="종료일" v-model="srchInfo.endDate" />
            <label for="floatingPicker">종료일</label>
          </div>
        </b-col>
      </b-row>

      <div class="btn_area">
        <b-button @click="searchClick">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="title">출하검사 대기/의뢰 현황</div>
                <b-col cols="2">
                        <div style="width:400px"><span style="font-size: 12px; color: blue;">* 출하검사 의뢰할 모델을 선택해 주세요. </span></div>
                </b-col> 
      </div>
      <div class="grid-border-none" style="height: calc(27% - 40px)">
        <RealGrid ref="grid1" class="brd_b" :uid="'grid1'" :rows="grid1Rows" style="height: 100%" :fitLayoutWidthEnable="false"/>
      </div>
      <div class="search_box">
			<b-row class="search_area">
      <div class="worker_wrap">
        <div class="title">입력정보</div>
        <div class="row worker_info">
          <b-col cols="5" class="d-flex">
            <div class="form-floating" style="width: calc(100% - 80px)">
              <select class="form-select form-control-sm label-80" id="floatingSelect" aria-label="Floating label select example" v-model="params.user">
                <option v-for="type in chargerList" :key="type.value" :value="type">
                  {{ type.text }}
                </option>
              </select>
              <label for="floatingSelect" class="select">의뢰자</label>
            </div>
          <!--/b-col>
          <b-col cols="2"-->
            <div class="form-floating lot_run_num" >  
						<input type="text" class="form-control label-80 " id="floating" placeholder="RunNo"
                v-model="rMODEL"
                autocomplete="off"
                disabled
              />            
              <label for="floating">의뢰MODEL:</label>
            </div>
          </b-col>
          <b-col>
          <div class="btn_wrap ms-auto">
            <b-button v-show="searchDiv === 'SI의뢰_PACK'" class="main ms-1" @click="changeClick()">PACK 제외/추가</b-button>
            <!--b-button v-show="searchDiv === 'SI의뢰_PACK'" class="main" @click="cancelRequest">의뢰 취소</b-button-->
          </div>
          </b-col>
          <b-col>
          <div class="btn_wrap ms-auto">
            <!--b-button v-show="searchDiv === 'SI의뢰_PACK'" class="main ms-1" @click="changeClick()">제외/추가</b-button-->
            <b-button v-show="searchDiv === 'SI의뢰_PACK'" class="main" @click="cancelRequest()">의뢰 취소</b-button>
          </div>
          </b-col>
          <b-col cols="2" v-show="searchDiv === 'SI의뢰_PACK'">
            <div style="width:400px"><span style="font-size: 12px; color: blue;">* 선택 체크시 'PACK 제외/추가, 의뢰 취소' 가능</span></div>
          </b-col> 
        </div>
        <b-col cols="5">
          <div class="btn_wrap ms-auto">
              <b-button v-show="searchDiv === 'SI대기_PACK' || searchDiv === 'SI의뢰_PACK'" class="second"  @click="excelClick">엑셀</b-button>
              <b-button class="main" @click="startClick()">신규 PackNo LIST</b-button>
              <label v-show="visibleSave" class="ms-2"><input type="radio" v-bind:value="targetList[0]" v-model="params.target" class="me-1"  @change="changeTarget"/>출하검사 의뢰</label>
              <label v-show="visibleSave" class="ms-3 me-3"><input type="radio" v-bind:value="targetList[1]" v-model="params.target" class="me-1"  @change="changeTarget" />출하대기</label>
              <b-button v-show="visibleSave" class="main" @click="requestClick">{{ this.params.target+' 저장' }}</b-button>
          </div>
        </b-col>
        </div>
        </b-row></div>
      <!--/div-->
      <div v-show="searchDiv === 'SI대기'" class="grid-border-none" style="height: calc(75% - 40px)">
        <RealGrid ref="grid2" :uid="'grid2'" :rows="grid2Rows" style="height: 100%" />
      </div>
      <div v-show="searchDiv === 'SI대기_PACK'" class="grid-border-none" style="height: calc(75% - 40px)">
        <RealGrid ref="grid3" :uid="'grid3'" :rows="grid3Rows" style="height: 100%" />
      </div>
      <div v-show="searchDiv === 'SI의뢰_PACK'" class="grid-border-none" style="height: calc(75% - 50px)">
        <RealGrid ref="grid4" :uid="'grid4'" :rows="grid4Rows" style="height: 100%" />
      </div>
      <div v-show="searchDiv === 'SI의뢰변경'" class="grid-border-none" style="height: calc(75% - 50px)">      
      <b-row class="row" style="height: calc(100%)">
        <b-col cols="8" class="brd_r">
          <div class="left_box">
            <div class="title">출하검사 의뢰 PACK LIST</div>
          </div>
          <div class="grid-border-none">
            <RealGrid ref="grid5" :uid="'grid5'" :rows="grid5Rows" style="height: 100%" />
          </div>
        </b-col>
        <b-col cols="4">
          <div class="left_box">
            <div class="title">변경 List</div>
            <div class="btn_wrap ms-auto">
              <label class="ms-2"><input type="radio" v-bind:value="gubunList[0]" v-model="params.gubun" class="me-1" @change="changeGubun"/>제외</label>
              <label class="ms-3 me-3"><input type="radio" v-bind:value="gubunList[1]" v-model="params.gubun" class="me-1" @change="changeGubun"/>추가</label>
              <b-button class="main me-2" @click="saveClick">변경 저장</b-button>
            </div>
          </div>
          <div class="grid-border-none">
            <RealGrid ref="grid6" :uid="'grid6'" :rows="grid6Rows" style="height: 100%" />
          </div>
        </b-col>
      </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { useM0003009 } from '@web/store/M0003009.js';

export default {
  name: 'DW_TAB045200',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {},
  setup() {
		const srchInfo = useM0003009();
    const userAuthInfo = useUserAuthInfo();
    return { 
			srchInfo,
      userAuthInfo 
    };
  },
  watch: {},
  data() {
    return {
      rMODEL: null,
      grid1Rows: [],
      grid1: null,
      grid2Rows: [],
      grid2: null,
      grid3Rows: [],
      grid3: null,
      grid4Rows: [],
      grid4: null,
      grid5Rows: [],
      grid5: null,
      grid6Rows: [],
      grid6: null,
      params: {
        startDate: this.srchInfo.startDate,
        endDate: this.srchInfo.endDate,
        user: '',
        gubun: '제외',
        target: '출하검사 의뢰'
      },
      isProcessing: false,
      chargerList: [],
      emptyRow: { pack상태: '', 구분: '', 작업구분: '', model: '', packqrno: '', 수량: '', runid: '', packdate: '', 작업자: '', 외관검사: '', agb: '', pfl: '', eci: '', 비고: '' },
      searchDiv : 'SI대기',
      si_reqDate: '',
      si_reqSeq: '',
      gubunList: ['제외', '추가'],
      targetList: ['출하검사 의뢰', '출하대기 상태'],
      visibleSave: false,
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    grid1View() {
      return this.$refs.grid1.getGridView();
    },
    grid2View() {
      return this.$refs.grid2.getGridView();
    },
    grid3View() {
      return this.$refs.grid3.getGridView();
    },
    grid4View() {
      return this.$refs.grid4.getGridView();
    },
    grid5View() {
      return this.$refs.grid5.getGridView();
    },
    grid6View() {
      return this.$refs.grid6.getGridView();
    },
    data1Provider() {
      return this.$refs.grid1.getGridDataProvider();
    },
    data2Provider() {
      return this.$refs.grid2.getGridDataProvider();
    },
    data4Provider() {
      return this.$refs.grid4.getGridDataProvider();
    },
    data5Provider() {
      return this.$refs.grid5.getGridDataProvider();
    },
    data6Provider() {
      return this.$refs.grid6.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  mounted() {
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB045200_1.js`));
      this.grid2 = _.cloneDeep(require(`@web/m0003000/js/TAB045200_2.js`));
      this.grid3 = _.cloneDeep(require(`@web/m0003000/js/TAB045200_3.js`));
      this.grid4 = _.cloneDeep(require(`@web/m0003000/js/TAB045200_4.js`));
      this.grid5 = _.cloneDeep(require(`@web/m0003000/js/TAB045200_5.js`));
      this.grid6 = _.cloneDeep(require(`@web/m0003000/js/TAB045200_6.js`));
    },
    async getSelectOptions() {
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      await this.$utils.getCommonCodeValueText(['58'], [this.chargerList]); //의뢰자
    },
  cancelRequest(){
      if (_.isEmpty(this.params.user) || _.isEmpty(this.params.user.text)) {
        this.$toast('info', '의뢰자를 입력 후 다시 의뢰 취소를 누르세요.');
        return false;
      }
      if(this.si_reqDate==='' || this.si_reqSeq == ''){
        this.$toast('info','의뢰 취소할 의뢰 차수를 선택하세요');
        return;
      }else {
        // alert(`의뢰취소는\n 의뢰일자 :${this.si_reqDate}\n 의뢰차수 :${this.si_reqSeq}\n`+
        //        '모든 PACK을 출하검사 대기 상태로 돌아가게 합니다');
        this.$confirm(
          // "확인",
          // `의뢰일자 : ${this.si_reqDate}, 의뢰차수 : ${this.si_reqSeq} 모든 PACK을 출하검사 의뢰취소 하시겠습니까?.`,
          "확인",
          [
            `의뢰일자 : ${this.si_reqDate}`,
            `의뢰차수 : ${this.si_reqSeq}`,
            '',
            '모든 PACK을 출하검사 의뢰취소 하시겠습니까?'
          ].join('\n'),
          async (confirm) => {
            if (confirm) {
              let params = {
                reqDate: this.si_reqDate,
                reqSeq: this.si_reqSeq,
                cancelUser: this.params.user.text
              };
              console.log(params);
              // if (this.isObjectEmptyExcept(params)) {
              //   this.$toast("error", "의뢰취소 정보를 모두 확인해주세요.");
              //   return;
              // }
              
              let param = {
                menuId: "M0003009",
                queryId: "M0003009_ExecCancel",
                queryParams: params,
                target: null,
              };
              //this.$toast('info',JSON.stringify(param,null,2)); return;
              const resp = await this.$axios.api.search(param);
              if (!resp || resp.length === 0) {
                throw new Error('서버 응답이 없습니다.');
              }
              const response = resp[0]; //this.$toast('info',JSON.stringify(response,null,2)); return;
              const messageType = response.errormessage ? 'error' : response.message ? 'info' : 'success';
              const messageText = response.errormessage ? 'DB 오류' +response.errormessage : response.message ? response.message : `의뢰일자 : ${this.si_reqDate}\n의뢰차수 : ${this.si_reqSeq}\n모든 PACK을 출하검사 의뢰 취소 했습니다.`; 

              this.$toast(messageType, messageText);
                      
              this.grid4View.commit();
              this.data4Provider.clearRows();
              this.searchClick();
            }
          }
        );        
      }         
    },
    clearGridOther() {
      this.grid4View.resetFilters();
      this.grid4View.clearCurrent();
      this.data4Provider.clearRows();
      
      this.grid5View.resetFilters();
      this.grid5View.clearCurrent();
      this.data5Provider.clearRows();

      this.grid6View.resetFilters();
      this.grid6View.clearCurrent();
      this.grid6View.commit();
      this.data6Provider.clearRows();
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.grid1View.resetFilters();
        this.grid1View.clearCurrent();
        this.data1Provider.clearRows();

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          return;
        }

        let params = {
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch31_Col',
          queryParams: params,
          target: null,
        };

        let result1 = await this.$axios.api.search(searchParam);  
        //this.$toast('warning',JSON.stringify(result1, null, 2));
        const gridField = _.cloneDeep(require(`@web/m0003000/js/TAB045200_1.js`));
        result1.forEach((item) => {
          gridField.fields.push({
            fieldName: item.model.toLowerCase(),
            valueType: 'number',
            dataType: 'number' , 
          });

          gridField.columns.push({
            name: item.model.toLowerCase(),
            fieldName: item.model.toLowerCase(),
            width: 80,
            header: {
              text: item.model,
            },
            autoFilter: true,
            numberFormat: '#,###.###',
            styleName: 'tr',
          });
        });

        this.data1Provider.setFields(gridField.fields);
        this.grid1View.setColumns(gridField.columns);

        let searchParam2 = {
          menuId: 'M0003009',
          queryId: 'M0003009_Sch31',
          queryParams: params,
          target: this.grid1Rows,
        };

        let result2 = await this.$axios.api.search(searchParam2);
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    async saveClick() {
      this.grid6View.commit();
      if (await this.saveData()) {
        //this.searchAllClick();
      }
    },
    async saveData() {
      let result = false;
      let saveData = this.$refs.grid6.getSaveData();
      //this.$toast('info',JSON.stringify(saveData,null,2)); 
      if (saveData.delete.length <= 0 && saveData.insert.length <= 0 && saveData.update.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.1');
        return result;
      }

      const removeItems = [];
      const addItems = [];
      const ngItems = [];
      saveData.insert.forEach((item) => {
        if (!_.isEmpty(item['packQrno']) && item['gubun'] == 'NG') {
          ngItems.push(item['packQrno']);
        } else if (!_.isEmpty(item['packQrno'])  && item['gubun'] == '제외') {
          removeItems.push(item['packQrno']);
        } else if (!_.isEmpty(item['packQrno']) && item['gubun'] == '추가') {
          addItems.push(item['packQrno']);
        }
      });

      // if (ngItems.length > 0) {
      //   this.$toast('info', '검사결과가 NG인 건이 있습니다. 저장이 진행되지 않습니다.');
      //   return result;
      // }

      if (removeItems.length <= 0 && addItems.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.2');
        return result;
      }

      if ((addItems.length > 0 || removeItems.length > 0) && (_.isEmpty(this.params.user) || _.isEmpty(this.params.user.text))) {
        this.$toast('info', '의뢰자를 입력 후 다시 저장을 누르세요.');
        return result;
      }

      // this.$toast('info',JSON.stringify(removeItems,null,2));
      // this.$toast('info',JSON.stringify(addItems,null,2));
      // return;

      if (removeItems.length > 0) {
        let params = {
          reqDate : this.si_reqDate,
          reqSeq : this.si_reqSeq,
          removelUser: this.params.user.text,
          packNoList: removeItems.join(';'),
        };
        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExecRemovePack',
          queryParams: params,
          target: null,
        };
      //this.$toast('info',JSON.stringify(searchParam,null,2)); return;

        const resp = await this.$axios.api.search(searchParam);
        if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
          this.$toast('error', resp[0].errormessage);
        } else if (resp != null && resp.length > 0 && !_.isNil(resp[0].message)) {
          this.$toast('error', resp[0].message);
        } else {
          this.$toast('success', `${removeItems.length}건 제거되었습니다.`);
        }
        result = true;
      }

      if (addItems.length > 0) {
          let params = {
          reqDate : this.si_reqDate,
          reqSeq : this.si_reqSeq,
          addUser: this.params.user.text,
          packNoList: addItems.join(';'),
        };
        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExecAddPack',
          queryParams: params,
          target: null,
        };
      //this.$toast('info',JSON.stringify(searchParam,null,2)); //return;

        const resp = await this.$axios.api.search(searchParam);
        if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
          this.$toast('error', resp[0].errormessage);
        } else {
          this.$toast('success', `${addItems.length}건 추가되었습니다.`);
        }
        result = true;
      }
      this.changeClick();
      this.searchClick();

      return result;
    },
    setPackNoFocus(r) {
      this.grid2View.setCurrent({ dataRow: r, fieldName: 'packQrno' });
      setTimeout(() => {
        this.grid2View.showEditor();
      }, 100);
    },
    changeTarget() {
      if(this.params.target === '출하대기')
        this.grid2View.setColumnProperty("특이사항", "visible", true);
      else
        this.grid2View.setColumnProperty("특이사항", "visible", false);
    }, 
    changeGubun() {
      this.grid6View.commit();
      this.data6Provider.clearRows();
      this.data6Provider.addRow({});
      this.setPackNoFocus(0);
    },
    changeClick(){
      if(this.si_reqDate === '' || this.si_reqSeq === ''){
        this.$toast('warning','왼쪽 선택에서 의뢰일자,의뢰차수를 선택해주세요');
        return;
      } 
      
      this.clearGridOther();
      this.searchDiv = 'SI의뢰변경'
      
      let params = {
          reqDate : this.si_reqDate,
          reqSeq: this.si_reqSeq,
        };
      let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExeReqDateSeq',
          queryParams: params,
          target: this.grid5Rows,
        };

        let rslt = this.$axios.api.search(searchParam);
        this.data6Provider.addRow({});
        this.setPackNoFocus(0);
    },
    startClick() {
     // this.grid2View.setColumnProperty("특이사항", "visible", false);
      this.visibleSave = true;
      this.searchDiv = 'SI대기';
      this.grid2View.resetFilters();
      //this.grid2View.clearCurrent();
      this.data2Provider.clearRows();
      this.data2Provider.addRow({});
      this.setPackNoFocus(0);
    },
    async requestClick() {
      console.log('info',this.params.target); //return;
      try {
        let saveData = this.$refs.grid2.getSaveData();  //console.log('info',saveData); return;
        if (saveData.insert.length === 0) {
          this.$toast('info', '변경된 내용이 없습니다.');
          return false;
        }

        this.grid2View.commit();
        const addItems = saveData.insert.filter((item) => !_.isEmpty(item['packqrno']) && !_.isEmpty(item['pack상태'])).map((item) => item['packqrno']);

        if (addItems.length === 0) {
          this.$toast('info', `${this.params.target}할 Pack No 정보가 없습니다.`);
          return false;
        }

        if (_.isEmpty(this.params.user) || _.isEmpty(this.params.user.text)) {
          this.$toast('info', '의뢰자를 입력 후 다시 출하 검사 의뢰를 누르세요.');
          return false;
        }

        if(this.params.target == '출하검사 의뢰'){
          let params = {
              user: !_.isEmpty(this.params.user) ? this.params.user.text : '',
              packNoList: addItems.join(','),
          };

          const searchParam = {
            menuId: 'M0003009',
            queryId: 'M0003009_RequestInspection',
            queryParams: params,
            target: null,
          };
          const resp = await this.$axios.api.search(searchParam);
          if (!resp || resp.length === 0) {
            throw new Error('서버 응답이 없습니다.');
          } 
          const response = resp[0];
          const messageType = response.errormessage ? 'error' : response.message ? 'info' : 'success';
          const messageText = response.errormessage ? response.errormessage : response.message ? response.message :`Pack No ${addItems.length}건이 출하 검사 의뢰 되었습니다.`; 
          this.$toast(messageType, messageText);
          this.searchClick();
          this.grid2View.resetFilters();
          this.grid2View.clearCurrent();
          this.data2Provider.clearRows();
          return true;
        }
        else 
        {
          this.$confirm(
            "확인",
            `입력한 PACK_NO ${addItems.length}개를 출하대기로 보내시겠습니까?`, async (confirm) => {
              if (confirm) {
                try {
                  // Filter and map the items
                  const shipItem = saveData.insert
                    .filter(item => !_.isEmpty(item['packqrno']) && !_.isEmpty(item['pack상태']))
                    .map(item => ({
                      packqrno: item['packqrno'],
                      uerid: !_.isEmpty(this.params.user) ? this.params.user.text : '',
                      comment: item['특이사항'],
                    }));

                  const param2 = {
                    menuId: "M0003009",
                    insert: [{ queryId: "M0003009_WaitShipment", data: shipItem }]
                  };

                  // Wait for the API response
                  const resp2 = await this.$axios.api.saveData(param2);
                  
                 //console.log('API Response:', resp2);
                  
                  if (!_.isNil(resp2?.message) && resp2.status === 'failure') {
                    throw new Error(resp2.message);
                  } else if (resp2?.message) {
                    this.$toast("info", resp2.message+`\n PACK_NO ${addItems.length}개를 출하대기로 보냈습니다`);
                  }
                // 공통 성공 처리
                  this.searchClick();
                  this.grid2View.resetFilters();
                  this.grid2View.clearCurrent();
                  this.data2Provider.clearRows();
                  return true;
                } catch (error) {
                  console.error('Error:', error);
                  this.$toast("error", error.message || '처리 중 오류가 발생했습니다.');
                }
              }
            }
          );
          //SI대기 -> 출하대기(소포장 반출)  End
        }
      } catch (error) {
        console.error('출하 검사 의뢰 중 오류 발생:', error);
        this.$toast('error', error.message || '출하 검사 의뢰 처리 중 오류가 발생했습니다.');
        return false;
      }
    },
    setPackNoFocus(r) {
      this.grid6View.setCurrent({ dataRow: r, fieldName: 'packQrno' });
      setTimeout(() => {
        this.grid6View.showEditor();
      }, 100);
    },
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackGrid1(grid, cell) {
      let rtn = {};
      let ds = grid.getDataSource();
      const fieldName = cell.index.fieldName;
      if (fieldName != '상태' && fieldName != '구분' && cell.value > 0) {
        rtn['renderer'] = {
          type: 'link',
          urlCallback: function (grid, cell) {},
          titleField: 'fieldName',
        };
      }
      return rtn;
    },
    onCellItemClickedGrid1(grid, index, clickData) {
       this.rMODEL=clickData.fieldName.toUpperCase();
       return false;
    },
    onDataLoadComplatedGrid2(grid) {},
    onCellEditedGrid2(grid, itemIndex, row, field) {
      this.grid2View.commit();
      console.log('info',field);
      if(field != 4) return;  //PackNo 가 아니면
      let newValue = this.$utils.korToEng(grid.getValue(row, field));
      grid.setValue(row, field, newValue);
      if (!_.isEmpty(newValue)) {
        let grid2FindCnt = this.findRowInGrid2(newValue);
        if (grid2FindCnt > 1) {
          this.$toast('info', `해당 Pack No는 중복되었습니다.`);
          grid.setValue(row, 'packQrno', '');
          this.setPackNoFocus(row);
        } else {
          this.checkPackNo(row, grid.getValue(row, 'packQrno'), true);
        }
      } else {
        grid.setValues(row, this.emptyRow);
      }
    },
    onRowsPastedGrid2(grid, items) {
      items.forEach((row) => {
        let newValue = this.$utils.korToEng(grid.getValue(row, 'packQrno'));
        grid.setValue(row, 'packQrno', newValue);
        if (!_.isEmpty(newValue)) {
          let grid2FindCnt = this.findRowInGrid2(newValue);
          if (grid2FindCnt > 1) {
            this.$toast('info4', `${row + 1}행 Pack No는 중복되었습니다.`);
            grid.setValue(row, 'packQrno', '');
          } else {
            this.checkPackNo(row, grid.getValue(row, 'packQrno'), false);
          }
        } else {
          grid.setValues(row, this.emptyRow);
        }
      });
    },
    findRowInGrid2(packNo) {
      if (_.isEmpty(packNo)) return 0;

      let fields = ['packQrno'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: packNo,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.grid2View.searchCell(options);
        if (index == null) break;

        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        findCount++;
      }
      return findCount;
    },
    async checkPackNo(row, packNo, isFocus) {
      let params = {
        startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
        endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
        packNo: packNo,
      };

      let searchParam = {
        menuId: 'M0003009',
        queryId: 'M0003009_ExeInspectionInfo',
        queryParams: params,
        target: null,
      };

      let rslt = await this.$axios.api.search(searchParam);
      let info = rslt[0];
      let focusRow = row;
      //this.$toast('warning', JSON.stringify(info, null, 2));
      if (_.isEmpty(info)) {
        this.$toast('warning', 'Pack No에 대한 정보가 없습니다.');
        this.grid2View.setValue(row, 'packQrno', '');
      } else if (info != null && !_.isNil(info.message)) {
        this.$toast('info', info.message);
        this.grid2View.setValue(row, 'packQrno', '');
      } else if (info != null && !_.isNil(info.errmsg)) {
        this.$toast('error', info.errmsg);
        this.grid2View.setValue(row, 'packQrno', '');
      } else if (info != null && !_.isNil(info.수량)) {
        if (this.checkModel(info)) {
          this.grid2View.setValues(row, info);
          // this.data2Provider.addRow({});  2025.08.10
          // focusRow = row + 1;
        } else {
          this.$toast('warning', '동일한 모델의 Pack No를 입력해주세요.');
          this.grid2View.setValue(row, 'packQrno', '');
        }
      } else {
        this.$toast('warning', 'Pack No에 대한 정보가 없습니다.');
        this.grid2View.setValue(row, 'packQrno', '');
      }

      if (isFocus) {
        this.data2Provider.addRow({});
        focusRow = row + 1;
        this.setPackNoFocus(focusRow);
      }
    },
    checkModel(info) {
      let model = '';
      for (let i = 0; i < this.grid2View.getItemCount() - 1; i++) {
        let getModel = this.grid2View.getValue(i, 'model');
        if (!_.isEmpty(getModel)) {
          model = getModel;
          console.log(model);
          break;
        }
      }

      if (_.isEmpty(model)) return true;
      if (info.model != model) return false;

      return true;
    },
   async onCellClickedGrid1(grid, clickData) {
      try {
        if (clickData.cellType === 'header'|| clickData.cellType === 'footer') return;
        this.clearGridOther(); 
        let params = {
        startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
        endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
        model: clickData.column,
      };
      const current = grid.getCurrent();
			const rowIndex = current.itemIndex;
      const value = grid.getValue(rowIndex, '상태');
      if(value === "출하검사 대기"){
      //if(rowIndex <= 1){
        this.searchDiv ='SI대기_PACK';this.visibleSave = false;
        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExeInspectionPack',
          queryParams: params,
          target: this.grid3Rows,
        };
        let rslt = await this.$axios.api.search(searchParam);
       } 
       else {
        this.si_reqDate = '';
        this.si_reqSeq = '';
        this.searchDiv ='SI의뢰_PACK';this.visibleSave = false;

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExeReqPack',
          queryParams: params,
          target: this.grid4Rows,
        };
          this.$axios.api.search(searchParam); 
          const gridView = this.grid4View;
          try {
        // 그룹 푸터 설정
            //gridView.setColumnProperty("수량", "groupFooter", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f", fontBold: true}});            
        // 전체 푸터 설정
            //gridView.setColumnProperty("수량", "footer", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f",fontBold: true}});
          } finally {
          }
          //gridView.groupBy(["의뢰일자","의뢰차수"]);
          // 다중 레벨 병합
          gridView.checkBar.mergeRule = "value['의뢰일자'] + '|' + value['의뢰차수']" ;
       } 
        
      } catch (error) {
        console.log(error);
      } finally {
        //this.isLoading = false;
      } 
      this.grid3View.onShowTooltip = this.onShowTooltip;
  },
  async onCellClickedGrid4(grid, clickData) {
      try {
        const prod = grid.getDataSource();
        let row = prod.getJsonRow(clickData.dataRow);
        if (clickData.cellType == "check") {  //clickData.column === '의뢰차수' || 
          this.si_reqDate = row.의뢰일자;
          this.si_reqSeq = row.의뢰차수;
          const value = row.검사단계;
          if (value !== null && !["샘플 요청", "샘플 미요청"].includes(value)) {
              this.$toast('warning', `이미 ${value} 되었습니다`);
              //const isChecked = grid.isCheckedRow(clickData.dataRow);
              grid.checkAll(false); // 체크박스 해제
              return;
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        //this.isLoading = false;
      }
   },
   async checkPackAdd(row, packNo, isFocus) {
      let params = {
        startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
        endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
        packNo: packNo,
      };

      let searchParam = {
        menuId: 'M0003009',
        queryId: 'M0003009_ExeInspectionInfo',
        queryParams: params,
        target: null,
      };

      let rslt = await this.$axios.api.search(searchParam);
      let info = rslt[0];
      let focusRow = row;
      //this.$toast('warning', JSON.stringify(info, null, 2));
      if (_.isEmpty(info)) {
        this.$toast('warning', 'Pack No에 대한 정보가 없습니다.');
        this.grid6View.setValue(row, 'packQrno', '');
      } else if (info != null && !_.isNil(info.message)) {
        this.$toast('info', info.message);
        this.grid6View.setValue(row, 'packQrno', '');
      } else if (info != null && !_.isNil(info.errmsg)) {
        this.$toast('error', info.errmsg);
        this.grid6View.setValue(row, 'packQrno', '');
      } else if (info != null && !_.isNil(info.수량)) {
       // if (this.checkModelAdd(info)) {
        if (info.model === this.rMODEL) {
          this.grid6View.setValues(row, info);
          this.grid6View.setValue(row, 'gubun', this.params.gubun);
          this.data6Provider.addRow({});
          focusRow = row + 1;
        } else {
          this.$toast('warning', '동일한 모델의 Pack No를 입력해주세요.');
          this.grid6View.setValue(row, 'packQrno', '');
        }
      } else {
        this.$toast('warning', 'Pack No에 대한 정보가 없습니다.');
        this.grid6View.setValue(row, 'packQrno', '');
      }

      if (isFocus) this.setPackNoFocus(focusRow);
    },
    checkModelAdd(info) { 
      // let model = '';
      // for (let i = 0; i < this.grid6View.getItemCount() - 1; i++) {
      //   let getModel = this.grid6View.getValue(i, 'model');
      //   if (!_.isEmpty(getModel)) {
      //     model = getModel;
      //     console.log(model);
      //     break;
      //   }
      // }

      // if (_.isEmpty(model)) return true;
      // if (info.model != model) return false;

      // return true;
      //this.$toast('warning', info.model+':'+this.rMODEL);
      if(info.model === this.rMODEL) return true;
      else return false;
    },
   onCellEditedGrid6(grid, itemIndex, row, field) {
      this.grid6View.commit();
      let newValue = this.$utils.korToEng(grid.getValue(row, 'packQrno'));
      grid.setValue(row, 'packQrno', newValue);
      if (this.params.gubun == '제외') {
        this.checkPackNo6(row, grid.getValue(row, 'packQrno'));
      } 
      else {//추가
        // this.grid6View.commit();
        // let newValue = this.$utils.korToEng(grid.getValue(row, field));
        // grid.setValue(row, field, newValue);
        if (!_.isEmpty(newValue)) {
          let grid6FindCnt = this.findRowInGrid6(newValue);
          if (grid6FindCnt > 1) {
            this.$toast('info', `해당 Pack No는 중복되었습니다.`);
            grid.setValue(row, 'packQrno', '');
            this.setPackNoFocus(row);
          } else {
            this.checkPackAdd(row, grid.getValue(row, 'packQrno'), true);
          }
        } else {
          grid.setValues(row, this.emptyRow);
        }
      }  
    },
    async checkPackNo6(row, packNo) {
      let focusRow = row;
          let findCount = this.findRowInGrid6(packNo);
          if (findCount > 1) {
            this.$toast('info', '해당 Pack No. 중복되었습니다.');
            this.grid6View.setValue(row, 'packQrno', '');
            this.setPackNoFocus(row);
          } else {
            findCount = this.findRowInGrid5(packNo);
            console.log(findCount);
            if (findCount !== 0) {
                this.grid6View.setValue(row, '일치여부', '존재');
                this.grid6View.setValue(row, 'runId', this.grid5View.getValue(findCount.itemIndex,'runId'));
                this.grid6View.setValue(row, '수량', this.grid5View.getValue(findCount.itemIndex,'수량'));
                this.grid6View.setValue(row, '비고', this.grid5View.getValue(findCount.itemIndex,'특이사항'));
                if (row + 1 < this.data6Provider.getRowCount()) {
                  //다음 로우가 있다면
                  focusRow = row + 1;
                } else {
                  this.data6Provider.addRow({});
                  this.grid6View.setValue(row, 'gubun', this.params.gubun);
                  focusRow = row + 1;
                }
            } else {
              this.$toast('warning', '해당 PACK NO가\n 왼쪽 출하검사 의뢰 PACK List에 존재하지 않습니다.');
              this.grid6View.setValue(row, 'packQrno', '');
              this.grid6View.setValue(row, '일치여부', '불일치');
            }
         }  
        this.setPackNoFocus(focusRow);
    },
    findRowInGrid5(packNo) {
      if (_.isEmpty(packNo)) return 0;

      let fields = ['packNo'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      let options = {
        fields: fields,
        value: packNo,
        startIndex: startIndex,
        startFieldIndex: startFieldIndex,
        allFields: true,
        wrap: false,
        caseSensitive: false,
        partialMatch: false,
      };
      let index = this.grid5View.searchCell(options);
      if (index == null) findCount = 0;
      else findCount = index;

      return findCount;
    },
    findRowInGrid6(packNo) {
      if (_.isEmpty(packNo)) return 0;
      let fields = ['packQrno'];

      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: packNo,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.grid6View.searchCell(options);
        if (index == null) break;
        
        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        findCount++;
      }
      return findCount;
    },
    onShowTooltip(grid, index, value) {
    var column = index.column;
    var itemIndex = index.itemIndex;
    var tooltip = grid.getValue(itemIndex, column);
    if (column != column) return null;
    return tooltip;
   },
   async excelClick() {
      const grid = (this.searchDiv === 'SI대기_PACK')  ? this.grid3View :  this.grid4View ;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName =  (this.searchDiv === 'SI대기_PACK'  ? '출하검사대기_PACK' : '출하검사대기_PACK') + `_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

      const options = {
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: '엑셀 Export중입니다.',
        done: function () {
          alert('엑셀 내보내기가 완료되었습니다!');
        },
      };

      grid.exportGrid(options);
    },
  }
};
</script>
<style lang="scss" scoped>
:deep .worker_wrap {
  margin: 0;
  border: 0;
  background: #ffffff;
  display: flex;
  width: 100%;
  font-size: 14px;
  color: #1c1c1c;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #bebebe;
  align-items: center;
  .form-select-sm,
  .form-control-sm {
    min-height: 34px;
    height: 34px;
    padding: 8px 25px;
  }
  label {
    padding: 0 10px;
    top: -1px;
  }
  .form-select:focus ~ label,
  .form-control:focus ~ label {
    top: 5px;
  }
}
</style>
