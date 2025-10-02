/**
*	제조 실적 입력 > Lot Run Card 발행 > Run Card #1 발행
*/
<template>
	<div>
		<b-tabs v-model="activeTab"  class="four_depth_tab">
            <b-tab title="생성분"></b-tab>
            <b-tab title="미생성분"></b-tab>
        </b-tabs>
		<div class="four_d_box">
			<TAB0160001 ref="tab1" @update="onOptionUpdate" :modelList="modelList" :selectedModel="selectedModel" :workTypeList="workTypeList" :selectedWorkType="selectedWorkType" :startDate="startDate" :endDate="endDate" v-show="activeTab==0"/>
			<TAB0160002 ref="tab2" @update="onOptionUpdate" :modelList="modelList" :selectedModel="selectedModel" :workTypeList="workTypeList" :selectedWorkType="selectedWorkType" :startDate="startDate" :endDate="endDate" v-show="activeTab==1"/>
		</div>
	</div>	
</template>

<script>
import TAB0160001 from "./TAB016001.vue";
import TAB0160002 from "./TAB016002.vue";

export default {
	name: "TAB016000",
	components:{
		TAB0160001,
		TAB0160002
	},
	data () {
		return {
			modelList: [], 
			selectedModel: null, 
			workTypeList: [],
			selectedWorkType: null,
			startDate: "", // Start date for 수주일자
      endDate: "", // End date for 수주일자
			activeTab:0
		}
	},
	computed: {
	},
	created() {
		
	},	
	async mounted() {
    this.$eventBus.on("lotRunCardMenuMove", this.lotRunCardMenuMove);
    this.$eventBus.on("lotRunCardSearch", this.lotRunCardSearch);
	  this.getSelectOptions();
	},
  beforeUnmount() {
		this.$eventBus.off("lotRunCardMenuMove");
    this.$eventBus.off("lotRunCardSearch");
	},
	methods: {
    lotRunCardMenuMove(data){
      // console.log("data:::",data);
      this.$nextTick(()=>{
        // console.log("modelList:::",this.modelList);
        // console.log("workTypeList:::",this.workTypeList);
        let lotNo = data['lotNo'];
        let model = lotNo.match(/^\d{4}/)[0];
        let workType = lotNo.match(/-(\w)/)[1];
        console.log("model:::",model);
        console.log("workType:::",workType);
        for(let i = 0; i < this.modelList.length; i++){
          if(this.modelList[i]['text'] === model){
            this.selectedModel = this.modelList[i];
            break;
          }
        }
        for(let i = 0; i < this.workTypeList.length; i++){
          let tempText = this.workTypeList[i]['text'];
          let text = tempText.match(/\((.)\)/)[1];
          if(text === workType){
            this.selectedWorkType = this.workTypeList[i];
            break;
          }
        }
      });  
    },
    //그냥 분리리
    lotRunCardSearch(){
      if (this.activeTab === 0) {
        this.$refs.tab1.searchRunInfo();
      } else if (this.activeTab === 1) {
        this.$refs.tab2.searchLotInfo();
      } else {
        console.warn("잘못된 메뉴이동");
      }
    },
    onOptionUpdate(e){
      //console.log(e);
      this[e.name] = e.value;
    },
		async getSelectOptions() {
      let param = [
        {
          menuId: "M0003007",
          queryId: "getModels",
          callback: (data) => {
            this.$utils.transformData(
              data,
              ["value", "text"],
              ["코드", "제품유형"],
              this.modelList
            );
          },
        },
        {
          menuId: "M0003007",
          queryId: "getWorkTypes",
          callback: (data) => {
            this.$utils.transformData(
              data,
              ["value", "text"],
              ["코드", "작업구분"],
              this.workTypeList
            );
          },
        },
      ];
      await this.$axios.api.searchAll(param);
      this.startDate = this.$utils.getTodayDate();
      this.endDate = this.$utils.getTodayDate();
    },
	}
}
</script>