<template>
  <div>
    <b-tabs b-model="tab" class="three_depth_tab">
      <b-tab title="재공/재고">
        <WIP />
      </b-tab>
      <b-tab title="완제품 재고">
        <FinishedStock />
      </b-tab>
      <b-tab title="공정별 재고">
        <ProcessWorkStatus />
      </b-tab>
      <b-tab title="생산 일보">
        <DPR />
      </b-tab>
      <b-tab title="생산 실적">
        <DailyProdReport />
      </b-tab>
      <b-tab title="설비별 생산 실적">
        <WorkEndByFac />
      </b-tab>
      <b-tab title="공정별 불량 현황">
        <ProcessDailyErrorReport />
      </b-tab>
      <b-tab title="공정별 작업 이력">
        <ManufacturingWorkStatus />
      </b-tab>
      <b-tab title="CELL 작업 이력">
        <CellSearch />
      </b-tab>
      <b-tab title="자재 사용 현황">
        <ProcessMatStatus />
      </b-tab>
      <!-- 2025.6.5 사용중지			
			<b-tab title="설비별(작업중)">
				<WorkIngByFac/>
			</b-tab> -->
    </b-tabs>
  </div>
</template>

<script>
import ProcessWorkStatus from '@components/ProcessWorkStatus.vue';
import ManufacturingWorkStatus from '@components/ManufacturingWorkStatus.vue';
import DailyProdReport from '@components/DailyProdReport.vue';
import ProcessDailyErrorReport from '@components/ProcessDailyErrorReport.vue';
import WIP from '@components/WIP.vue';
import ProcessMatStatus from '@components/ProcessMatStatus.vue';
import WorkEndByFac from '@components/WorkEndByFac.vue';
import WorkIngByFac from '@components/WorkIngByFac.vue';
import CellSearch from '@web/m0005000/tab/TAB054000.vue';
import FinishedStock from '@web/m0003000/tab/TAB045600.vue';
import DPR from '@components/DPR.vue';

export default {
  props: {},
  components: {
    ProcessWorkStatus,
    ManufacturingWorkStatus,
    WIP,
    ProcessMatStatus,
    WorkEndByFac,
    WorkIngByFac,
    DailyProdReport,
    ProcessDailyErrorReport,
    CellSearch,
	  FinishedStock,
    DPR,
  },
  watch: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  beforeUnmount() {},
  methods: {},
};
</script>
