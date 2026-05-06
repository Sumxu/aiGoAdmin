<script setup lang="ts">
import { reactive, ref, onMounted, h } from "vue";
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import * as $userApi from "@/api/member/quizList";
import message from "@/utils/message";
import StatusTabs from "@/components/opts/status-tabs.vue";
import { contractAddress } from "@/config/contract";
import guessingAbi from "@/abi/guessingABI.ts";
import {
  formatAddress,
  formatDate,
  fromWei,
  callContractMethod
} from "@/utils/wallet";
import {
  betTypeMapConvert,
  quizStatusMapConvert,
  quizClaimStatusMapConvert,
  erc20IndexMapConvert
} from "@/constants/convert";
import {
  betTypeOption,
  quizClaimStatusOption,
  quizStatusOption
} from "@/constants/constants";
import { ElMessageBox, ElSelect, ElOption } from "element-plus";
import { fa } from "element-plus/es/locale";
const pageData: any = reactive({
  searchState: true,
  searchForm: {},
  claimStatus: "null",
  searchField: [
    {
      type: "input",
      label: "钱包地址",
      prop: "address",
      placeholder: "请输入钱包地址"
    },
    {
      type: "date",
      dateType: "datetimerange",
      label: "投入日期范围",
      prop: "dates",
      placeholder: "请输入日期范围",
      startPlaceholder: "请输入开始日期范围",
      endPlaceholder: "请输入结束日期范围"
    },
    {
      type: "select",
      label: "领取状态",
      prop: "status",
      placeholder: "请选择领取状态",
      dataSourceKey: "quizStatusOption",
      options: {
        filterable: true,
        keys: {
          prop: "value",
          value: "value",
          label: "label"
        }
      }
    },
    {
      type: "select",
      label: "投注类型",
      prop: "betType",
      placeholder: "请选择投注类型",
      dataSourceKey: "betTypeOption",
      options: {
        filterable: true,
        keys: {
          prop: "value",
          value: "value",
          label: "label"
        }
      }
    }
  ],
  dataSource: {
    betTypeOption: betTypeOption,
    quizClaimStatusOption: quizClaimStatusOption,
    quizStatusOption: quizStatusOption
  },
  permission: {
    query: ["defi:user:page"]
  },
  btnOpts: {
    size: "small",
    leftBtns: [],
    rightBtns: []
  },
  guessingLoading: false,
  guessNum: "",
  guessHx: "",
  tableParams: {
    columns: [
      {
        label: "期数",
        prop: "quizNumber"
      },
      {
        label: "投入数量",
        prop: "amount",
        slot: "amountScope"
      },
      {
        label: "代币类型",
        prop: "erc20Index",
        slot: "erc20IndexScope"
      },
      {
        label: "投注类型",
        prop: "betType",
        slot: "betTypeScope"
      },
      {
        label: "是否中奖",
        prop: "status",
        slot: "statusScope"
      },
      {
        label: "中奖数量",
        prop: "winningAmount",
        slot: "winningAmountScope"
      },
      {
        label: "领取状态",
        prop: "claimStatus",
        slot: "claimStatusScope"
      },
      {
        label: "投入时间",
        prop: "createTime"
      }
    ],
    list: [],
    info: {},
    loading: false,
    pagination: {
      pageSize: 50,
      defaultPageSize: 50,
      currentPage: 1,
      total: 0,
      background: true,
      pageSizes: [50, 100, 200, 300, 500]
    }
  }
});

// 搜索表单变化
const _updateSearchFormData = (data: any) => (pageData.searchForm = data);

// 查询
const _searchForm = (data: any) => {
  pageData.searchForm = data;
  _loadData();
};
const guessClick = async () => {
  try {
    pageData.guessingLoading = true;
    const res = await callContractMethod(
      contractAddress.guessingContract,
      guessingAbi.abi,
      "manuaLottery",
      [pageData.guessNum, pageData.guessHx],
      true
    );
    if (res) {
      message.success("操作成功");
    }
  } catch (error) {
     message.warning("操作失败");
  } finally {
    pageData.guessingLoading = false;
  }
};
// 重置
const _resetSearchForm = (data?) => (pageData.searchForm = data);

// 获取分页参数
const getQueryParams = () => ({
  ...pageData.searchForm,
  current: pageData.tableParams.pagination.currentPage,
  size: pageData.tableParams.pagination.pageSize,
  claimStatus: pageData.claimStatus
});

// 获取表格数据
const _loadData = (page?: number) => {
  pageData.tableParams.list = [];
  pageData.tableParams.loading = true;
  const query = getQueryParams();
  if (page) query.current = page;
  $userApi
    .queryPage(query)
    .then((res: any) => {
      if (res.code === 200) {
        pageData.tableParams.list = res.data.records;
        pageData.tableParams.pagination.total = Number(res.data.total);
      } else {
        message.warning(res.msg);
        pageData.tableParams.list = [];
        pageData.tableParams.pagination.total = 0;
      }
    })
    .finally(() => (pageData.tableParams.loading = false));

  $userApi
    .queryTotal(query)
    .then((res: any) => {
      if (res.code === 200) {
        pageData.tableParams.info = res.data;
      } else {
        message.warning(res.msg);
      }
    })
    .finally(() => (pageData.tableParams.loading = false));
};
// 获取统计数据
const _loadInfo = (page?: number) => {
  pageData.tableParams.list = [];
  pageData.tableParams.loading = true;
  $userApi
    .queryTotal({
      dates: pageData.totalDateTime
    })
    .then((res: any) => {
      if (res.code === 200) {
        pageData.tableParams.info = res.data;
      } else {
        message.warning(res.msg);
      }
    })
    .finally(() => (pageData.tableParams.loading = false));
};
// 分页切换
const handleChangePageSize = (val: any) => {
  pageData.tableParams.pagination.pageSize = val;
  _loadData();
};

const handleChangeCurrentPage = (val: any) => {
  pageData.tableParams.pagination.currentPage = val;
  _loadData();
};
const handleTabClick = val => {
  pageData.claimStatus = val;
  _loadData();
};
// 按钮操作
const btnClickHandle = (key: string) => {
  switch (key) {
    case "search":
      pageData.searchState = !pageData.searchState;
      break;
    case "refresh":
      _loadData();

      break;
  }
};
onMounted(() => {
  _loadData();
});
</script>

<template>
  <el-card :shadow="'never'">
    <h3 style="margin-bottom: 12px">竞猜统计</h3>
    <el-row>
      <el-col :span="8">
        <el-card class="box-card" style="margin: 12px">
          <template #header>
            <div class="card-header">
              <span>AGB流水</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ fromWei(pageData.tableParams.info.agbFlow) }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" style="margin: 12px">
          <template #header>
            <div class="card-header">
              <span>AGB获利</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ fromWei(pageData.tableParams.info.agbProfit) }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" style="margin: 12px">
          <template #header>
            <div class="card-header">
              <span>AGB亏损</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ fromWei(pageData.tableParams.info.agbLoss) }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-card class="box-card" style="margin: 12px">
          <template #header>
            <div class="card-header">
              <span>COCO流水</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ fromWei(pageData.tableParams.info.cocoFlow) }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" style="margin: 12px">
          <template #header>
            <div class="card-header">
              <span>COCO获利</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ fromWei(pageData.tableParams.info.cocoProfit) }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" style="margin: 12px">
          <template #header>
            <div class="card-header">
              <span>COCO亏损</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ fromWei(pageData.tableParams.info.cocoLoss) }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <el-card class="box-card" style="margin: 12px">
          <template #header>
            <div class="card-header">
              <span>一直涨流水</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ fromWei(pageData.tableParams.info.yzzFlow) }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" style="margin: 12px">
          <template #header>
            <div class="card-header">
              <span>一直涨获利</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ fromWei(pageData.tableParams.info.yzzProfit) }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" style="margin: 12px">
          <template #header>
            <div class="card-header">
              <span>一直涨亏损</span>
            </div>
          </template>
          <div class="text item">
            <span>{{ fromWei(pageData.tableParams.info.yzzLoss) }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <div class="box">
        <div class="boxOption">
          <div class="leftLabel">开奖期数</div>
          <div class="rightInput">
            <el-input
              placeholder="请输入开奖期数"
              v-model="pageData.guessNum"
            ></el-input>
          </div>
        </div>

        <div class="boxOption">
          <div class="leftLabel">哈希值</div>
          <div class="rightInput">
            <el-input
              placeholder="请输入哈希值"
              v-model="pageData.guessHx"
            ></el-input>
          </div>
        </div>
        <div class="boxOption">
          <el-button
            type="primary"
            :loading="pageData.guessingLoading"
            @click="guessClick"
            >确认开奖</el-button
          >
        </div>
      </div>
    </el-row>

    <form-search
      :show="pageData.searchState"
      :form-field="pageData.searchField"
      :data-source="pageData.dataSource"
      @search-form="_updateSearchFormData"
      @search="_searchForm"
      @reset="_resetSearchForm"
    />
    <status-tabs
      v-model="pageData.claimStatus"
      :tabs="quizClaimStatusOption"
      @change="handleTabClick"
    />
    <pure-table
      :data="pageData.tableParams.list"
      :columns="pageData.tableParams.columns"
      row-key="address"
      border
      stripe
      :loading="pageData.tableParams.loading"
      :pagination="pageData.tableParams.pagination"
      @page-current-change="handleChangeCurrentPage"
      @page-size-change="handleChangePageSize"
    >
      <template #amountScope="scope">
        <span>{{ fromWei(scope.row[scope.column.property]) }}</span>
      </template>
      <template #betTypeScope="scope">
        <span>{{ betTypeMapConvert(scope.row[scope.column.property]) }}</span>
      </template>
      <template #statusScope="scope">
        <span>{{
          quizStatusMapConvert(scope.row[scope.column.property])
        }}</span>
      </template>
      <template #winningAmountScope="scope">
        <span>{{ fromWei(scope.row[scope.column.property]) }}</span>
      </template>
      <template #claimStatusScope="scope">
        <span>{{
          quizClaimStatusMapConvert(scope.row[scope.column.property])
        }}</span>
      </template>
      <template #erc20IndexScope="scope">
        <span>{{
          erc20IndexMapConvert(scope.row[scope.column.property])
        }}</span>
      </template>
    </pure-table>
  </el-card>
</template>
<style>
.box {
  display: flex;
  align-items: center;
  margin-left: 28px;
}
.boxOption {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  margin-right: 24px;
}
.leftLabel {
  font-size: 14px;
  font-weight: 700;
  color: var(--el-text-color-regular);
}
.rightInput {
  width: 240px;
  margin-left: 14px;
}
</style>
