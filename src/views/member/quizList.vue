<script setup lang="ts">
import { reactive, ref, onMounted, h } from "vue";
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import * as $userApi from "@/api/member/quizList";
import message from "@/utils/message";
import StatusTabs from "@/components/opts/status-tabs.vue";
import { formatAddress, formatDate, fromWei } from "@/utils/wallet";
import { betTypeMapConvert, quizStatusMapConvert, quizClaimStatusMapConvert } from "@/constants/convert";
import { betTypeOption, quizClaimStatusOption, quizStatusOption } from "@/constants/constants";
import { ElMessageBox, ElSelect, ElOption } from "element-plus";
const pageData: any = reactive({
  searchState: true,
  searchForm: {},
  claimStatus:"null",
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
      endPlaceholder: "请输入结束日期范围",
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
    quizStatusOption: quizStatusOption,
  },
  permission: {
    query: ["defi:user:page"]
  },
  btnOpts: {
    size: "small",
    leftBtns: [],
    rightBtns: [
      { key: "search", label: "查询", icon: "ep:search", state: true },
      { key: "refresh", label: "刷新", icon: "ep:refresh", state: true }
    ]
  },
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
      },
    ],
    list: [],
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
  claimStatus:pageData.claimStatus
});

// 获取表格数据
const _loadData = (page?: number) => {
  pageData.tableParams.list = []
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

// 分页切换
const handleChangePageSize = (val: any) => {
  pageData.tableParams.pagination.pageSize = val;
  _loadData();
};

const handleChangeCurrentPage = (val: any) => {
  pageData.tableParams.pagination.currentPage = val;
  _loadData();
};
const handleTabClick = (val) => {
  // console.log('val',val)
  pageData.claimStatus = val
  _loadData()
}
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
onMounted(() => _loadData());
</script>

<template>
  <el-card :shadow="'never'">
    <form-search :show="pageData.searchState" :form-field="pageData.searchField" :data-source="pageData.dataSource"
      @search-form="_updateSearchFormData" @search="_searchForm" @reset="_resetSearchForm" />
    <table-buttons :size="pageData.btnOpts.size" :left-btns="pageData.btnOpts.leftBtns"
      :right-btns="pageData.btnOpts.rightBtns" @click="btnClickHandle" />
    <status-tabs  v-model="pageData.claimStatus" :tabs="quizClaimStatusOption" @change="handleTabClick" />
    
      <pure-table :data="pageData.tableParams.list" :columns="pageData.tableParams.columns" row-key="address" border
      stripe :loading="pageData.tableParams.loading" :pagination="pageData.tableParams.pagination"
      @page-current-change="handleChangeCurrentPage" @page-size-change="handleChangePageSize">
      <template #amountScope="scope">
        <span>{{ fromWei(scope.row[scope.column.property]) }}</span>
      </template>
      <template #betTypeScope="scope">
        <span>{{ betTypeMapConvert(scope.row[scope.column.property]) }}</span>
      </template>
      <template #statusScope="scope">
        <span>{{ quizStatusMapConvert(scope.row[scope.column.property]) }}</span>
      </template>
      <template #winningAmountScope="scope">
        <span>{{ fromWei(scope.row[scope.column.property]) }}</span>
      </template>
      <template #claimStatusScope="scope">
        <span>{{ quizClaimStatusMapConvert(scope.row[scope.column.property]) }}</span>
      </template>
    </pure-table>
  </el-card>
</template>
