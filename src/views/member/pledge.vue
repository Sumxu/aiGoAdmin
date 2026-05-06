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
import PledgeTabEnd from '@/views/member/components/pledgeTabEnd/index.vue'
import PledgeTabAll from '@/views/member/components/PledgeTabAll/index.vue'
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
        prop: "indexNo"
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
const handleTabClick = (val) => {
  pageData.tabIndex = val
  if (val1 == "0") {
    _loadData()
  } else {
    _loadEndData()
  }
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
  <el-card :shadow="'never'">
    <status-tabs class="statusTabs" v-model="pageData.tabIndex" :tabs="pledgeTabOptions" @change="handleTabClick" />
    <div v-if="pageData.tabIndex == 0">
      <pledge-tab-all />
    </div>
    <div v-if="pageData.tabIndex == 1">
      <pledge-tab-end />
    </div>
  </el-card>
</template>
<style lang="scss" scoped>
.statusTabs {
  margin-top:0px !important;
}
</style>
