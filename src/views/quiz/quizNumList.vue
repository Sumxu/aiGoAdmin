<script setup lang="ts">
import { reactive, ref, onMounted, h } from "vue";
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import * as $userApi from "@/api/member/quizNumList";
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
  quizInfoStatusMapConvert,
  quizClaimStatusMapConvert,
  erc20IndexMapConvert
} from "@/constants/convert";
import {
  betTypeOption,
  quizClaimStatusOption,
  quizInfoStatusOption
} from "@/constants/constants";
import {
  ElMessageBox,
  ElSelect,
  ElOption,
  ElMessage,
  ElInput
} from "element-plus";
import { fa, ro } from "element-plus/es/locale";
const pageData: any = reactive({
  searchState: true,
  searchForm: {},
  claimStatus: "null",
  searchField: [
    {
      type: "select",
      label: "是否中奖",
      prop: "status",
      placeholder: "请选择",
      dataSourceKey: "quizInfoStatusOption",
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
    quizInfoStatusOption: quizInfoStatusOption
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
        label: "开始区块",
        prop: "startBlockNumber"
      },
      {
        label: "截止区块",
        prop: "endBlockNumber",
        slot: "endBlockNumberScope"
      },
      {
        label: "开奖区块hash",
        prop: "blockHash"
      },
      {
        label: "开奖状态",
        prop: "status",
        slot: "statusScope"
      },
      {
        label: "参与人数",
        prop: "quizPersonCount"
      },
      {
        label: "开始结果",
        prop: "lotteryResult"
      },
      {
        label: "操作",
        fixed: "right",
        slot: "operation",
        width: "200px"
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
const guessDialog = row => {
  const guessNum = ref(row.quizNumber);
  const guessHx = ref("");
  ElMessageBox({
    title: "确认开奖",
    message: () =>
      h("div", [
        // 开奖期数
        h("div", { style: "margin: 12px 0;" }, [
          h("div", { style: "margin-bottom: 6px;" }, "开奖期数："),
          h(ElInput, {
            modelValue: guessNum.value,
            "onUpdate:modelValue": (val: string) => {
              guessNum.value = val;
            },
            placeholder: "请输入开奖期数",
            clearable: true
          })
        ]),

        // 哈希值
        h("div", { style: "margin: 12px 0;" }, [
          h("div", { style: "margin-bottom: 6px;" }, "哈希值："),
          h(ElInput, {
            modelValue: guessHx.value,
            "onUpdate:modelValue": (val: string) => {
              guessHx.value = val;
            },
            placeholder: "请输入哈希值",
            clearable: true
          })
        ])
      ]),

    confirmButtonText: "确认开奖",
    cancelButtonText: "取消",
    type: "warning",
    showCancelButton: true,
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        if (!guessNum.value) {
          ElMessage.warning("请输入开奖期数");
          return;
        }
        if (!guessHx.value) {
          ElMessage.warning("请输入哈希值");
          return;
        }
        try {
          instance.confirmButtonLoading = true;
          const res = await callContractMethod(
            contractAddress.guessingContract,
            guessingAbi.abi,
            "manuaLottery",
            [guessNum.value, guessHx.value],
            true
          );
          ElMessage.success("开奖成功");
          await _loadData();
          done();
        } catch (err: any) {
          console.error("guess error:", err);
          ElMessage.error(err?.message || "请求失败");
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    }
  });
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
const handleLinkClick = row => {
  const url = `https://bscscan.com/block/${row.endBlockNumber}`;
  window.open(url, "_blank"); // 新标签页打开
};
onMounted(() => {
  _loadData();
});
</script>

<template>
  <el-card :shadow="'never'">
    <form-search
      :show="pageData.searchState"
      :form-field="pageData.searchField"
      :data-source="pageData.dataSource"
      @search-form="_updateSearchFormData"
      @search="_searchForm"
      @reset="_resetSearchForm"
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
      <template #endBlockNumberScope="scope">
        <a
          href="javascript:void(0);"
          style="color: #409eff; cursor: pointer"
          @click="handleLinkClick(scope.row)"
        >
          {{ scope.row[scope.column.property] }}
        </a>
      </template>
      <template #statusScope="scope">
        <span>{{
          quizInfoStatusMapConvert(scope.row[scope.column.property])
        }}</span>
      </template>

      <template #operation="{ row }">
        <el-link v-if="row.status == 0" type="primary" @click="guessDialog(row)"
          >开奖</el-link
        >
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
