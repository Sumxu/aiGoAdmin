<script setup lang="ts">
import { reactive, ref, onMounted, h, nextTick } from "vue";
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import * as $userApi from "@/api/member/pledge";
import message from "@/utils/message";
import { formatAddress, formatDate, fromWei } from "@/utils/wallet";
import { levelOptions, userLevelOptions, userTypeMap, pledgeOptions, pidOptions, pledgeTypeOptions, pledgeTabOptions } from "@/constants/constants";
import { userlevelConvert, pledgeConvert, pidScopeConvert, userTypeConvert } from "@/constants/convert";
import { ElMessageBox, ElSelect, ElOption, ElTable } from "element-plus";
import { saveExcelFile } from "@/utils/file";
import StatusTabs from "@/components/opts/status-tabs.vue";

import { any } from "vue-types";
const pageData: any = reactive({
  searchState: true,
  tabIndex: "0",//0查询全部 1未赎回
  searchForm: {},
  dateTime: "2025-12-19",
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
      label: "日期范围",
      prop: "dates",
      placeholder: "请输入日期范围",
      startPlaceholder: "请输入开始日期范围",
      endPlaceholder: "请输入结束日期范围",
    },
    {
      type: "select",
      label: "天数",
      prop: "pid",
      placeholder: "请选择天数",
      dataSourceKey: "pidOptions",
      options: {
        filterable: true,
        keys: {
          prop: "value",
          value: "value",
          label: "label"
        }
      }
    }, {
      type: "select",
      label: "状态",
      prop: "status",
      placeholder: "请选择状态",
      dataSourceKey: "pledgeOptions",
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
      type: "radio",
      label: "类型",
      prop: "queryType",
      default: 1,
      dataSourceKey: "pledgeTypeOptions",
      options: {
        filterable: true,
        keys: {
          prop: "prop",
          value: "value",
          label: "label"
        }
      }
    }
  ],
  dataSource: {
    pledgeOptions: pledgeOptions,
    levelOptions: levelOptions,
    pidOptions: pidOptions,
    pledgeTypeOptions: pledgeTypeOptions,
    pledgeTabOptions: pledgeTabOptions
  },
  permission: {
    query: ["defi:user:page"]
  },
  btnOpts: {
    size: "small",
    leftBtns: [
      { key: "promotion", label: "导出报表", icon: "ep:promotion", state: true },
    ],
    rightBtns: [
      { key: "search", label: "查询", icon: "ep:search", state: true },
      { key: "refresh", label: "刷新", icon: "ep:refresh", state: true }
    ]
  },
  info: [],
  totalInfo: {},
  tableParams: {
    columns: [
      {
        label: "钱包地址",
        prop: "address",
        width: "370px"
      },
      {
        label: "编号",
        prop: "indexNo",
      },
      {
        label: "状态",
        prop: "status",
        slot: "statusScope"
      },
      { label: "数量", prop: "amount", slot: "amountSlot" },
      {
        label: "天数",
        prop: "pid",
        slot: "pidScope"
      },
      { label: "赎回时间", prop: "redeemTime" },
      { label: "创建时间", prop: "createTime" },
      { label: "结束时间", prop: "endTime" },
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
  _loadInfo();
};
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
const timeClick = () => {
  $userApi
    .queryTotal({
      date: pageData.dateTime
    })
    .then((res: any) => {
      if (res.code === 200) {
        pageData.tableParams.totalInfo = res.data;
      } else {
        message.warning(res.msg);
      }
    })
    .finally(() => (pageData.tableParams.loading = false));
}
 
//查询统计数据
const _loadInfo = () => {
  $userApi
    .queryInfo()
    .then((res: any) => {
      if (res.code === 200) {
        pageData.tableParams.info = res.data;
      } else {
        message.warning(res.msg);
      }
    })
    .finally(() => (pageData.tableParams.loading = false));
}
const _loadEndInfo = () => {
  $userApi
    .queryInfo()
    .then((res: any) => {
      if (res.code === 200) {
        pageData.tableParams.info = res.data;
      } else {
        message.warning(res.msg);
      }
    })
    .finally(() => (pageData.tableParams.loading = false));
}
// 重置
const _resetSearchForm = (data?) => (pageData.searchForm = data);

// 获取分页参数
const getQueryParams = () => ({
  ...pageData.searchForm,
  current: pageData.tableParams.pagination.currentPage,
  size: pageData.tableParams.pagination.pageSize
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
const _loadEndData = (page?: number) => {
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
  _loadInfo()
};

const handleChangeCurrentPage = (val: any) => {
  pageData.tableParams.pagination.currentPage = val;
  _loadData();
  _loadInfo()
};
//导出报表
const deriveXlsx = async () => {
  const query = getQueryParams();
  const res = await $userApi.exportXlsx(query)
  if (res.success) {
    saveExcelFile(res.data, "质押投入记录");
  }
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
    case "promotion":
      deriveXlsx();
      break;
  }
};
onMounted(() => {
  nextTick(() => {
    _loadData()
    _loadInfo()
    const dateTime = getCurrentDate();
    pageData.dateTime = dateTime
    timeClick()
  })
});
</script>

<template>
  <div>
    <h3>投入统计</h3>
    <el-space wrap v-if="pageData.tableParams.totalInfo?.totalAmount">
      <el-card class="box-card" style="width: 320px;margin: 12px 0;">
        <template #header>
          <div class="card-header">
            <span>投入总额</span>
          </div>
        </template>
        <div class="text item">
          <span>{{ fromWei(pageData.tableParams.totalInfo.totalAmount) }}</span>
        </div>
      </el-card>
      <el-card class="box-card" style="width: 320px;margin: 12px 0;">
        <template #header>
          <div class="card-header">
            <span>1天投入</span>
          </div>
        </template>
        <div class="text item">
          <span>{{ fromWei(pageData.tableParams.totalInfo.oneDayAmount) }}</span>
        </div>
      </el-card>
      <el-card class="box-card" style="width: 320px;margin: 12px 0;">
        <template #header>
          <div class="card-header">
            <span>15天投入</span>
          </div>
        </template>
        <div class="text item">
          <span>{{ fromWei(pageData.tableParams.totalInfo.fifteenDayAmount) }}</span>
        </div>
      </el-card>
      <el-card class="box-card" style="width: 320px;margin: 12px 0;">
        <template #header>
          <div class="card-header">
            <span>30天投入</span>
          </div>
        </template>
        <div class="text item">
          <span>{{ fromWei(pageData.tableParams.totalInfo.thirtyDayAmount) }}</span>
        </div>
      </el-card>
    </el-space>
    <div>
      <el-date-picker format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-model="pageData.dateTime" type="datetime"
        placeholder="查询时间" />
      <el-button type="primary" style="margin-left: 12px" @click="timeClick">查询</el-button>
    </div>
    <h3 style="margin-top: 24px;">近7天赎回</h3>
    <el-space wrap>
      <el-card class="box-card" style="width: 320px;margin: 12px 0;" v-for="(item, index) in pageData.tableParams.info"
        :key="index">
        <template #header>
          <div class="card-header">
            <span>{{ item.redeemDate }}</span>
          </div>
        </template>
        <div class="text item">
          <span>可赎回数量:{{ fromWei(item.totalAmount) }}</span>
        </div>
      </el-card>
    </el-space>
    <form-search :show="pageData.searchState" :form-field="pageData.searchField" :data-source="pageData.dataSource"
      @search-form="_updateSearchFormData" @search="_searchForm" @reset="_resetSearchForm" />
    <table-buttons :size="pageData.btnOpts.size" :left-btns="pageData.btnOpts.leftBtns"
      :right-btns="pageData.btnOpts.rightBtns" @click="btnClickHandle" />

    <pure-table :data="pageData.tableParams.list" :columns="pageData.tableParams.columns" row-key="address" border
      stripe :loading="pageData.tableParams.loading" :pagination="pageData.tableParams.pagination"
      @page-current-change="handleChangeCurrentPage" @page-size-change="handleChangePageSize">
      <template #statusScope="scope">
        <span>{{ pledgeConvert(scope.row[scope.column.property]) }}</span>
      </template>

      <template #pidScope="scope">
        <span>{{ pidScopeConvert(scope.row[scope.column.property]) }}</span>
      </template>
      <template #amountSlot="scope">
        <span>{{ fromWei(scope.row[scope.column.property]) }}</span>
      </template>
    </pure-table>
  </div>
</template>
