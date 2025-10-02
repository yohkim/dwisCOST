<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :size="params.popUpSize" no-close-on-backdrop centered>
    <template #title>
      {{ params.dialogTitle }}
    </template>
    <div class="pallet_storage">
      <table>
        <colgroup>
          <col span="17" style="width: 5.8%" />
          <col style="width: 1.4%" />
        </colgroup>
        <tbody>
          <tr v-for="(areaList, index) in areaMatrix" :key="index">
            <td v-for="(area, index) in areaList" :key="index" :class="area.class" @click="clickArea(area)">{{ area.value }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td>7</td>
            <td>8</td>
            <td>9</td>
            <td>10</td>
            <td>11</td>
            <td>12</td>
            <td>13</td>
            <td>14</td>
            <td class="horizontal"></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div v-show="params.showButton" class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
      <b-button class="main" block @click="confirm" v-show="params.btnConfirm">저장</b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'storageAreaPopup',
  props: {},
  emits: ['confirm'],
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: '보관 구역 선택',
        btnConfirm: true,
        popUpSize: 'xl',
        showButton: true,
        confirmOnEnter: true,
        palletNo: '',
      },
      deleteAreaList: [],
      insertArea: null,
      cancelArea: null,
      areaMatrixInit: [
        [
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: '', cellRow: 'F', cellCol: '1' },
          { value: '', class: '', cellRow: 'F', cellCol: '2' },
          { value: '', class: '', cellRow: 'F', cellCol: '3' },
          { value: '', class: '', cellRow: 'F', cellCol: '4' },
          { value: '', class: '', cellRow: 'F', cellCol: '5' },
          { value: '', class: '', cellRow: 'F', cellCol: '6' },
          { value: '', class: '', cellRow: 'F', cellCol: '7' },
          { value: '', class: '', cellRow: 'F', cellCol: '8' },
          { value: '', class: '', cellRow: 'F', cellCol: '9' },
          { value: '', class: '', cellRow: 'F', cellCol: '10' },
          { value: '', class: '', cellRow: 'F', cellCol: '11' },
          { value: '', class: '', cellRow: 'F', cellCol: '12' },
          { value: '', class: 'disable', cellRow: 'F', cellCol: '13' },
          { value: '', class: 'disable', cellRow: 'F', cellCol: '14' },
          { value: 'F', class: 'horizontal', cellRow: '', cellCol: '' },
        ],
        [
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'road', cellRow: '', cellCol: '' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '1' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '2' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '3' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '4' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '5' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '6' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '7' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '8' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '9' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '10' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '11' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '12' },
          { value: '', class: 'road', cellRow: 'E', cellCol: '13' },
          { value: '', class: 'disable', cellRow: 'E', cellCol: '14' },
          { value: 'E', class: 'horizontal', cellRow: '', cellCol: '' },
        ],
        [
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'road', cellRow: '', cellCol: '' },
          { value: '', class: '', cellRow: 'D', cellCol: '1' },
          { value: '', class: '', cellRow: 'D', cellCol: '2' },
          { value: '', class: '', cellRow: 'D', cellCol: '3' },
          { value: '', class: '', cellRow: 'D', cellCol: '4' },
          { value: '', class: '', cellRow: 'D', cellCol: '5' },
          { value: '', class: '', cellRow: 'D', cellCol: '6' },
          { value: '', class: '', cellRow: 'D', cellCol: '7' },
          { value: '', class: '', cellRow: 'D', cellCol: '8' },
          { value: '', class: '', cellRow: 'D', cellCol: '9' },
          { value: '', class: '', cellRow: 'D', cellCol: '10' },
          { value: '', class: '', cellRow: 'D', cellCol: '11' },
          { value: '', class: '', cellRow: 'D', cellCol: '12' },
          { value: '', class: '', cellRow: 'D', cellCol: '13' },
          { value: '', class: 'disable', cellRow: 'D', cellCol: '14' },
          { value: 'D', class: 'horizontal', cellRow: '', cellCol: '' },
        ],
        [
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'road', cellRow: '', cellCol: '' },
          { value: '', class: '', cellRow: 'C', cellCol: '1' },
          { value: '', class: '', cellRow: 'C', cellCol: '2' },
          { value: '', class: '', cellRow: 'C', cellCol: '3' },
          { value: '', class: '', cellRow: 'C', cellCol: '4' },
          { value: '', class: '', cellRow: 'C', cellCol: '5' },
          { value: '', class: '', cellRow: 'C', cellCol: '6' },
          { value: '', class: '', cellRow: 'C', cellCol: '7' },
          { value: '', class: '', cellRow: 'C', cellCol: '8' },
          { value: '', class: '', cellRow: 'C', cellCol: '9' },
          { value: '', class: '', cellRow: 'C', cellCol: '10' },
          { value: '', class: '', cellRow: 'C', cellCol: '11' },
          { value: '', class: '', cellRow: 'C', cellCol: '12' },
          { value: '', class: '', cellRow: 'C', cellCol: '13' },
          { value: '', class: '', cellRow: 'C', cellCol: '14' },
          { value: 'C', class: 'horizontal', cellRow: '', cellCol: '' },
        ],
        [
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'road', cellRow: '', cellCol: '' },
          { value: '', class: '', cellRow: 'B', cellCol: '1' },
          { value: '', class: '', cellRow: 'B', cellCol: '2' },
          { value: '', class: '', cellRow: 'B', cellCol: '3' },
          { value: '', class: '', cellRow: 'B', cellCol: '4' },
          { value: '', class: '', cellRow: 'B', cellCol: '5' },
          { value: '', class: '', cellRow: 'B', cellCol: '6' },
          { value: '', class: '', cellRow: 'B', cellCol: '7' },
          { value: '', class: '', cellRow: 'B', cellCol: '8' },
          { value: '', class: '', cellRow: 'B', cellCol: '9' },
          { value: '', class: '', cellRow: 'B', cellCol: '10' },
          { value: '', class: '', cellRow: 'B', cellCol: '11' },
          { value: '', class: '', cellRow: 'B', cellCol: '12' },
          { value: '', class: '', cellRow: 'B', cellCol: '13' },
          { value: '', class: 'disable', cellRow: 'B', cellCol: '14' },
          { value: 'B', class: 'horizontal', cellRow: '', cellCol: '' },
        ],
        [
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'disable', cellRow: '', cellCol: '' },
          { value: '', class: 'road', cellRow: '', cellCol: '' },
          { value: '', class: '', cellRow: 'A', cellCol: '1' },
          { value: '', class: '', cellRow: 'A', cellCol: '2' },
          { value: '', class: '', cellRow: 'A', cellCol: '3' },
          { value: '', class: '', cellRow: 'A', cellCol: '4' },
          { value: '', class: '', cellRow: 'A', cellCol: '5' },
          { value: '', class: '', cellRow: 'A', cellCol: '6' },
          { value: '', class: '', cellRow: 'A', cellCol: '7' },
          { value: '', class: '', cellRow: 'A', cellCol: '8' },
          { value: '', class: '', cellRow: 'A', cellCol: '9' },
          { value: '', class: '', cellRow: 'A', cellCol: '10' },
          { value: '', class: '', cellRow: 'A', cellCol: '11' },
          { value: '', class: '', cellRow: 'A', cellCol: '12' },
          { value: '', class: '', cellRow: 'A', cellCol: '13' },
          { value: '', class: '', cellRow: 'A', cellCol: '14' },
          { value: 'A', class: 'horizontal', cellRow: '', cellCol: '' },
        ],
      ],
      areaMatrix: [],
    };
  },
  computed: {},
  methods: {
    async openDialog(params) {
      Object.assign(this.params, params);

      if (_.isEmpty(this.params.palletNo)) {
        this.params.btnConfirm = false;
        this.params.dialogTitle = '보관 구역 조회';
      } else {
        this.params.btnConfirm = true;
        this.params.dialogTitle = '보관 구역 선택';
      }
      this.$nextTick(() => {
        this.areaMatrix = [];
        this.areaMatrix = JSON.parse(JSON.stringify(this.areaMatrixInit));
        this.deleteAreaList = [];
        this.insertArea = null;
        this.cancelArea = null;

        let params = { menuId: 'M0003009', queryId: 'M0003009_Sch11_Storage', queryParams: null, target: null };
        this.$axios.api.search(params).then((resp) => {
          if (resp != null && resp.length > 0) {
            resp.forEach((item) => {
              const location = item['보관구역'].split(',');
              let row = 'F'.charCodeAt(0) - location[0].charCodeAt(0);
              let col = Number(location[1]) + 2;
              let area = this.areaMatrix[row][col];
              if (area.class == 'horizontal' || area.class == 'disable' || area.class == 'road') return;
              area.value = item.palletNo;
              area.class = 'on';
              if (item.palletNo == this.params.palletNo) {
                this.insertArea = area;
              }
            });
          }
          this.areaMatrix.push();
          this.isOpen = true;
        });
      });
    },
    closeDialog() {
      if(this.params.btnConfirm) {
        this.$emit('confirm');
      }
      this.isOpen = false;
    },
    confirm() {
      this.$nextTick(() => {
        const updateList = [];
        this.deleteAreaList.forEach((item) => {
          updateList.push({ palletNo: item.value, 보관구역: '' });
        });

        if (this.insertArea != null) {
          updateList.push({ palletNo: this.insertArea.value, 보관구역: this.insertArea.cellRow + ',' + this.insertArea.cellCol });
        } else if (this.cancelArea != null) {
          updateList.push({ palletNo: this.cancelArea.value, 보관구역: '' });
        }
        if (updateList.length > 0) {
          let params = { menuId: 'M0003009', update: [{ queryId: 'M0003009_Update_Storage', data: updateList }] };
          this.$axios.api.saveData(params).then((resp) => {
            this.$emit('confirm');
            this.isOpen = false;
          });
        } else {
          this.$emit('confirm');
          this.isOpen = false;
        }
      });
    },
    clickArea(area) {
      if (area.class == 'horizontal' || area.class == 'disable' || area.class == 'road') return;

      if (area.class == 'on') {
        if (!_.isEmpty(this.params.palletNo) && this.params.palletNo == area.value) {
          this.$confirm('확인', '해당 Pallet No가 이미 지정되어 있습니다. 보관 구역 설정을 취소하시겠습니까?', (confirmed) => {
            if (confirmed) {
              this.cancelArea = Object.assign({}, area);
              area.value = '';
              area.class = '';
              this.insertArea = null;
            }
          });
        } else if (!_.isEmpty(this.params.palletNo) && this.params.palletNo != area.value) {
          this.$confirm('확인', '다른 Pallet No가 이미 지정되어 있습니다. 다른 Pallet No를 삭제하고 해당 Pallet No로 보관 구역을 설정하시겠습니까?', (confirmed) => {
            if (confirmed) {
              const deleteArea = Object.assign({}, area);
              this.deleteAreaList.push(deleteArea);
              if (this.insertArea != null) {
                this.insertArea.value = '';
                this.insertArea.class = '';
              }
              area.value = this.params.palletNo;
              area.class = 'on';
              this.insertArea = area;
              this.cancelArea = null;
            }
          });
        }
      } else if (area.class == '' && !_.isEmpty(this.params.palletNo) && this.insertArea != null) {
        this.$confirm('확인', '해당 Pallet No가 이미 지정되어 있습니다. 보관 구역 설정을 변경하시겠습니까?', (confirmed) => {
          if (confirmed) {
            if (this.insertArea != null) {
              this.insertArea.value = '';
              this.insertArea.class = '';
            }
            area.value = this.params.palletNo;
            area.class = 'on';
            this.insertArea = area;
            this.cancelArea = null;
          }
        });
      } else if (area.class == '' && !_.isEmpty(this.params.palletNo)) {
        area.value = this.params.palletNo;
        area.class = 'on';
        this.insertArea = area;
        this.cancelArea = null;
      }

      this.areaMatrix.push();
    },
  },
};
</script>

<style lang="scss">
/* 필요한 스타일 추가 */
.pallet_storage {
  table {
    tbody {
      td {
        border: 1px solid #dcdcdc;
        height: 70px;
        cursor: pointer;
        color: #000;
        font-size: 14px;
        text-align: center;
        &.horizontal {
          border: 0 !important;
          text-align: center;
          cursor: default !important;
        }
        &.disable {
          cursor: default !important;
          position: relative;
          background: linear-gradient(to top left, transparent 49%, #dcdcdc 50%, #dcdcdc 51%, transparent 52%);
        }
        &.road {
          background: #dcdcdc;
          cursor: default !important;
        }
        &:nth-child(4) {
          &.on {
            background: #84ccc9;
          }
        }
        &:nth-child(5) {
          &.on {
            background: #a6937c;
          }
        }
        &:nth-child(6) {
          &.on {
            background: #88abda;
          }
        }
        &:nth-child(7) {
          &.on {
            background: #d1c0a5;
          }
        }
        &:nth-child(8) {
          &.on {
            background: #aa89bd;
          }
        }
        &:nth-child(9) {
          &.on {
            background: #80c269;
          }
        }
        &:nth-child(10) {
          &.on {
            background: #ec6941;
          }
        }
        &:nth-child(11) {
          &.on {
            background: #aa89bd;
          }
        }
        &:nth-child(12) {
          &.on {
            background: #5f52a0;
          }
        }
        &:nth-child(13) {
          &.on {
            background: #b28850;
          }
        }
        &:nth-child(14) {
          &.on {
            background: #fff100;
          }
        }
        &:nth-child(15) {
          &.on {
            background: #009944;
          }
        }
        &:nth-child(16) {
          &.on {
            background: #eb6877;
          }
        }
        &:nth-child(17) {
          &.on {
            background: #8fc31f;
          }
        }
      }
    }
    tfoot {
      td {
        border: 0 !important;
        height: 20px !important;
        text-align: center;
      }
    }
  }
}
</style>
