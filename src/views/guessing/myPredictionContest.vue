<script setup lang="ts">
import { reactive, ref, onMounted, h } from "vue";
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import * as $userApi from "@/api/guessing/index";
import message from "@/utils/message";
import StatusTabs from "@/components/opts/status-tabs.vue";
import { formatAddress, formatDate, fromWei } from "@/utils/wallet";
import { betTypeOption, quizStatusOption } from "@/constants/constants";
import { quizStatusMapConvert, betTypeMapConvert } from "@/constants/convert";
import { ElMessageBox, ElSelect, ElOption } from "element-plus";
const pageData: any = reactive({
  searchState: true,
  searchForm: {},
  predictionContestType: "null",
  searchField: [
    {
      type: "input",
      label: "钱包地址",
      prop: "address",
      placeholder: "请输入钱包地址"
    },
    {
      type: "input",
      label: "区块编号",
      prop: "blockNumber",
      placeholder: "请输入区块编号"
    },
    {
      type: "select",
      label: "状态",
      prop: "status",
      placeholder: "请选择状态",
      dataSourceKey: "quizStatusOption",
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
    quizStatusOption: quizStatusOption
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
        label: "地址",
        prop: "address",
        width: "370px"
      },
      {
        label: "区块",
        prop: "blockNumber",
        width: "120px"
      },
      {
        label: "参与数量",
        prop: "amount",
        slot: "winningAmountScope",
        width: "120px"
      },
      {
        label: "支付数量",
        prop: "payAmount",
        slot: "winningAmountScope",
        width: "120px"
      },
      {
        label: "用户下单投注",
        prop: "predictionContestType",
        slot: "predictionContestTypeScope",
        width: "120px"
      },
      {
        label: "领取数量",
        prop: "claimAmount",
        slot: "winningAmountScope",
        width: "120px"
      },
      {
        label: "状态",
        prop: "status",
        slot: "statusScope"
      },
      {
        label: "参与时间",
        prop: "createTime",
        width: "180px"
      },
      {
        label: "领取时间",
        prop: "claimTime",
        width: "180px"
      }
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
  predictionContestType: pageData.predictionContestType
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
  // console.log('val',val)
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
onMounted(() => _loadData());
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
    <table-buttons
      :size="pageData.btnOpts.size"
      :left-btns="pageData.btnOpts.leftBtns"
      :right-btns="pageData.btnOpts.rightBtns"
      @click="btnClickHandle"
    />
    <status-tabs
      v-model="pageData.predictionContestType"
      :tabs="betTypeOption"
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
    
      <template #predictionContestTypeScope="scope">
        <span
          >{{  scope.row[scope.column.property]==1?scope.row['betType']==1?'单-':'双-':''}}{{
            betTypeMapConvert(scope.row[scope.column.property])
          }}</span
        >
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
          quizStatusMapConvert(scope.row[scope.column.property])
        }}</span>
      </template>
    </pure-table>
  </el-card>
</template>
