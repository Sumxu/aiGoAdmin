<script setup lang="ts">
import { reactive, ref, onMounted, h } from "vue";
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import * as $userApi from "@/api/member/user";
import message from "@/utils/message";
import { formatAddress, formatDate, fromWei, callContractMethod, toWei } from "@/utils/wallet";
import { levelOptions, userLevelOptions, userTypeMap, userTypeOptions, amountOptions, userSetLevelOptions } from "@/constants/constants";
import { userlevelConvert, levelConvert, userTypeConvert, } from "@/constants/convert";
import { ElMessageBox, ElSelect, ElOption, ElInput } from "element-plus";
import erc20Abi from "@/abi/erc20-abi";
import { contractAddress } from "@/config/contract";
const pageData: any = reactive({
  searchState: true,
  searchForm: {},
  amountType: "",//派送类型
  amountNumber: "",//派送数量
  searchField: [
    {
      type: "input",
      label: "钱包地址",
      prop: "address",
      placeholder: "请输入钱包地址"
    },
    {
      type: "input",
      label: "上级地址",
      prop: "parentAddress",
      placeholder: "请输入上级地址"
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
      label: "用户等级",
      prop: "level",
      placeholder: "请选择用户等级",
      dataSourceKey: "userLevelOptions",
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
    levelOptions: levelOptions,
    userLevelOptions: userLevelOptions,
    userTypeOptions: userTypeOptions
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
        label: "钱包地址",
        prop: "address",
        width: "370px"
      },
      {
        label: "上级地址",
        prop: "parentAddress",
        width: "370px"
      },
      { label: "直推人数", prop: "directCount", minWidth: "120px" },
      { label: "团队人数", prop: "teamCount", minWidth: "120px" },
      { label: "注册时间", prop: "createTime", width: "180px" },
      
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

// 分页切换
const handleChangePageSize = (val: any) => {
  pageData.tableParams.pagination.pageSize = val;
  _loadData();
};

const handleChangeCurrentPage = (val: any) => {
  pageData.tableParams.pagination.currentPage = val;
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
const handleUpdateLevel = (row: any) => {
  const status = ref<string | number>(row.level);
  const userStatus = ref<string | number>(row.level);
  const address = row.address
  ElMessageBox({
    title: "修改等级",
    message: () =>
      h(
        "div",
        {
          style:
            "width: 300px; display: flex; flex-direction: column; gap: 16px;" // 增加了垂直方向的间距
        },
        [
          // 用户等级选择框
          h(
            "div",
            { style: "display: flex; align-items: center; gap: 8px;" },
            [
              // 左侧标题
              h(
                "span",
                { style: "white-space: nowrap; font-weight: 500;" },
                "用户等级"
              ),
              // 下拉选择框
              h(
                ElSelect,
                {
                  modelValue: userStatus.value,
                  placeholder: "请选择用户等级",
                  "onUpdate:modelValue": (val: any) => {
                    userStatus.value = val;
                  },
                  style: "flex: 1;",
                  clearable: true
                },
                () =>
                  userSetLevelOptions.map(item =>
                    h(ElOption, {
                      key: item.value,
                      label: item.label,
                      value: item.value
                    })
                  )
              )
            ]
          )
        ]
      ),
    showCancelButton: true,
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        try {
          instance.confirmButtonLoading = true;
          const res = await callContractMethod(
            contractAddress.Store_Address,
            erc20Abi.abi,
            "setLevel",
            [address, Number(userStatus.value)],
            true
          )
          if (res) {
            message.success("操作成功");
            await _loadData();
            done();
          } else {
            message.warning(res.msg || "操作失败");
          }
        } catch (err: any) {
          console.error("updateLevel error:", err);
          message.error(err?.message || "请求出错");
        } finally {
          // 确保 loading 状态被关闭
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    }
  });
};
// 商家派送
const handleUpdateJifen = (row: any) => {
  const address = row.address
  const type = ref<string | number>();
  const amount = ref<string | number>();
  ElMessageBox({
    title: "商家派送",
    message: () =>
      h(
        "div",
        {
          style: "width: 300px; display: flex; flex-direction: column; gap: 16px;"
        },
        [
          // === 派送类型 ===
          h(
            "div",
            { style: "display: flex; align-items: center; gap: 8px;" },
            [
              h("span", { style: "white-space: nowrap; font-weight: 500;" }, "派送类型"),
              h(
                ElSelect,
                {
                  modelValue: type.value,
                  placeholder: "请选择派送类型",
                  "onUpdate:modelValue": (val: any) => {
                    type.value = val;
                  },
                  style: "flex: 1;",
                  clearable: true
                },
                () =>
                  amountOptions.map(item =>
                    h(ElOption, {
                      key: item.value,
                      label: item.label,
                      value: item.value
                    })
                  )
              )
            ]
          ),

          // === 派送数量输入框 ===
          h(
            "div",
            { style: "display: flex; align-items: center; gap: 8px;" },
            [
              h("span", { style: "white-space: nowrap; font-weight: 500;" }, "派送数量"),
              h(ElInput, {
                modelValue: amount.value,
                placeholder: "请输入数量",
                style: "flex: 1;",
                onInput: (val: any) => {
                  amount.value = val;
                }
              })
            ]
          )
        ]
      ),
    showCancelButton: true,

    // ============================
    //         校验逻辑
    // ============================
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        // 1. 校验派送类型
        if (!type.value) {
          message.warning("请选择派送类型");
          return;
        }
        // 2. 校验数量
        if (Number(amount.value) <= 0 || isNaN(Number(amount.value))) {
          message.warning("请输入正确的派送数量");
          return;
        }
        try {
          instance.confirmButtonLoading = true;
          // 调用合约
          const res = await callContractMethod(
            contractAddress.Store_Address,
            erc20Abi.abi,
            "giveAmount",
            [address, amount.value, Number(type.value)],
            true
          );
          if (res) {
            message.success("操作成功");
            await _loadData();
            done();
          } else {
            message.warning(res.msg || "操作失败");
          }
        } catch (err: any) {
          message.error(err?.message || "请求出错");
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    }
  });
};
const handleUpdateIsLock = (row: any) => {
  ElMessageBox({
    title: "提示",
    message: `是否${row.isLock ? '解锁' : '上锁'}?`,
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "确认",
    cancelButtonText: "取消",

    // === ⭐ 关键：使用 beforeClose 控制 loading ===
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        instance.confirmButtonLoading = true;  // 开启 loading

        try {
          const res = await callContractMethod(
            contractAddress.Store_Address,
            erc20Abi.abi,
            "multiSetLock",
            [[row.address], !row.isLock],
            true
          );

          if (res) {
            message.success("操作成功");
            await _loadData();
            done(); // 关闭弹窗
          } else {
            message.warning(res.msg || "操作失败");
            instance.confirmButtonLoading = false; // 保持弹窗
          }

        } catch (err: any) {
          message.error(err?.message || "请求出错");
          instance.confirmButtonLoading = false;

        }
      } else {
        done(); // 取消直接关闭
      }
    }
  });
};
onMounted(() => _loadData());
</script>

<template>
  <el-card :shadow="'never'">
    <form-search :show="pageData.searchState" :form-field="pageData.searchField" :data-source="pageData.dataSource"
      @search-form="_updateSearchFormData" @search="_searchForm" @reset="_resetSearchForm" />
    <table-buttons :size="pageData.btnOpts.size" :left-btns="pageData.btnOpts.leftBtns"
      :right-btns="pageData.btnOpts.rightBtns" @click="btnClickHandle" />
    <pure-table :data="pageData.tableParams.list" :columns="pageData.tableParams.columns" row-key="address" border
      stripe :loading="pageData.tableParams.loading" :pagination="pageData.tableParams.pagination"
      @page-current-change="handleChangeCurrentPage" @page-size-change="handleChangePageSize">
    </pure-table>
  </el-card>
</template>
