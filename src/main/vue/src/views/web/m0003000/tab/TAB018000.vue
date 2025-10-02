<template>
	<div>      
    <div class="search_box">
      <b-row class="row search_area">
        <b-col cols="2">
          <div class="form-floating prc_name">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example"
              v-model="params['공정코드']"
            >
              <option 
                v-for="(item, index) in processList" 
                :key="index" 
                :value="item.sysResourceId"
              >
                {{ item.sysResourceName }}
              </option>
            </select>
            <label for="floatingSelect" class="select">공정명</label>
          </div>
        </b-col>
        <b-col cols="1" v-if="params['공정코드']=='013'">  
          <b-form-checkbox    
            v-model="lrTypeYn"
          >
            단일진행
          </b-form-checkbox>
        </b-col>
        <b-col cols="2">
          <div class="form-floating lot_run_num">
            <input type="text" :class="params['공정코드']=='013' ? 'form-control label-80' : 'form-control label-60'" id="floating" placeholder="LotNo"
              v-model="params.lotNo"
              @input="convertToUpperEnglish"
              @keydown.enter="handleEnter"
              name="lotNo"
              data-group="params"
              @change="handleChange(1)"
              :disabled="isDisabled"
              ref="lotNoField"
              autocomplete="off"
              @mousedown="handleMouseDown"
            >
            <label for="floating">{{params['공정코드']=='013' ? (lrTypeYn ? 'Lot No' : 'L축 Lot No') : 'Lot No'}}</label>
          </div>              
        </b-col>
        <b-col cols="2" v-show="params['공정코드']=='013'">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example"
              v-model="params.machineCode" autocomplete="off"
            >
              <option 
                v-for="(item, index) in machineCodes" 
                :key="index" 
                :value="item.value"
              >
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">{{params['공정코드']=='013' ? (lrTypeYn ? 'M/C' : 'L축 M/C') : 'M/C'}}</label>
          </div>
        </b-col>
        <b-col cols="2" v-show="params['공정코드']=='013' && !lrTypeYn">
          <div :class="{'form-floating': true, 'lot_run_num': !isLotNo}">
            <input type="text" :class="params['공정코드']=='013' ? 'form-control label-80' : 'form-control label-60'" id="floating" placeholder="LotNo"
              v-model="params1.lotNo"
              name="lotNo"
              data-group="params1"
              @input="convertToUpperEnglish"
              @keydown.enter="handleEnter"
              @change="handleChange(2)"
              :disabled="isDisabled || isLotNo"
              ref="lotNoField1"
              autocomplete="off"
              @mousedown="handleMouseDown1"
            >
            <label for="floating">{{params['공정코드']=='013' ? 'R축 Lot No' : 'Lot No'}}</label>
          </div>              
        </b-col>
        <b-col cols="2" v-show="params['공정코드']=='013' && !lrTypeYn">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example"
              v-model="params1.machineCode" autocomplete="off" :disabled="isLotNo1"
            >
              <option 
                v-for="(item, index) in machineCodes1" 
                :key="index" 
                :value="item.value"
              >
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">{{params['공정코드']=='013' ? 'R축 M/C' : 'M/C'}}</label>
          </div>
        </b-col>
        <b-col cols="1" v-if="params['공정코드']=='010' && !isLotNo && isStartDisabled">  
          <b-form-checkbox    
            v-model="autoPanelIdYn"
            :disabled="isLotNo"                        
          >
            자동
          </b-form-checkbox>
        </b-col>
        <b-col cols="3">                           
          <div class="form-floating" v-show="params['공정코드']=='010'">
            <input type="text" class="form-control label-80" id="floating"
              v-model="params.pCode" 
              :disabled="!isEditabled"
              name="pCode"
              data-group="params"
              @input="inputPCode"
              autocomplete="off"
            >
            <label for="floating">Batch No</label>
          </div>              
        </b-col>
        </b-row>
        <div class="btn_area" >
          <b-button @click="searchClick">
            <span class="ico_search"></span>
            조회
          </b-button>         
        </div>                 
      </div>
      <div class="worker_wrap">
        <div class="title mr-4">작업자 정보</div>
        <div class="row worker_info">
          <div class="col-3">
            <div class="form-floating">
                <input type="text" class="form-control label-60" id="floating"
                  v-model="params['작업자']"
                  autocomplete="off"
                >
                <label for="floating">작업자</label>
            </div>              
          </div>
          <div class="col-2">
            <div class="form-floating">
              <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example"
                v-model="params.shift" autocomplete="off"
              >
                <option 
                  v-for="(item, index) in shifts" 
                  :key="index" 
                  :value="item.value"
                >
                  {{ item.text }}
                </option>
              </select>
              <label for="floatingSelect" class="select">근무조</label>
            </div>
          </div>
          <div class="col-4" v-show="false">
            <div class="form-floating prc_name">
              <select class="form-select label-80" id="floatingSelect" aria-label="Floating label select example"
                v-model="params['작업조']" autocomplete="off" :disabled="true"
              >
                <option 
                  v-for="(item, index) in shiftTypes" 
                  :key="index" 
                  :value="item.value"
                >
                  {{ item.text }}
                </option>
              </select>
              <label for="floatingSelect" class="select">근무 시간</label>
            </div>
          </div>
          <div class="col-3" v-show="params['공정코드']!=='013'">
            <div class="form-floating prc_name">
              <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example"
                v-model="params.machineCode" autocomplete="off"
              >
                <option 
                  v-for="(item, index) in machineCodes" 
                  :key="index" 
                  :value="item.value"
                >
                  {{ item.text }}
                </option>
              </select>
              <label for="floatingSelect" class="select">M/C</label>
            </div>
          </div>
        </div>
        <div class="row worker_info ms-2">
          <div class="col-4">
            <DateTimeSpinner ref="dateTime1" @input="dateTimeInput1" label="작업시작"/>  
          </div>
          <div class="col-4">
            <DateTimeSpinner ref="dateTime2" @input="dateTimeInput2" label="작업종료"/>  
          </div>
          <div class="col-2 " :class="{ btn_wrap : params['공정코드']=='017' || params['공정코드']=='020' }">
          <b-button class="second me-1" v-if="params['공정코드']=='017' || params['공정코드']=='020'" @click="multiProcClick">일괄진행</b-button>
          </div>
        </div>
    </div>
    <div class="accordion mt-2" id="accordionExample1">
      <div class="accordion-item mt-2">
				<h2 class="accordion-header" id="headingTwo">
					<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">제품현황</button>
				</h2>
				<div id="collapseTwo" class="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample1">
					<div class="accordion-body">
						<ProductStatus ref="prodStatus" :no="params.lotNo" :no1="params1.lotNo" :process="params['공정코드']" :area="'front'"/>
					</div>
				</div>
			</div>
    </div>
    <div class="accordion mt-2" id="accordionExample2">      
      <!-- 첫 번째 패널 -->
      <div class="accordion-item mt-2">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          작업현황
          </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample2">
          <div class="accordion-body">
            <div class="btn_wrap mb-1">
              <b-button class="second" @click="actionClick('tool')" v-if="params['공정코드']=='013'">툴사용처리</b-button>
              <b-button class="second" @click="actionClick('error')" v-if="params['공정코드']=='010'">불량</b-button>
              <b-button class="sub" @click="actionClick('remarks')">특이사항</b-button>
              <div class="hr"></div>
              <b-button-group class="toggle_btn">
                <b-button :class="{ on : isStartDisabled }" @click="actionClick('start')">작업시작</b-button>
                <b-button :class="{ on : isEndDisabled }" @click="actionClick('end')">작업종료</b-button>
              </b-button-group>
              <div class="hr"></div>
              <b-button class="me-1" :class="{ main : !isStartDisabled && isEditabled }" @click="actionClick('cancel')">작업취소</b-button>
              <b-button :class="{ main : isEditabled }" @click="actionClick('temp')">임시저장</b-button>
            </div>
            <div class="row"> 
              <RealGrid ref="perInfoGrid2" :uid="'perInfoGrid2'" :rows="rows"/>
              <ErrorInfoStatus ref="errorInfoStatus"/>
            </div>
            <!-- 적층시작 -->
            <div v-if="params['공정코드']=='010'">              
              <div class="row mt-2">
                <div class="col">
                  <div class="etc">
                    <div class="title">특이사항</div>
                    <b-form-textarea rows="2" no-resize 
                      v-model="params['특이사항']"
                      :disabled="!isEditabled"/>
                  </div>
                </div>  
                <div class="col">
                  <div class="row">
                    <div class="col">
                  <div class="etc mt-1">
                    <div class="title">TANK_NO</div>
                    <b-form-input size="md" 
                      v-model="params['공정비고']"
                      :disabled="!isEditabled"
                    />
                  </div>
                    </div>
                    <div class="col">
                  <div class="etc mt-1">
                    <div class="title">PANEL_ID</div>
                    <b-form-input size="md"                      
                      v-model="params['panelId']"
                      ref="panelId"
                      @input="convertToUpperEnglish1('params', 'panelId')"
                      :disabled="!isEditabled"
                    />                    
                  </div> 
                    </div>
                  </div>
                </div>              
              </div>
            </div>
            <!-- 적층끝 -->
            <!-- 가공시작 -->
            <div v-if="params['공정코드']=='013' && !lrTypeYn">
              <b-row class="row" style="height:87%">
                <b-col cols="6">
                  <div class="grid_box thee_d_box">
                    <div class="left_box">
                      <div class="title">L축</div>
                    </div>
                    <div style="padding:3px;background:#FFF">
                      <div>
                        <RealGrid ref="perInfoGrid5" :uid="'perInfoGrid5'" :rows="rows4" />
                      </div>
                      <div>
                        <div class="s_title mt-1">L축 Tool 사용 현황</div>
                        <table class="h_table">
                          <colgroup>
                          <col span="4" style="width:25%"/>
                          </colgroup>
                          <thead>
                            <tr>
                              <th>구분</th>
                              <th>커팅</th>
                              <th>중삭</th>
                              <th>정삭</th>
                            </tr>
                          </thead>
                          <tr>
                            <th>Tool No</th>
                            <td>{{params["toolNo컷팅"]}}</td>
                            <td>{{params["toolNo중삭"]}}</td>
                            <td>{{params["toolNo정삭"]}}</td>
                          </tr>
                          <tr>
                            <th>사용 횟수</th>
                            <td>{{params["컷팅"]}}</td>
                            <td>{{params["중삭"]}}</td>
                            <td>{{params["정삭"]}}</td>
                          </tr>
                        </table>                    
                      </div>
                      <div class="etc">
                        <div class="mt-1">
                          <div class="title">{{params['공정코드']=='013' ? 'L축 특이사항' : '특이사항'}}</div>
                          <b-form-textarea rows="2" no-resize                       
                            v-model="params['특이사항']"
                            :disabled="!isEditabled"/>
                        </div>
                        <div class=" mt-1">
                          <div class="title">{{params['공정코드']=='013' ? 'L축 진공압' : '진공압'}}</div>
                          <b-form-input size="md" 
                            v-model="params['공정비고']"
                            :disabled="!isEditabled"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col> 
                <b-col cols="6" v-if="!isLotNo1">
                  <div class="grid_box thee_d_box">
                    <div class="left_box">
                      <div class="title">R축</div>					
                    </div> 
                    <div style="padding:3px;background:#FFF">
                      <div>
                        <RealGrid ref="perInfoGrid7" :uid="'perInfoGrid7'" :rows="rows7"/>
                      </div>
                      <div>
                        <div class="s_title mt-1">R축 Tool 사용 현황</div>					
                          <table class="h_table">
                            <colgroup>
                            <col span="4" style="width:25%"/>
                            </colgroup>
                            <thead>
                              <tr>
                                <th>구분</th>
                                <th>커팅</th>
                                <th>중삭</th>
                                <th>정삭</th>
                              </tr>
                            </thead>
                            <tr>
                              <th>Tool No</th>
                              <td>{{params1["toolNo컷팅"]}}</td>
                              <td>{{params1["toolNo중삭"]}}</td>
                              <td>{{params1["toolNo정삭"]}}</td>
                            </tr>
                            <tr>
                              <th>사용 횟수</th>
                              <td>{{params1["컷팅"]}}</td>
                              <td>{{params1["중삭"]}}</td>
                              <td>{{params1["정삭"]}}</td>
                            </tr>
                          </table>
                      </div>
                      <div class="etc" v-if="!isLotNo1">
                        <div class="mt-1" >
                          <div class="title">{{params['공정코드']=='013' ? 'R축 특이사항' : '특이사항'}}</div>
                          <b-form-textarea rows="2" no-resize                       
                            v-model="params1['특이사항']"
                            :disabled="!isEditabled"
                          />
                        </div>
                        <div class="mt-1">
                          <div class="title">{{params['공정코드']=='013' ? 'R축 진공압' : '진공압'}}</div>
                          <b-form-input size="md" 
                            v-model="params1['공정비고']"
                            :disabled="!isEditabled"
                          />
                        </div>
                      </div>
                  </div>
                </div>
                </b-col>       
              </b-row>
              <!-- <div class="row mt-1">
                <div class="col">

                  <div class="col mt-1">
                  </div>
                </div>
                <div class="col" v-if="!isLotNo1">
                  <div class="col  mt-1">
                  </div>
                </div>
              </div> -->
            </div>
            <div v-if="params['공정코드']=='013' && lrTypeYn">
              <b-row class="row" style="height:87%">
                <b-col cols="6">
                  <div class="grid_box thee_d_box">
                    <div style="padding:3px;background:#FFF">
                      <div>
                        <RealGrid ref="perInfoGrid5" :uid="'perInfoGrid5'" :rows="rows4" />
                      </div>
                      <div>
                        <div class="s_title mt-1">Tool 사용 현황</div>
                        <table class="h_table">
                          <colgroup>
                          <col span="4" style="width:25%"/>
                          </colgroup>
                          <thead>
                            <tr>
                              <th>구분</th>
                              <th>커팅</th>
                              <th>중삭</th>
                              <th>정삭</th>
                            </tr>
                          </thead>
                          <tr>
                            <th>Tool No</th>
                            <td>{{params["toolNo컷팅"]}}</td>
                            <td>{{params["toolNo중삭"]}}</td>
                            <td>{{params["toolNo정삭"]}}</td>
                          </tr>
                          <tr>
                            <th>사용 횟수</th>
                            <td>{{params["컷팅"]}}</td>
                            <td>{{params["중삭"]}}</td>
                            <td>{{params["정삭"]}}</td>
                          </tr>
                        </table>                    
                      </div>
                      <div class="etc">
                        <div class="mt-1">
                          <div class="title">특이사항</div>
                          <b-form-textarea rows="2" no-resize                       
                            v-model="params['특이사항']"
                            :disabled="!isEditabled"/>
                        </div>
                        <div class=" mt-1">
                          <div class="title">진공압</div>
                          <b-form-input size="md" 
                            v-model="params['공정비고']"
                            :disabled="!isEditabled"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </b-col>       
              </b-row>
              <!-- <div class="row mt-1">
                <div class="col">

                  <div class="col mt-1">
                  </div>
                </div>
                <div class="col" v-if="!isLotNo1">
                  <div class="col  mt-1">
                  </div>
                </div>
              </div> -->
            </div>
            <!-- 가공끝 --> 
            <!-- 치수시작 -->
            <div v-if="params['공정코드']=='015'">
              <div class="row mt-2">
                <RealGrid ref="perInfoGrid6" :uid="'perInfoGrid6'" :rows="rows5" :fitLayoutWidthEnable="false"/>
              </div>
              <div class="row mt-1">  
                <div class="col">
                  <div class="etc">
                    <div class="title">특이사항</div>
                    <b-form-textarea rows="2" no-resize 
                      v-model="params['특이사항']"
                      :disabled="!isEditabled"/>
                  </div>                  
                </div>
              </div>
            </div> 
            <!-- 치수끝 -->
            <!-- WP시작 -->
            <div v-if="params['공정코드']=='017'">
              <div class="row mt-2">
                <RealGrid ref="perInfoGrid3" :uid="'perInfoGrid3'" :rows="rows3"/>
              </div>
              <div class="row mt-2">
                <div class="col">
                  <div class="etc">
                    <div class="title">특이사항</div>
                    <b-form-textarea rows="2" no-resize 
                      v-model="params['특이사항']"
                      :disabled="!isEditabled"/>
                  </div>
                  <div class="etc mt-1">
                    <div class="title">E/T RATE</div>
                    <b-form-input size="md" 
                      v-model="params['공정비고']"
                      :disabled="!isEditabled"
                    />
                  </div>                                            
                </div>
              </div>
            </div>
            <!-- WP끝 --> 
            <!-- DUV시작 --> 
            <div v-if="params['공정코드']=='020'">
              <div class="row mt-2">
                <RealGrid ref="perInfoGrid3" :uid="'perInfoGrid3'" :rows="rows3"/>
              </div>
              <div class="row mt-2">
                <div class="col">
                  <div class="etc">
                    <div class="title">특이사항</div>
                    <b-form-textarea rows="2" no-resize 
                      v-model="params['특이사항']"
                      :disabled="!isEditabled"/>
                  </div>  
 
                  </div>
                  <div class="col">
                   <div class="row"> 
                    <div class="col">
                      <div class="etc">                    
                        <div class="title">시작 온도</div>
                          <b-form-input size="sm"
                            v-model="params['시작온도']"
                            :disabled="!isEditabled"
                            type="number"
                            step="0.1"
                            @input="onInputTemperature($event, '시작온도')"
                          />
                      </div>
                   </div> 
                  <div class="col">
                      <div class="etc">
                        <div class="title">종료 온도</div>
                          <b-form-input size="sm"
                            v-model="params['종료온도']"
                            :disabled="!isEditabled"
                            type="number"
                            step="0.1"
                            @input="onInputTemperature($event, '종료온도')"
                          />
                      </div>
                  </div>
                  <div class="col">
                      <div class="etc">                    
                          <div class="title">전면 광량</div>
                          <b-form-input size="sm"
                            v-model="params['전면광량']"
                            :disabled="!isEditabled"
                            type="number"
                            @input="onInputTemperature1($event, '전면광량')"
                          />
                      </div>
                  </div>
                  <div class="col">
                     <div class="etc">
                        <div class="title">후면 광량</div>
                          <b-form-input size="sm"
                            v-model="params['후면광량']"
                            :disabled="!isEditabled"
                            type="number"
                            @input="onInputTemperature1($event, '후면광량')"
                          />
                      </div>
                  </div>
                  </div>  
                  </div>
                </div>
              </div>
            </div>
          </div> 
          <!-- DUV끝 --> 
        </div>
      </div>       
    <CmDialog1 ref="cmDialog1M00003005" @confirm="handleConfirm" />
    <ProcessingMapping ref="processingMapping" @save="saveCallback1"/>
    <ToolPopup ref="toolPopup"/>
    <ErrorInput ref="errorInput" @save="saveCallback1"/>
    <AutoPanelPopup ref="autoPanelPopup" @save="saveCallback1"/>
    <MultiProcPopup ref="multiProcPopup" @closeDialog="closeDialog"/>
  </div>	
</template>

<script>

import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import ProcessingMapping from "@web/popup/ProcessingMapping";
import ToolPopup from "@web/popup/ToolPopup";
import MultiProcPopup from "@web/popup/MultiProcPopup";
import ProductStatus from '@components/ProductStatus.vue';
import ErrorInfoStatus from '@components/ErrorInfoStatus.vue';
import ErrorInput from "@web/popup/ErrorInput";
import AutoPanelPopup from "@web/popup/AutoPanelPopup";
import { useM0003005 } from '@web/store/M0003005.js';
import moment from 'moment';
const { ValueType, RowState } = require('realgrid');

export default {
  props: {
		tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true // 필수 prop으로 지정 (선택 사항)
    }
	},
	components:{
    ProcessingMapping,
    ToolPopup,
    ProductStatus,
    ErrorInput,
    ErrorInfoStatus,
    MultiProcPopup,
    AutoPanelPopup
  },
	setup() {
		const userAuthInfo = useUserAuthInfo();
    const processList = userAuthInfo.getTabInfoListBySRI('M0003005', 'TAB018000');
    const srchInfo = useM0003005();
		return { userAuthInfo, srchInfo, processList};
	},
	watch: {
		"params.공정코드"(newVal, oldVal) {
      this.isDisabled = false;
      if(newVal == '013'){
        this.lrTypeYn = true;
      }
      this.$nextTick(()=>{
      this.params1["공정코드"] = newVal;
      this.$utils.initializeParamsInPlace(this.params, ["공정코드","lotNo"]);
      this.$utils.initializeParamsInPlace(this.params1, ["공정코드"]);
      this.$refs.dateTime1.clearClick();
      this.$refs.dateTime2.clearClick();
      if(this.$utils.isValidProperty(this.params, 'lotNo')){
        this.searchClick();
      }
      this.searchMachineCode();

      this.srchInfo.process = newVal;
      if(!_.isEmpty(this.params.lotNo) && this.srchInfo.lotNo != this.params.lotNo)  this.srchInfo.lotNo = this.params.lotNo;

      });
      this.autoPanelIdYn = false;
      this.params2['panelId'] = null;
		},
    "params.lotNo"(newVal, oldVal) {
      /*let itgChk = newVal.startsWith('I');
      if(itgChk){
        this.$emit("itgCallback", newVal);
        return;
      }*/
      this.preventChangeEvent1 = true;
      this.srchInfo.lotNo = newVal;
      if((_.isNil(newVal) || newVal == "") && this.params["공정코드"] == '010'){
        this.params2['panelId'] = null;
        this.autoPanelIdYn = false;
      }
    },
    "params1.lotNo"(newVal, oldVal) {
      this.preventChangeEvent2 = true;
		},
    "params.작업자"(newVal, oldVal) {
      this.params1["작업자"] = newVal;
		},
    "params.shift"(newVal, oldVal) {
      this.params1["shift"] = newVal;
		},
    "params.작업조"(newVal, oldVal) {
      this.params1["작업조"] = newVal;
		},
    "params.machineCode"(newVal) {
      const index = this.machineCodes.findIndex((item) => item.value === newVal);
      if(index > -1){
        this.params["chamber"] = this.machineCodes[index]['chamber'];
        this.params["설비약명"] = this.machineCodes[index]['text'].split(' ')[0];
        this.params["설비명"] = this.machineCodes[index]['설비명'];
        const index1 = this.machineCodes1.findIndex((item) => item.설비명 === this.params["설비명"]);
        if(index1 > -1 && !this.isLotNo1){
          this.params1["machineCode"] = this.machineCodes1[index1]['value'];
        }
      }
		},
    "params1.machineCode"(newVal) {
      const index = this.machineCodes1.findIndex((item) => item.value === newVal);
      if(index > -1){
        this.params1["chamber"] = this.machineCodes1[index]['chamber'];
        this.params1["설비약명"] = this.machineCodes1[index]['text'].split(' ')[0];
        this.params1["설비명"] = this.machineCodes1[index]['설비명'];
      }
		},
    "autoPanelIdYn"(newVal) {
      //this.params2.panelId = null;
      if(this.params["공정코드"] == '010' && this.params["vlrCheck"] == 'N'){
        this.isProcessingMsg();
      }else{
        if(newVal){        
          this.$refs.autoPanelPopup.openDialog(this.params);
        }
      }
      this.$nextTick(()=>{
        this.autoPanelIdYn = false;
      })
    },
    "lrTypeYn"(newVal) {
      this.$nextTick(()=>{
        this.searchMachineCode();
        if(newVal){
          this.$utils.initializeParamsInPlace(this.params, ["공정코드","lotNo"]);
          this.$utils.initializeParamsInPlace(this.params1, ["공정코드"]);
          if(this.$utils.isValidProperty(this.params, 'lotNo')){
            this.searchClick();
          }
        }else{
          this.$utils.initializeParamsInPlace(this.params, ["공정코드"]);
          this.$utils.initializeParamsInPlace(this.params1, ["공정코드"]);
        }
      })
    }
	},
	data () {
		return {
      perInfoGrid2: null,
      perInfoGrid3: null,
      perInfoGrid5: null,
      perInfoGrid6: null,
      perInfoGrid7: null,
			rows: [],
      rows3: [],
      rows4: [],
      rows5: [],
      rows7: [],
			params: {
				'공정코드': null,
				lotNo: null,
        lotNo1: null,
				pCode: null,
        '작업자': null,
				shift: null,
				'작업조': null,
				machineCode: null,
        '설비명': null,
        '설비약명': null,
				chamber: null,				
        'toolNo컷팅': null,
        'toolNo중삭': null,
        'toolNo정삭': null,
        '컷팅': null,
        '중삭': null,
        '정삭': null,
        '시작온도': null,
        '종료온도': null,
        '전면광량': null,
        '후면광량': null,
        '전작업종료': null,
        '전공정': null,
        'panelId': null,
        '공정비고': null,
        '특이사항': null,
        '작업시작': null,
        '시작시각': null,
        '작업종료': null,
        '종료시각': null,
        'next작업시작': null,
        'vlrCheck': null,
			},
      params1: {
				'공정코드': null,
				lotNo: null,
        lotNo1: null,
				pCode: null,
        '작업자': null,
				shift: null,
				'작업조': null,
				machineCode: null,
        '설비명': null,
        '설비약명': null,
				chamber: null,				
        'toolNo컷팅': null,
        'toolNo중삭': null,
        'toolNo정삭': null,
        '컷팅': null,
        '중삭': null,
        '정삭': null,
        '시작온도': null,
        '종료온도': null,
        '전면광량': null,
        '후면광량': null,
        '전작업종료': null,
        '전공정': null,
        'panelId': null,
        '공정비고': null,
        '특이사항': null,
        '작업시작': null,
        '시작시각': null,
        '작업종료': null,
        '종료시각': null,
        'next작업시작': null,
			},
      params2: {
        'panelId': null,
      },
      dynamic: {
        layout1: [],
        layout2: [],
      },
      popup: {
        itemList1: [],
        itemList2: [],
      },
			shifts: [],
			shiftTypes: [],
			machineCodes: [],
			machineCodes1: [],
			// items: [],
      isDisabled: true,
      isStartMessge: false,

      isValidateCellsPerInfoGrid6: false,
      preventChangeEvent1: false,
      preventChangeEvent2: false,
      autoPanelIdYn: false,
      searchClick013Flag: true,
      indexMap: {
        2: [0, 1],
        4: [1, 3],
        6: [2, 5],
        8: [3, 7],
        12: [0, 5, 6, 11]
      },
      startDay: null,
      startTime: null,
      endDay: null,
      endTime: null,
      lrTypeYn: false,
		}
	},
	computed: {
		menuList(){
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
		isStartDisabled(){
      if((this.params['공정코드'] == '013' && !this.isLotNo1 && !this.lrTypeYn && this.rows.length > 0 && this.$utils.isValidProperty(this.params, '공정코드') && !this.$utils.isValidProperty(this.params, '작업시작') && !this.$utils.isValidProperty(this.params1, '작업시작'))){
        return true;
      }else if(!(this.params['공정코드'] == '013' && !this.isLotNo1 && this.lrTypeYn) && this.rows.length > 0 && this.$utils.isValidProperty(this.params, '공정코드') && !this.$utils.isValidProperty(this.params, '작업시작')){
        return true;
      }
			return false;
		},
		isEndDisabled(){
      if((this.params['공정코드'] == '013' && !this.isLotNo1 && !this.lrTypeYn && this.rows.length > 0 && this.$utils.isValidProperty(this.params, '공정코드') && this.$utils.isValidProperty(this.params, '작업시작') && this.$utils.isValidProperty(this.params1, '작업시작') && !this.$utils.isValidProperty(this.params, '작업종료') && !this.$utils.isValidProperty(this.params1, '작업종료'))){
        return true;
      }else if(!(this.params['공정코드'] == '013' && !this.isLotNo1 && this.lrTypeYn) && this.rows.length > 0 && this.$utils.isValidProperty(this.params, '공정코드') && this.$utils.isValidProperty(this.params, '작업시작') && !this.$utils.isValidProperty(this.params, '작업종료')){
        return true;
      }
			return false;
		},
    isTempDisabled(){
      if(this.params['공정코드'] == '013' && !this.isLotNo1 && !this.lrTypeYn && this.rows.length > 0 && !this.isStartDisabled && !this.$utils.isValidProperty(this.params, 'next작업시작') && !this.$utils.isValidProperty(this.params1, 'next작업시작')){
        return true;
      }else{
        return this.rows.length > 0 && !this.$utils.isValidProperty(this.params, 'next작업시작') && !this.isStartDisabled
      }
    },    
    isEditabled(){
      return this.isTempDisabled
    },
    isLotNo(){
      return !this.$utils.isValidProperty(this.params, 'lotNo');
    },
    isLotNo1(){
      return !this.$utils.isValidProperty(this.params1, 'lotNo');
    },       
    lotNoClass(){
      return this.params['공정코드']=='013' ? 'form-control label-120' : 'form-control label-120';
    },
    prodCtg() {
      return this.userAuthInfo.selectedProdCtg;
    },
	},
	created() {
    this.$utils.assignDynamicProperties(['rows=[{}]','rows4=[]','rows5=[]','rows7=[]'], this);
    this.initializeGrid();	    
		// this.items = this.$utils.fetchAuthorizedMenuProcesses(this.menuList, this.tabId);
		this.searchComCode();
		this.searchMachineCode();
	},	
	mounted() {
    this.$eventBus.on("FrontMenuMove", this.frontMenuMove);

    this.srchInfo.process = this.params.공정코드;
    this.srchInfo.lotNo = this.params.lotNo;
  },
	beforeUnmount() {
    this.$eventBus.off("FrontMenuMove");
  },
	methods: {    
    perInfoGrid2GV() {
      return this.$refs.perInfoGrid2?.getGridView();
    },
    perInfoGrid2DP() {
      return this.$refs.perInfoGrid2?.getGridDataProvider();
    },    
    perInfoGrid3GV() {
      return this.$refs.perInfoGrid3?.getGridView();
    },
    perInfoGrid3DP() {
      return this.$refs.perInfoGrid3?.getGridDataProvider();
    },    
    perInfoGrid5GV() {
      return this.$refs.perInfoGrid5?.getGridView();
    },
    perInfoGrid5DP() {
      return this.$refs.perInfoGrid5?.getGridDataProvider();
    },
    perInfoGrid6GV() {
      return this.$refs.perInfoGrid6?.getGridView();
    },
    perInfoGrid6DP() {
      return this.$refs.perInfoGrid6?.getGridDataProvider();
    },
    perInfoGrid7GV() {
      return this.$refs.perInfoGrid7?.getGridView();
    },
    perInfoGrid7DP() {
      return this.$refs.perInfoGrid7?.getGridDataProvider();
    },
    frontMenuMove(data) {
      /*let searchFlag = false;
      if(this.params["공정코드"] != data["공정코드"] || this.params["lotNo"] != data["lotNo"]){
        searchFlag = true;
      }*/
      this.params["공정코드"] = data["공정코드"];
      this.params["lotNo"] = data["lotNo"];
      this.autoPanelIdYn = false;      
      setTimeout(() => {
        //if(searchFlag)
        this.searchClick();
      }, 1000);
    },
    initializeGrid() {
      this.perInfoGrid2 = _.cloneDeep(require(`@web/m0003000/js/TAB018000_2.js`));
      this.perInfoGrid3 = _.cloneDeep(require(`@web/m0003000/js/TAB018000_3.js`));
      this.perInfoGrid5 = _.cloneDeep(require(`@web/m0003000/js/TAB018000_4.js`));
      this.perInfoGrid6 = _.cloneDeep(require(`@web/m0003000/js/TAB018000_6.js`));
      this.perInfoGrid7 = _.cloneDeep(require(`@web/m0003000/js/TAB018000_4.js`));
    },
		async searchComCode(){
			this.$utils.getCommonContentValueText(['75', '06'], [this.shiftTypes, this.shifts]);
		},    
    async searchPerInfoGrid5Fields(){},
		async searchMachineCode(){
      
      if(this.params['공정코드'] == '013'){
        let searchParam = [{
          menuId: "M0003005", queryId: "M0003005_Sch5", queryParams: {'공정코드': this.params['공정코드'], type: (this.lrTypeYn ? null : 'L')}, 
          callback: (data) => {
            this.$utils.transformData(
            data,
            ["value", "text", "설비명", "chamber"],
            ["설비번호", "설비약명", "설비명", "chamber"],
            this.machineCodes
            );
          }
        }, {
          menuId: "M0003005", queryId: "M0003005_Sch5", queryParams: {'공정코드': this.params['공정코드'], type: 'R'}, 
          callback: (data) => {
            this.$utils.transformData(
            data,
            ["value", "text", "설비명", "chamber"],
            ["설비번호", "설비약명", "설비명", "chamber"],
            this.machineCodes1
            );
          },
        }];
        await this.$axios.api.searchAll(searchParam);
      }else{
        let searchParam = {
          menuId: "M0003005", queryId: "M0003005_Sch5", queryParams: {'공정코드': this.params['공정코드'], type: null}, 
          callback: (data) => {
            this.$utils.transformData(
            data,
            ["value", "text", "설비명", "chamber"],
            ["설비번호", "설비약명", "설비명", "chamber"],
            this.machineCodes
            );
          },
        };
        await this.$axios.api.search(searchParam);
      }

		},
    saveCallback1(){
      this.isStartMessge = true;
      this.searchClick();
    },
    closeDialog(){
      if(!_.isNil(this.params.lotNo)){
        this.searchClick();
      }
    },
    handleEnter(event) {
      event.preventDefault(); // 기본 이벤트 방지
      this.searchClick(); // 검색 실행
    },
    handleChange(type) {
      if (type == 1 && this.preventChangeEvent1) {
        this.preventChangeEvent1 = false;
        return;
      }else if (type == 2 && this.preventChangeEvent2) {
        this.preventChangeEvent2 = false;
        return;
      }
      this.searchClick();
    },   
    async searchClick013(){
      this.searchClick013Flag = false;      
      let result = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch2", queryParams: this.params});
      if(result.length > 1){
        this.params["lotNo"] = result[0]['lotNo'];
        this.params1["lotNo"] = result[1]['lotNo'];        
      }else{
        //this.params["lotNo"] = result[0]['lotNo'];
        //this.params1["lotNo"] = null;                
      }
      this.searchClick();
    },
		searchClick(){
      let itgChk = /^[A-Z]/.test(this.params['lotNo']);
      if(itgChk){
        this.$emit("itgCallback", this.params['lotNo']);
        return;
      }

      this.$nextTick(async()=>{
        this.$utils.initializeParamsInPlace(this.params, ["공정코드","lotNo","작업자","shift"]);
        this.$utils.initializeParamsInPlace(this.params1, ["공정코드","lotNo","작업자","shift"]);

        if(!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:Lot No:lotNo'])){
          return;
        }
        if(this.params["공정코드"] == '013' && this.searchClick013Flag && !this.lrTypeYn){
          this.searchClick013();
          return;
        }else if(this.params["공정코드"] == '013' && !this.searchClick013Flag && !this.lrTypeYn){
          this.searchClick013Flag = true;
        }
        if(this.params['공정코드'] == '013' && !this.isLotNo1 && !this.lrTypeYn){
          if(this.$utils.compareFirstFourCharsWithoutSpaces(this.params.lotNo, this.params1.lotNo)){
            this.$toast("info", "동일한 LOT CARD 입니다.");        
            return;
          }else if(!this.$utils.compareFirstFourCharsWithoutSpaces(this.params.lotNo, this.params1.lotNo, 4)){
            this.$toast("info", "제품이 서로 다른 LOT CARD 입니다.");        
            return;
          }
        }
        let params = {
          lotNo: this.params.lotNo,
          pCode: this.params.pCode,
          line: 'D1UT',
          "자동여부": 0,
          '공정코드': this.params['공정코드'],
        };	
        let searchParam = [
          {menuId: "M0003005", queryId: "M0003005_Sch1", queryParams: params, target: this.rows},				
        ];
        // 가공          
        if(params['공정코드'] == '013'){
          searchParam.push({menuId: "M0003005", queryId: "M0003005_Sch8", 
            queryParams: params, target: this.rows4
          });
        }else{
          if(params['공정코드'] == '015'){ // 치수
            searchParam.push({menuId: "M0003005", queryId: "M0003005_Sch9", queryParams: params, target: this.rows5});
          }else if(params['공정코드'] == '017' || params['공정코드'] == '020'){
            searchParam.push({menuId: "M0003005", queryId: "M0003005_Sch15", queryParams: params, target: this.rows3});
          }
        }
        
        this.$refs.prodStatus.loadData(); //2025.1.18 추가
        this.$refs.errorInfoStatus.loadData({
          ...this.params,
          line: 'D1UT',
          "자동여부": 0,
          runId: this.params["lotNo"],
          runId1: (params['공정코드'] == '013' && !this.isLotNo1  && !this.lrTypeYn ? this.params1["lotNo"] : null)
        });

        let result = await this.$axios.api.searchAll(searchParam);
        if(result[0].length==0){
          this.$toast("info", "발행 안된 LOT CARD 입니다.");        
          this.$refs.lotNoField.focus();
          this.$refs.lotNoField.select();
          return;
        }else{
          if(!this.isStartMessge && this.$utils.isValidProperty(this.rows[0], '작업시작') && !this.$utils.isValidProperty(this.rows[0], '작업종료')){
            this.$toast("info", "작업중입니다.");
          }
        }

        this.$utils.updateParamsFromRows(
          this.params,
          this.rows,
          [
            "pCode", "작업자", "shift", "작업조", "machineCode", "설비명", "설비약명", "시작온도", "종료온도", "전면광량", "후면광량",
            "toolNo컷팅", "toolNo중삭", "toolNo정삭", "컷팅", "중삭", "정삭",             
            "전작업종료", "전공정", "panelId", "공정비고", "특이사항",
            "작업시작", "시작시각", "작업종료", "종료시각", "next작업시작", "vlrCheck"
          ],
          this.$utils.isValidProperty
        );

        this.isStartMessge = false;

        if(params['공정코드'] == '010' && this.params["vlrCheck"] == 'N'){
          this.isProcessingMsg();
          return;
        }

        if(params['공정코드'] == '013' && !this.isLotNo1 &&  !this.lrTypeYn){
          let params1 = {
            lotNo: this.params1.lotNo,
            pCode: this.params.pCode,
            line: 'D1UT',
            "자동여부": 0,
            '공정코드': this.params['공정코드'],
          };	
          let searchParam1 = [
            {menuId: "M0003005", queryId: "M0003005_Sch1", queryParams: params1},				
          ];
          // 가공          
          if(params['공정코드'] == '013'){
            searchParam1.push({menuId: "M0003005", queryId: "M0003005_Sch8", 
              queryParams: params1
            });
          }
          let result1 = await this.$axios.api.searchAll(searchParam1);
          if(result1[0].length==0){
            this.$toast("info", "발행 안된 LOT CARD 입니다.");        
            this.$refs.lotNoField1.focus();
            this.$refs.lotNoField1.select();
            return;
          }
          this.rows = [...this.rows, ...result1[0]]
          this.rows7 = result1[1];
          
          this.$utils.updateParamsFromRows(
            this.params1,
            [this.rows[1]],
            [
              "pCode", "작업자", "shift", "작업조", "machineCode", "설비명", "설비약명", "시작온도", "종료온도", "전면광량", "후면광량",
              "toolNo컷팅", "toolNo중삭", "toolNo정삭", "컷팅", "중삭", "정삭",            
              "전작업종료", "전공정", "panelId", "공정비고", "특이사항",
              "작업시작", "시작시각", "작업종료", "종료시각", "next작업시작"
            ],
            this.$utils.isValidProperty
          );
        }

        if(this.isStartDisabled){
          if(this.machineCodes.length == 1){
            this.params.machineCode = this.machineCodes[0]['value'];
          }

          if(this.machineCodes1.length == 1){
            this.params1.machineCode = this.machineCodes1[0]['value'];
          }
        }
        this.perInfoGrid2GV().refresh(true);
        if(params['공정코드'] == '013'){
          this.perInfoGrid5GV().refresh(true);
          if(!this.isLotNo1){
            this.perInfoGrid7GV().refresh(true);
          }
        }else if(params['공정코드'] == '015'){
          this.perInfoGrid6GV().refresh(false);
        }else if(["017", "020"].includes(params['공정코드'])){
          this.perInfoGrid3GV().refresh(true);
        }
        
        //툴자동 등록
        if (this.params['공정코드'] == '013' && this.isEndDisabled) {
          const params = {
            "menuId": 'M0003005',
            "update": [{ queryId: 'M0003005_Update7', data: [] }],
          };

          let toolMessages = [];

          const checkAndUpdateTool = async (paramsObj, isLotNo = false) => {
            const searchParams = [
              { menuId: "M0003005", queryId: "M0003005_Sch3", queryParams: { ...paramsObj, '사용구분': '커팅' } },
              { menuId: "M0003005", queryId: "M0003005_Sch3", queryParams: { ...paramsObj, '사용구분': '중삭' } },
              { menuId: "M0003005", queryId: "M0003005_Sch3", queryParams: { ...paramsObj, '사용구분': '정삭' } }
            ];
            
            let result = await this.$axios.api.searchAll(searchParams);
            if (result[0].length > 1 || result[1].length > 1 || result[2].length > 1) {
              let errorMsg = "커팅 "+result[0].length+"개";
              errorMsg += ", 중삭 "+result[1].length+"개";
              errorMsg += ", 정삭 "+result[2].length+"개";

              this.$toast("error", "설비에 1개이상 툴이 등록 되어있습니다. 확인하시기 바랍니다.<br><span style='color:red'>"+errorMsg+"</span>", {
                dangerouslyHTMLString: true,
              });
              return;
            }

            if ((_.isNil(result[0][0]) || _.isNil(result[1][0]) || _.isNil(result[2][0])) && (_.isNil(paramsObj['toolNo컷팅']) || _.isNil(paramsObj['toolNo중삭']) || _.isNil(paramsObj['toolNo정삭']))) {
              let errorMsg = _.isNil(result[0][0]) ? "커팅 X" : "커팅 O";
              errorMsg += _.isNil(result[1][0]) ? ", 중삭 X" : ", 중삭 O";
              errorMsg += _.isNil(result[2][0]) ? ", 정삭 X" : ", 정삭 O";

              this.$toast("error", "설비에 등록되지 않은 툴이 있습니다. 확인하시기 바랍니다.<br><span style='color:red'>"+errorMsg+"</span>", {
                dangerouslyHTMLString: true,
              });
              return;
            }

            let sTool = {
              커팅: _.isNil(result[0][0]) ? paramsObj['toolNo컷팅'] : result[0][0]['툴번호'],
              중삭: _.isNil(result[1][0]) ? paramsObj['toolNo중삭'] : result[1][0]['툴번호'],
              정삭: _.isNil(result[2][0]) ? paramsObj['toolNo정삭'] : result[2][0]['툴번호']
            };

            let currentTool = {
              커팅: paramsObj['toolNo컷팅'],
              중삭: paramsObj['toolNo중삭'],
              정삭: paramsObj['toolNo정삭']
            };

            Object.keys(sTool).forEach(type => {
              if (!_.isNil(sTool[type]) && sTool[type] !== currentTool[type]) {
                if(!_.isNil(currentTool[type])){
                  toolMessages.push(
                    `[${paramsObj.lotNo || ''}] ${type} 변경: <span style="color:red">${currentTool[type] || '-'}</span> → <span style="color:blue">${sTool[type] || '-'}</span>`
                  );
                }
                params['update'][0]['data'].push({ ...paramsObj, toolNo컷팅: sTool.커팅, toolNo중삭: sTool.중삭, toolNo정삭: sTool.정삭, type });
              }
            });
          };

          // 첫 번째 Lot (기본 params 검사)
          await checkAndUpdateTool(this.params);

          // 두 번째 Lot 검사 (isLotNo1이 false일 경우)
          if (!this.isLotNo1 &&  !this.lrTypeYn) {
            await checkAndUpdateTool(this.params1, true);
          }
          
          if (params['update'][0]['data'].length > 0) {
            let toolAction = async () => {
              try {
                const resp = await this.$axios.api.saveData(params);
                if (resp.status === 'success') {
                  this.$toast('success', 'Tool No 등록되었습니다.');
                  this.searchClick();
                } else {
                  this.$toast('error', resp.message);
                }
              } catch (e) {
                this.$toast('error', '툴 저장 중 오류가 발생했습니다.');
                console.error(e);
              }
            }
            if(toolMessages.length > 0){
              const confirmMsg = `
                ${toolMessages.join('<br>')}<br><br>
                <span style="color:blue;font-weight:bold">툴 정보를 등록하시겠습니까?</span>
              `;
              this.$confirm("툴 자동 등록", confirmMsg, async (confirm) => {
                if (confirm) {
                  toolAction();
                }
              }); 
            }else{
              toolAction();
            }
          }
        }
      });
		},
    isProcessingMsg(){
      this.$alert("알림", `Lot No[${this.params['lotNo']}] 제품코드에 대한 라우팅 정보가 없습니다.<br><span style="color:red;font-weight:bold">제품 라우팅 등록 후 Lot No 재생성 하세요.</span>`, () => {});          
    },
    handleInput(event, target, regex){
      this.$nextTick(()=>{
        let tempLotNo = event.target.value.replace(regex, '').toUpperCase();
        this.params[target] = tempLotNo;
      })
    },
    async actionClick(action) {
      // 공정코드, Lot No 체크
      if (action != 'tool' && !this.$utils.validateFields(this.params, ['C:공정코드:공정코드', 'T:Lot No:lotNo'])) {
        return;
      } 
      // 조회된 LOT NO 가 아닌 다른 LOT NO 의 경우
      if(action != 'tool' && this.$utils.compareAndNotify(this.params, this.rows[0], ["Lot No:lotNo"])){
        return;
      }

      if(this.perInfoGrid3GV())this.perInfoGrid3GV().commit();
      if(this.perInfoGrid5GV())this.perInfoGrid5GV().commit();
      if(this.perInfoGrid6GV())this.perInfoGrid6GV().commit();
      if(this.perInfoGrid7GV())this.perInfoGrid7GV().commit();
      if (action === 'error') {  
        if (!this.$utils.validateFields(this.params, ['C:공정코드:공정코드', 'T:Lot No:lotNo'])) {
          return;
        }      
        this.$refs.errorInput.openDialog({
            ...this.params,
            type: null,
            line: 'D1UT',
            "자동여부": 0,
            dialogTitle: null,
            runId: this.params["lotNo"],
            errorCnt: this.rows[0]['투입수량'],
            '투입수량': this.rows[0]['투입수량'],
            isEditabled: this.isEditabled,
            keyPadFlag: this.params["공정코드"] == '010',
            callback: { queryId:'M0003005Error', data:[{
              ...this.params,
              'code': this.params['공정코드'],
              line: 'D1UT',
              "자동여부": 0,
            }]}
        });
        return;
      }else if(action === 'remarks'){
        let params = {
          dialogTitle: "특이사항",
          height: (this.params['공정코드'] == '013' && !this.isLotNo1 && !this.lrTypeYn ? 270 : 185),
          width: (this.params['공정코드'] == '013' && !this.isLotNo1 && !this.lrTypeYn ? 1100 : 700),    
          btnConfirm: false,    
          gridJs: (this.params['공정코드'] == '013' && !this.isLotNo1 && !this.lrTypeYn ? `CP0000000016.js` : `CP0000000010.js`),
          search: { 
            menuId: "M0003005", 
            queryId: (this.params['공정코드'] == '013' && !this.isLotNo1 && !this.lrTypeYn ? "M0003005_Sch16" : "M0003005_Sch6"),
            queryParams: {
              ...this.params,  
              lotNo1: this.params1["lotNo"]
            }
          },
        };
        this.$refs.cmDialog1M00003005.openDialog(params);
        return;
      }else if(action === 'tool'){
        try {
          const menu1 = this.$utils.findMenu(this.menuList, this.prodCtg, '자재관리');        
          const menu2 = this.$utils.findMenu(this.menuList, this.prodCtg, '공정 소모품 - 툴');
          this.$eventBus.emit('menuMoveClick', { menu: this.$utils.createMenuData(menu1, menu2, menu2.childSysResc[menu2.childSysResc.findIndex(item => item.sysResourceName === "공정 투입")])});
        } catch (error) {
          console.error('공정투입 이동중', error)
        }    
        return;
      }else if(action === 'cancel'){

        if(!(!this.isStartDisabled && this.isEditabled)) return;
        
        let saveCancelFunc = async () => {

          let params = {
            "menuId": 'M0003005',
            "update": [{ queryId: 'M0003005_cancel', data: [{ ...this.params, ...{'code': this.params['공정코드']} }] }]
          };
          if(this.params['공정코드'] == '013' && !this.isLotNo1 && !this.lrTypeYn){
            params['update'][0]['data'].push({...this.params1, ...{'code': this.params['공정코드']}});
          }
          
          const resp = await this.$axios.api.saveData(params);
          if (resp.status === 'success') {
            
            this.$toast('success', '작업취소 되었습니다.');
            this.searchClick();
          } else {
            this.$toast('error', resp.message);
          }
        }
        this.$confirm("확인", '작업취소 하시겠습니까? <br><span style="color:red">작업했던 내용이 삭제됩니다.</span>', (confirm)=>{
          if(confirm){
            saveCancelFunc();
          }
        });
        return;
      }
      // 작업시작~작업종료, 임시저장 버튼 클릭시 버튼 활성화에 따라 진행.
      if (action === 'start' && !this.isStartDisabled) {        
        return;
      }      
      if (action === 'temp' && !this.isTempDisabled) {
        return;
      }
      if (action === 'end' && !this.isEndDisabled) {
        return;
      }      
      if(action === 'start' && this.params['공정코드'] !== '010'){
        if(!this.$utils.isValidProperty(this.params, "전작업종료")){
          this.$toast('info', "Lot No["+this.params["lotNo"]+"] "+'전공정('+this.params["전공정"]+') 작업완료 되지 않았습니다.');
          return;
        }else if(this.params['공정코드'] == '013' && !this.isLotNo1 && !this.$utils.isValidProperty(this.params1, "전작업종료")){
          this.$toast('info', "Lot No["+this.params1["lotNo"]+"] "+'전공정('+this.params1["전공정"]+') 작업완료 되지 않았습니다.');
          return;
        }
      }else if(action === 'start' && this.params['공정코드'] == '010' && this.params["vlrCheck"] == 'N'){
        this.isProcessingMsg();
        return;
      }
      if(this.params['공정코드'] == '013' && !this.isLotNo1 && !this.lrTypeYn && this.$utils.isValidProperty(this.params, "machineCode") && this.$utils.isValidProperty(this.params1, "machineCode")){
        if(this.params["machineCode"] == this.params1["machineCode"]){
          this.$toast("info", "같은 설비번호 입니다.");        
          return;
        }else if(this.params["설비약명"] !== this.params1["설비약명"]){
          this.$toast("info", "서로 다른 설비입니다.");
          return;
        }
      }else if(this.params['공정코드'] == '015' && (action === 'temp' || action === 'end')){

        if(!_.isEmpty(this.validateCellsPerInfoGrid6())){
          this.$toast('info', '입력하세요.');
          return;
        }        
        /*if(this.$utils.validateRows(this.perInfoGrid6.columns, this.perInfoGrid6DP().getJsonRows(0, -1), ["blNo","담당자","비고","불량입력"])){
          this.$toast('info', '치수가 입력되지 않았습니다.');
          return;
        }*/
      }
      if(action === 'start' || action === 'end'){
        let keys = ['T:Lot No:lotNo', 'T:작업자:작업자', 'C:근무조:shift'];
        let keys1 = []

        if(this.params['공정코드'] == '013' && !this.lrTypeYn){
          keys.push('C:L축 M/C:machineCode');
          keys1.push('C:R축 M/C:machineCode');
        }else{
          keys.push('C:M/C:machineCode');
        }
        if(action === 'end'){
          if(this.params['공정코드'] == '010'){
            keys.unshift('T:Batch No:pCode');
            if(["RL#A","RL#B","RL#C"].includes(this.params["설비약명"])){
              keys.push('T:PANEL_ID:panelId');
            }
          }else if(this.params['공정코드'] == '013'){
            if(!this.lrTypeYn){
              keys.push('T:L축 TOOL NO 컷팅:toolNo컷팅','T:L축 TOOL NO 중삭:toolNo중삭','T:L축 TOOL NO 정삭:toolNo정삭',"T:L축 진공압:공정비고");
              keys1.push('T:R축 TOOL NO 컷팅:toolNo컷팅','T:R축 TOOL NO 중삭:toolNo중삭','T:R축 TOOL NO 정삭:toolNo정삭',"T:R축 진공압:공정비고");
            }else{
              keys.push('T:TOOL NO 컷팅:toolNo컷팅','T:TOOL NO 중삭:toolNo중삭','T:TOOL NO 정삭:toolNo정삭',"T:진공압:공정비고");
            }
          }else if(this.params['공정코드'] == '020'){
            keys.push('T:시작온도:시작온도','T:종료온도:종료온도','T:전면광량:전면광량',"T:후면광량:후면광량");
          }
        } 

        if(!this.$utils.validateFields(this.params, keys)) {
          return;
        }  

        if(this.params['공정코드'] == '013' && !this.isLotNo1 && !this.$utils.validateFields(this.params1, keys1)) {
          return;
        } 

        
        if(this.params['공정코드'] == '013' && action === 'start'){
          const checkAndUpdateTool = async (paramsObj) => {
            const searchParams = [
              { menuId: "M0003005", queryId: "M0003005_Sch3", queryParams: { ...paramsObj, '사용구분': '커팅' } },
              { menuId: "M0003005", queryId: "M0003005_Sch3", queryParams: { ...paramsObj, '사용구분': '중삭' } },
              { menuId: "M0003005", queryId: "M0003005_Sch3", queryParams: { ...paramsObj, '사용구분': '정삭' } }
            ];
            
            let result = await this.$axios.api.searchAll(searchParams);
            if (result[0].length > 1 || result[1].length > 1 || result[2].length > 1) {
              let errorMsg = "커팅 "+result[0].length+"개";
              errorMsg += ", 중삭 "+result[1].length+"개";
              errorMsg += ", 정삭 "+result[2].length+"개";

              this.$toast("error", "설비에 1개이상 툴이 등록 되어있습니다. 확인하시기 바랍니다.<br><span style='color:red'>"+errorMsg+"</span>", {
                dangerouslyHTMLString: true,
              });
              return;
            }
            if (_.isNil(result[0][0]) || _.isNil(result[1][0]) || _.isNil(result[2][0])) {
              let errorMsg = _.isNil(result[0][0]) ? "커팅 X" : "커팅 O";
              errorMsg += _.isNil(result[1][0]) ? ", 중삭 X" : ", 중삭 O";
              errorMsg += _.isNil(result[2][0]) ? ", 정삭 X" : ", 정삭 O";

              this.$toast("error", "설비에 등록되지 않은 툴이 있습니다. 확인하시기 바랍니다.<br><span style='color:red'>"+errorMsg+"</span>", {
                dangerouslyHTMLString: true,
              });
              return false;
            }
            return true;
          };
  
          // 첫 번째 Lot (기본 params 검사)
          let chk1 = await checkAndUpdateTool(this.params);
          if(!chk1){
            return;
          }
          // 두 번째 Lot 검사 (isLotNo1이 false일 경우)
          if (!this.isLotNo1 && !this.lrTypeYn) {
            let chk2 = await checkAndUpdateTool(this.params1);
            if(!chk2){
              return;
            }
          }
        }
      }


      

      // 임시저장, 작업시작, 작업종료 외
      if(!(action == 'temp' || action == 'start' || action == 'end'))return;

      let saveFunc = async () => {

        let dateTimeArray = this.$utils.getDateAndTimeArray1();

        if(action == 'end'){
          let startTime = this.params.작업시작+""+this.params.시작시각;
          let endTime = (this.endDay ? this.endDay : dateTimeArray[0])+""+(this.endTime ? this.endTime : dateTimeArray[1]);
          if(Number(startTime) > Number(endTime)){
            this.$toast('info', '작업종료가 작업시작 이전일수 없습니다.');
            return;
          }
        }

        if(this.params['공정코드'] == '010' && action == 'end'){
          let result = await this.$axios.api.search({ menuId: "M0003005", queryId: "M0003005_Sch17", queryParams: this.params });
          if(!_.isEmpty(result)){
            result[0]["근무조"] = _.isNil(result[0]["근무조"]) ? null : (result[0]["근무조"].length == 1 ? result[0]["근무조"]+""+"조" : result[0]["근무조"]);
            if(this.$utils.compareObjectValues(result[0], this.params, 
              ["panelId","근무조","작업자","설비호기","설비약명","작업시작","시작시각","tankNo","batchNo"], 
              ["panelId","shift","작업자","machineCode","설비약명","작업시작","시작시각","공정비고","pCode"])){
                dateTimeArray[0] = result[0]["작업종료"];
                dateTimeArray[1] = result[0]["종료시각"]
            }
          }
        }

        let row = {
          ...this.rows[0],
          ...this.params,
          ...(action === 'temp' ? {} : (action === 'start' 
            ? { '작업시작': (this.startDay ? this.startDay : dateTimeArray[0]), '시작시각': (this.startTime ? this.startTime : dateTimeArray[1]) }
            : { '작업종료': (this.endDay ? this.endDay : dateTimeArray[0]), '종료시각': (this.endTime ? this.endTime : dateTimeArray[1]) }
          )),
        };

        let params = {
          "menuId": 'M0003005',
          "update": [
            ((this.params['공정코드'] == '010' || this.params['공정코드'] == '020') ? { queryId: 'M0003005_TempMst', 
              data: [{
                ...row,
                ...{'code': this.params['공정코드']}
              }] 
            } : {}),
            ((
              action === 'temp' ? { queryId: 'M0003005_TempVlr', data: [{ ...row }] } 
              : (
                action === 'start' ? { queryId: 'M0003005_Start', data: [{ ...row, ...{'code': this.params['공정코드']} }] } 
                : { queryId: 'M0003005_End', data: [{ ...row, ...{'code': this.params['공정코드'] }}] }
              )
            )),
            (
              (action === 'start' || action === 'end') ? { queryId: 'M0003005_TempVlr', data: [{ ...row }] } : {}
            )
          ],
        };
        if(this.params['공정코드'] == '013'){
          const rows5 = this.perInfoGrid5DP().getJsonRows(0, -1).filter((item, index) => item['lotNo'] == this.params['lotNo'] && this.perInfoGrid5DP().getRowState(index) == RowState.UPDATED).map(item => ({
            ...item
          }));
          params['update'].push(
            {queryId: "M0003005_Update8", data: rows5},
          );
          params['update'].push(
            {queryId: "M0003005_Update8", data: rows5},
          );
          if(!this.isLotNo1 && !this.lrTypeYn){

            if(action == 'end'){
              let startTime1 = this.params1.작업시작+""+this.params1.시작시각;
              let endTime1 = (this.endDay ? this.endDay : dateTimeArray[0])+""+(this.endTime ? this.endTime : dateTimeArray[1]);
              if(Number(startTime1) > Number(endTime1)){
                this.$toast('info', '작업종료가 작업시작 이전일수 없습니다.');
                return;
              }
            }
            
            let row1 = {
              ...this.rows[1],
              ...this.params1,
              '작업자': this.params["작업자"],
              'shift': this.params["shift"],
              ...(action === 'temp' ? {} : (action === 'start' 
                ? { '작업시작': (this.startDay ? this.startDay : dateTimeArray[0]), '시작시각': (this.startTime ? this.startTime : dateTimeArray[1]) }
                : { '작업종료': (this.endDay ? this.endDay : dateTimeArray[0]), '종료시각': (this.endTime ? this.endTime : dateTimeArray[1]) }
              )),
            };
            params["update"].push(
              ((this.params['공정코드'] == '010' || this.params['공정코드'] == '020') ? { queryId: 'M0003005_TempMst', 
                data: [{
                  ...row1,
                  ...{'code': this.params['공정코드']}
                }] 
              } : {}),
              ((
                action === 'temp' ? { queryId: 'M0003005_TempVlr', data: [{ ...row1 }] } 
                : (
                  action === 'start' ? { queryId: 'M0003005_Start', data: [{ ...row1, ...{'code': this.params['공정코드']} }] } 
                  : { queryId: 'M0003005_End', data: [{ ...row1, ...{'code': this.params['공정코드'] }}] }
                )
              )),
              (
                (action === 'start' || action === 'end') ? { queryId: 'M0003005_TempVlr', data: [{ ...row1 }] } : {}
              )
            );

            const rows5 = this.perInfoGrid5DP().getJsonRows(0, -1).filter((item, index) => item['lotNo'] == this.params1['lotNo'] && this.perInfoGrid5DP().getRowState(index) == RowState.UPDATED).map(item => ({
              ...item
            }));
            params['update'].push(
              {queryId: "M0003005_Update8", data: rows5},
            );
          }
        }
        if(action === 'temp' || action === 'end'){
          if(this.params['공정코드'] == '015'){
            
            const jsonData = this.perInfoGrid6DP().getJsonRow(0);
            if(!_.isNil(jsonData)){
              const blockCount = jsonData["block수"];
              const indexs = this.indexMap[blockCount] || [];
              let chk = true;
              for(let index of indexs){
                let jsonData1 = this.perInfoGrid6DP().getJsonRow(index);
                if(!_.isNil(jsonData1["판정Space"]) && !_.isNil(jsonData1["판정Control"]) && !(jsonData1["판정Space"] == "OK" && jsonData1["판정Control"] == "YES")){
                  chk = false;
                  break;
                }	
              }
  
              if(chk){
                const rows5 = this.perInfoGrid6DP().getJsonRows(0, -1).filter((item1, index) => indexs.includes(index)).map(item => ({
                  ...item,
                  '공정코드': this.params['공정코드'],
                  'lotNo': this.params.lotNo,
                  '담당자': this.params['작업자']
                }));
                params['update'].push(
                  {queryId: "M0003005_Delete2", data: [this.params]},
                  {queryId: "M0003005_Update6", data: rows5},
                );
              }else{
                const rows5 = this.perInfoGrid6DP().getJsonRows(0, -1).map(item => ({
                  ...item,
                  '공정코드': this.params['공정코드'],
                  'lotNo': this.params.lotNo,
                  '담당자': this.params['작업자']
                }));
                params['update'].push(
                  {queryId: "M0003005_Delete2", data: [this.params]},
                  {queryId: "M0003005_Update6", data: rows5},
                );
              }
            }
            
          }else if(this.params['공정코드'] == '017' || this.params['공정코드'] == '020'){
            const rows5 = this.perInfoGrid3DP().getJsonRows(0, -1).filter((item1, index) => this.perInfoGrid3DP().getRowState(index) == RowState.UPDATED).map(item => ({
              ...item,
              '공정코드': this.params['공정코드'],
              'lotNo': this.params.lotNo,
              '담당자': this.params['작업자']
            }));
            params['update'].push(
              {queryId: "M0003005_Update8", data: rows5},
            );
          }
        }

        // 임시저장(mst, vlr), 작업시작(임시저장포함), 작업종료(임시저장포함)
        
        const resp = await this.$axios.api.saveData(params);
        if (resp.status === 'success') {
          
          if(action === 'start' || action === 'temp')this.isStartMessge = true;

          this.$toast('success', (action === 'temp' ? '임시저장 되었습니다.' : (action === 'start' ? '작업시작 되었습니다.' : '작업종료 되었습니다.')));
          this.searchClick();
        } else {
          this.$toast('error', resp.message);
        }
      }
      this.$confirm("확인", (action === 'temp' ? '임시저장 하시겠습니까?' : (action === 'start' ? '작업시작 하시겠습니까?' : '작업종료 하시겠습니까?')), (confirm)=>{
				if(confirm){
					saveFunc();
				}
      });
    },

    inputPCode(event){
      event.target.value = this.$utils.korToEng(event.target.value);
      const inputValue = event.target.value;
      this.params.pCode = this.$utils.formatPCode(inputValue, 10, "/");
    },

    validateCellsPerInfoGrid6(){
      this.isValidateCellsPerInfoGrid6 = true;
      let error = this.perInfoGrid6GV().validateCells(null, false);
      this.isValidateCellsPerInfoGrid6 = false;
      return error;
    },

    onInputTemperature(event, target) {
      const filteredValue = this.$utils.validateTemperatureInput(event);
      this.$nextTick(()=> {
        this.params[target] = filteredValue;
      });
    },

    onInputTemperature1(event, target) {
      const filteredValue = this.$utils.validateTemperatureInput1(event);
      this.$nextTick(()=> {
        this.params[target] = filteredValue;
      });
    },

    convertToUpperEnglish(event) {      
      this.$nextTick(()=>{
        const group = event.target.dataset.group; // params 또는 params1 판별
        const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
        if (group && this[group]) {
          this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
        }
      });
    },

    convertToUpperEnglish1(group, fieldName) {
      this.$nextTick(()=>{
        const inputElement = this.$refs[fieldName];
        if (!inputElement) {
          console.error("패널 입력 요소를 찾을 수 없습니다.");
          return;
        }
        if (this[group]) {
          this[group][fieldName] = this.$utils.korToEng(inputElement.input.value);
        }
      });
      
    },

    multiProcClick(){
      this.$refs.multiProcPopup.openDialog({
        ...this.params,
        processList: this.processList,
        shifts: this.shifts,
			  shiftTypes: this.shiftTypes,
			  machineCodes: this.machineCodes,
        itgFlag: false,
      });
    },

    perInfoGrid6Event(grid, itemIndex, row, field){
      const ds = grid.getDataSource();
      const fieldName = ds.getOrgFieldName(field);

      const fieldGroups = [
        { names: ["단측수치1", "단측수치2", "단측수치3"], deviationField: "편차단축", deviationField1: "단측수치" },
        { names: ["장측수치1", "장측수치2", "장측수치3"], deviationField: "편차장축", deviationField1: "장측수치" },
      ];
      const matchingGroup = fieldGroups.find(group => this.$utils.containsValue(group.names, fieldName));
      const jsonData = ds.getJsonRow(itemIndex);
      if (matchingGroup) {
        const values = matchingGroup.names
          .map(item => jsonData[item])
          .filter(value => !_.isNil(value));

        if (values.length > 0) {
          const calc = this.$utils.calculateMeanAndDeviation(values);
          if(matchingGroup.deviationField == '편차단축'){
            if(this.$utils.isRequiredFieldsFilled(jsonData, ["단측수치1", "단측수치2", "단측수치3"])){
              ds.setValue(itemIndex, 'offSet추천값', (this.$utils.numberValueOrDefault(jsonData['단측수치'])- calc.mean)/2);
              ds.setValue(itemIndex, 'offSet후', ((this.$utils.numberValueOrDefault(jsonData['단측수치'])- calc.mean)/2) - this.$utils.numberValueOrDefault(jsonData['offSet전']));
            }
          }
		      const range = calc.mean-this.$utils.numberValueOrDefault(jsonData[matchingGroup.deviationField1]);
          ds.setValue(itemIndex, matchingGroup.deviationField, range);

          const rangeOut1 = this.$utils.numberValueOrDefault(jsonData['단측controlRangeOut'], 0.03);
          const rangeOut2 = this.$utils.numberValueOrDefault(jsonData['장측controlRangeOut'], 0.03);
          const rangeOut3 = this.$utils.numberValueOrDefault(jsonData['단측rangeOut'], 0.05);
          const rangeOut4 = this.$utils.numberValueOrDefault(jsonData['장측rangeOut'], 0.05);

          const range1 = grid.getValue(itemIndex, "편차단축");
          const range2 = grid.getValue(itemIndex, "편차장축");

          if(this.$utils.isRequiredFieldsFilled(jsonData, ["단측수치1", "단측수치2", "단측수치3", "장측수치1", "장측수치2", "장측수치3"])){
            if(!this.$utils.isInRange(range1, rangeOut1)){
              ds.setValue(itemIndex, "판정Control", "NO");
            }else if(!this.$utils.isInRange(range2, rangeOut2)){
              ds.setValue(itemIndex, "판정Control", "NO");
            }else{
              ds.setValue(itemIndex, "판정Control", "YES");
            }
  
            if(!this.$utils.isInRange(range1, rangeOut3)){
              ds.setValue(itemIndex, "판정Space", "NG");
            }else if(!this.$utils.isInRange(range2, rangeOut4)){
              ds.setValue(itemIndex, "판정Space", "NG");
            }else{
              ds.setValue(itemIndex, "판정Space", "OK");
            }           
          }else{
            ds.setValue(itemIndex, "판정Control", null);
            ds.setValue(itemIndex, "판정Space", null);
          }

        }else{
          if(matchingGroup.deviationField == '편차단축'){
            ds.setValue(itemIndex, 'offSet추천값', null);
            ds.setValue(itemIndex, 'offSet후', null);
          }
          ds.setValue(itemIndex, "판정Control", null);
          ds.setValue(itemIndex, "판정Space", null);
          ds.setValue(itemIndex, matchingGroup.deviationField, null);
        }
      }else if(fieldName == 'offSet전'){
        if(this.$utils.isRequiredFieldsFilled(jsonData, ["offSet추천값", "offSet전"])){
          ds.setValue(itemIndex, 'offSet후', this.$utils.numberValueOrDefault(jsonData['offSet추천값']) - this.$utils.numberValueOrDefault(jsonData['offSet전']));
        }
      }
      const blockCount = jsonData["block수"];
      const indexs = this.indexMap[blockCount] || [];
      let chk = true;
      for(let index of indexs){
        let jsonData1 = ds.getJsonRow(index);
        if(!_.isNil(jsonData1["판정Space"]) && !_.isNil(jsonData1["판정Control"]) && !(jsonData1["판정Space"] == "OK" && jsonData1["판정Control"] == "YES")){
          chk = false;
          break;
        }	
      }
      // 기본값이 OK 의 경우 기본 BLOCK제외하고 NULL로 초기화.
      if(chk){
        const numbers = Array.from({ length: (blockCount-1) - 0 + 1 }, (_, i) => 0 + i);
        for(let number of numbers){
          if(!indexs.includes(number)){
            this.perInfoGrid6DP().updateRow(number, {
              "offSet추천값": null,
              "offSet전": 0.0,
              "offSet후": null,
              "판정Control": null,
              "판정Space": null,
              "편차단축": null,
              "편차장축": null,
              "단측수치1": null,
              "단측수치2": null,
              "단측수치3": null,
              "장측수치1": null,
              "장측수치2": null,
              "장측수치3": null,
            }, true);
          }
        }
      }
    },

    cellStyleCallbackPerInfoGrid57(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      if(fieldName == 'cell별불량수량'){
        const ds = grid.getDataSource();
        const jsonData = ds.getJsonRow(cell.index.itemIndex);
                
        if(jsonData["불량수량"] > 0 && this.isEditabled){
          rtn.editable = true;
          rtn.styleName = "tr edit";
        }else{
          rtn.editable = false;
          rtn.styleName = "tr";
        }        
      }
      return rtn
    },

    cellClickedPerInfoGrid57(grid, clickData){
      if(clickData.cellType !== "data") return;
      grid.commit();
      const ds = grid.getDataSource();
      const current = grid.getCurrent();
      const column = clickData.column;
      const jsonData = ds.getJsonRow(current.itemIndex);
      const text = grid.layoutByColumn(column).root.header.text;
      const text1 = grid.layoutByColumn(column).parent.header.text;
      const text2 = grid.layoutByColumn(column);
      let selectedParams = this.params;
      if(this.params['공정코드'] == '013' && !this.isLotNo1 && !this.lrTypeYn){
        selectedParams = (this.params.lotNo == jsonData.lotNo ? this.params : this.params1);
      }
      if(clickData.fieldName == '불량입력'){

        this.$refs.processingMapping.openDialog({
          ...selectedParams, 
          ...{ 
            blNo: jsonData.blNo, 
            line: 'D1UT',
            "자동여부": 0,
            dialogTitle: "불량 맵핑 입력",
            "불량구분": "불량",
            isEditabled: this.isEditabled,
            runId: selectedParams["lotNo"],
            callback: { queryId:'M0003005_Error', data:[{
              ...selectedParams,
              'code': this.params['공정코드'],
              line: 'D1UT',
              "자동여부": 0,
            }]}
          }
        });
      }else if(text1 == 'Tool No'){
        //if(!this.isEndDisabled)return;
        let value = grid.getValue(clickData.itemIndex, clickData.fieldName);
        // 잠시 if(!_.isNil(value)) return;
        this.$refs.toolPopup.openDialog({
          ...selectedParams, 
          ...{ 
            "구분": grid.layoutByColumn(column).displayText,
            isEditabled: this.isEndDisabled
          }
        });
      }
    },

    dateTimeInput1(fullDateTime) {
      if (moment(fullDateTime, 'YYYYMMDD HHmmss', true).isValid()) {
        this.startDay = fullDateTime.split(" ")[0];
        this.startTime = fullDateTime.split(" ")[1];
      }else{
        this.startDay = null;
        this.startTime = null;
      }
    },

    dateTimeInput2(fullDateTime) {
      if (moment(fullDateTime, 'YYYYMMDD HHmmss', true).isValid()) {
        this.endDay = fullDateTime.split(" ")[0];
        this.endTime = fullDateTime.split(" ")[1];
      }else{
        this.endDay = null;
        this.endTime = null;
      }
    },

    handleMouseDown(event) {
      const input = this.$refs.lotNoField;
      if (input && input.value) {
        event.preventDefault();
        input.select();
      }
    },

    handleMouseDown1(event) {
      const input = this.$refs.lotNoField1;
      if (input && input.value) {
        event.preventDefault();
        input.select();
      }
    },
    
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackPerInfoGrid3(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      if(fieldName == 'cell별불량수량'){
        const ds = grid.getDataSource();
        const jsonData = ds.getJsonRow(cell.index.itemIndex);
        if(jsonData["불량수량"] > 0 && this.isEditabled){
          rtn.editable = true;
          rtn.styleName = "tr edit";
        }else{
          rtn.editable = false;
          rtn.styleName = "tr";
        }        
      }
      return rtn
    },

    setCellStyleCallbackPerInfoGrid5(grid, cell){
      return this.cellStyleCallbackPerInfoGrid57(grid, cell);
    },

    setCellStyleCallbackPerInfoGrid7(grid, cell){
      return this.cellStyleCallbackPerInfoGrid57(grid, cell);
    },

    setCellStyleCallbackPerInfoGrid6(grid, cell){
      let rtn = {};
      const ds = grid.getDataSource();
      const fieldName = cell.index.fieldName;          
      const itemIndex = cell.index.itemIndex;   
      const jsonData = ds.getJsonRow(itemIndex);
      if(this.isEditabled){
        if(!_.isEmpty(this.rows5)){
          const blockCount = jsonData["block수"];
          const indexs = this.indexMap[blockCount] || [];
          let chk = true;
          for(let index of indexs){
            let jsonData1 = ds.getJsonRow(index);
            if(!_.isNil(jsonData1["판정Space"]) && !_.isNil(jsonData1["판정Control"]) && !(jsonData1["판정Space"] == "OK" && jsonData1["판정Control"] == "YES")){
              chk = false;
              break;
            }	
          }
          if(this.$utils.containsValue(["offSet전","두께수치","단측수치1","단측수치2","단측수치3","장측수치1","장측수치2","장측수치3","비고"], fieldName)){
            if(indexs.includes(cell.item.itemIndex)){
              rtn.editable = true;
              if(fieldName == '비고'){
                rtn.styleName = "tl edit";
              }else{
                rtn.styleName = "tr edit";
              }
            }
            if(!chk && !indexs.includes(cell.item.itemIndex)){
              rtn.editable = true;
              if(fieldName == '비고'){
                rtn.styleName = "tl edit";
              }else{
                rtn.styleName = "tr edit";
              }
            }
          }
        }
      }else{
        rtn.editable = false;
      }
      if(fieldName == '판정Control' && jsonData["판정Control"] == "YES"){
        rtn.styleName = 'success tl'
      }else if(fieldName == '판정Space' && jsonData["판정Space"] == "OK"){
        rtn.styleName = 'success tl'
      }else if(fieldName == '판정Control' && jsonData["판정Control"] == "NO"){
        rtn.styleName = 'error tl'
      }else if(fieldName == '판정Space' && jsonData["판정Space"] == "NG"){
        rtn.styleName = 'error tl'
      }else if(fieldName == '비고'){
        rtn.styleName = rtn.styleName + " tl";
      }else if(fieldName == '편차단축' && parseFloat(jsonData["편차단축"]) < 0){
        rtn.styleName = 'error tr'
      }else if(fieldName == '편차장축' && parseFloat(jsonData["편차장축"]) < 0){
        rtn.styleName = 'error tr'
      }
      return rtn
    },

    onCellClickedPerInfoGrid3(grid, clickData) {
      if(clickData.cellType !== "data") return;
      grid.commit();
      const ds = grid.getDataSource();
      const current = grid.getCurrent();
      const jsonData = ds.getJsonRow(current.itemIndex);
      if(clickData.fieldName == '불량입력'){
        let pre불량수량 = jsonData['pre불량수량'];
        if(pre불량수량 > 0){
          this.$toast("info", "이전 공정에서 불량처리되어서 불량입력할수 없습니다.");        
          return;
        }
        this.$refs.processingMapping.openDialog({
          ...this.params, 
          ...{ 
            blNo: jsonData.blNo, 
            line: 'D1UT',
            "자동여부": 0,
            dialogTitle: "불량 맵핑 입력",
            "불량구분": "불량",
            isEditabled: this.isEditabled,
            runId: this.params["lotNo"],
            callback: { queryId:'M0003005_Error', data:[{
              ...this.params,
              'code': this.params['공정코드'],
              line: 'D1UT',
              "자동여부": 0,
            }]}
          }
        });
      }
    },
    
    onCellClickedPerInfoGrid5(grid, clickData) {
      this.cellClickedPerInfoGrid57(grid, clickData);
    },

    onCellClickedPerInfoGrid7(grid, clickData) {
      this.cellClickedPerInfoGrid57(grid, clickData);
    },

    onCellClickedPerInfoGrid6(grid, clickData) {
      if(clickData.cellType !== "data") return;
      grid.commit();
      const ds = grid.getDataSource();
      const current = grid.getCurrent();
      const jsonData = ds.getJsonRow(current.itemIndex);
      if(clickData.fieldName == '불량입력'){         
        let saveData = this.$refs.perInfoGrid6.getSaveData();
        if(saveData.update.length > 0){
          this.$toast("info", "변경된 내용이있습니다. 임시저장후 진행하세요.");        
          return;
        }
        let pre불량수량 = jsonData['pre불량수량'];
        if(pre불량수량 > 0){
          this.$toast("info", "이전 공정에서 불량처리되어서 불량입력할수 없습니다.");        
          return;
        }
        this.$refs.errorInput.openDialog(
          {
            ...this.params,
            type: 'block',
            dialogTitle: this.params["lotNo"]+ ' / ' + jsonData["blNo"] + " / 불량입력",
            line: 'D1UT',
            "자동여부": 0,
            blNo: jsonData["blNo"],
            runId: this.params["lotNo"],
            isEditabled: this.isEditabled,
            keyPadFlag: false,
            callback: { queryId:'M0003005Error', data:[{
              ...this.params,
              'code': this.params['공정코드'],
              line: 'D1UT',
              "자동여부": 0,
            }]}
          }
        );
      }
    },

    onEditRowPastedPerInfoGrid6(grid, itemIndex, row, fields, oldValues, newValues) {
      fields.forEach(field=> this.onCellEditedPerInfoGrid6(grid, itemIndex, row, field))
    },

    onCellEditedPerInfoGrid6(grid, itemIndex, row, field) {      
      grid.commit();
      this.perInfoGrid6Event(grid, itemIndex, row, field);            
    },

    onCellPastingPerInfoGrid6(grid, index, value) {
      if(this.isEditabled){
        if(!_.isEmpty(this.rows5)){
          const ds = grid.getDataSource();
          const fieldName = index.fieldName;
          const itemIndex = index.itemIndex;   
          const jsonData = ds.getJsonRow(itemIndex);
          const blockCount = jsonData["block수"];
          const indexs = this.indexMap[blockCount] || [];
          let chk = true;
          for(let index of indexs){
            let jsonData1 = ds.getJsonRow(index);
            if(!_.isNil(jsonData1["판정Space"]) && !_.isNil(jsonData1["판정Control"]) && !(jsonData1["판정Space"] == "OK" && jsonData1["판정Control"] == "YES")){
              chk = false;
              break;
            }	
          }
          if(this.$utils.containsValue(["offSet전","두께수치","단측수치1","단측수치2","단측수치3","장측수치1","장측수치2","장측수치3"], fieldName)){
            if(indexs.includes(itemIndex)){
              return true;            
            }else if(!chk && !indexs.includes(itemIndex)){
              return true;            
            }else{
              return false;    
            }
          }else{
            return false;  
          }
        }
      }else{
        return false;
      }
    },

    onValidateColumnPerInfoGrid6(grid, column, inserting, value, itemIndex, dataRow) {
      let error = {};
      if(!this.isValidateCellsPerInfoGrid6) return error;

      const ds = grid.getDataSource();
      const jsonData = ds.getJsonRow(itemIndex);
      const blockCount = jsonData["block수"];
      const indexs = this.indexMap[blockCount] || [];

      let chk = true;
      for(let index of indexs){
        let jsonData1 = ds.getJsonRow(index);
        if(!(jsonData1["판정Space"] == "OK" && jsonData1["판정Control"] == "YES")){
          chk = false;
          break;
        }	
      }
      if(!chk && this.$utils.containsValue(["offSet전","두께수치","단측수치1","단측수치2","단측수치3","장측수치1","장측수치2","장측수치3"], column.fieldName)){
        if(_.isNil(value)){
          error.level = "error";
          error.message = "필수 입력입니다.";
        }        
      }
      return error;
    },
    onValidationFailPerInfoGrid6(grid, itemIndex, column, err) {
      return false;
    },

    onKeyDownPerInfoGrid6(grid, event) {
      if(event.keyCode == 46 && event.shiftKey){
        grid.commit();
        this.$nextTick(()=>{
          let sel = grid.getSelection();
          const numbers = Array.from({ length: sel.endRow - sel.startRow + 1 }, (_, i) => sel.startRow + i);
          let field = this.perInfoGrid6.fields.findIndex(field => field.fieldName === '단측수치1');
          for(let number of numbers){
            this.perInfoGrid6Event(grid, number, null, field);
          }
        });
      } 
    },

	},
}

</script>

<style lang="scss">
.rg-renderer{
	button{
		&.btn_error{
			border: 1px solid  #ff7f58;
      color:  #df4802;
		}
    &.btn_sucess{
			border: 1px solid  #2f46c7;
      color:   #2f46c7;
		}
    &.btn_block{
			border: 1px solid  rgb(0, 0, 0);
      color:   rgb(0, 0, 0);
		}
	}
}
</style>
<style scoped>
:deep.worker_info {
    display: flex;
    align-items: center;
    width: calc(50% - 50px);
}
</style>