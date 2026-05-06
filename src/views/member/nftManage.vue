<script setup lang="ts">
import { reactive, ref, onMounted, h } from "vue";
import FormSearch from "@/components/opts/form-search.vue";
import TableButtons from "@/components/opts/btns2.vue";
import { PureTable } from "@pureadmin/table";
import * as $userApi from "@/api/member/nftManage";
import message from "@/utils/message";
import Cookies from "js-cookie";
import { getBalance, toWei } from '@/utils/wallet'
import { toBigInt } from "ethers";
import { formatAddress, formatDate, fromWei, PrivateKeyCallContractMethod } from "@/utils/wallet";
import privateKeyDialog from '@/components/PrivateKeyDialog/index.vue'
import NftAddTextareaDialog from '@/components/NftAddTextareaDialog/index.vue'
import { levelOptions, userLevelOptions, userTypeMap } from "@/constants/constants";
import { userlevelConvert, levelConvert, userTypeConvert } from "@/constants/convert";
import { ElMessageBox, ElSelect, ElOption } from "element-plus";
import { contractAddress } from "@/config/contract";
import nftABi from "@/abi/nftABI.ts";
const privateKeyDialogRef = ref(null)
const nftAddTextareaDialogRef = ref(null)
const pageData: any = reactive({
  searchState: true,
  searchForm: {},
  privateKey: "",
  privateKeyBnb: 0,
  dataSource: {
    levelOptions: levelOptions
  },
  permission: {
    query: ["defi:user:page"]
  },
  btnOpts: {
    size: "small",
    leftBtns: [
      { key: "promotion", label: "添加", icon: "ep:circle-plus-filled", state: true },
      { key: "reward", label: "批量领取", icon: "ep:pointer", state: true, loading: false }
    ],
    rightBtns: [
      { key: "search", label: "查询", icon: "ep:search", state: true },
      { key: "refresh", label: "刷新", icon: "ep:refresh", state: true }
    ]
  },
  tableParams: {
    columns: [
      {
        label: "Address",
        prop: "address",
      },
      {
        label: "NftId",
        prop: "nftId",
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
        pageData.tableParams.list = res.data;
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
    case "promotion":
      openNftAddDialog()
      break;
    case "reward":
      forEachReward()
      break;
  }
};
//批量领取
const forEachReward = async () => {
  const privateKey = Cookies.get('privateKey')
  if (privateKey == undefined) {
    message.warning('私钥不能为空');
    return
  }
  pageData.btnOpts.leftBtns[1].loading = true

  try {
    pageData.btnOpts.leftBtns[1].loading = true
    await PrivateKeyCallContractMethod(privateKey, pageData.tableParams.list, contractAddress.nftContract, nftABi.abi)
    pageData.btnOpts.leftBtns[1].loading = false
    message.success('已全部领取');
  } catch (error) {
    pageData.btnOpts.leftBtns[1].loading = false
  }
}

const openNftAddDialog = () => {
  const privateKey = Cookies.get('privateKey')
  if (privateKey == undefined) {
    message.warning('私钥不能为空');
    return
  }
  nftAddTextareaDialogRef.value.openDialog()
}
const nftAddTextareaDialogChange = () => {
  _loadData()
}
/**
 * 打开添加私钥弹窗
 */
const openPrivateKey = () => {
  privateKeyDialogRef.value.openDialog();
}
const privateKeyChange = (privateWalletAddress) => {
  pageData.privateKey = privateWalletAddress
  if (pageData.privateKey) {
    getWalletBnbBlanceOf()
  }
}
const getWalletBnbBlanceOf = async () => {
  const result = await getBalance(pageData.privateKey)
  pageData.privateKeyBnb = result
}
const delPrivateKey = () => {
  pageData.privateKey = ''
  Cookies.remove('privateKey');
  Cookies.remove('privateKeyAddress');
  pageData.privateKeyBnb = 0
}
const _initPrivateKey = () => {
  pageData.privateKey = Cookies.get('privateKeyAddress')
  if (pageData.privateKey) {
    getWalletBnbBlanceOf()
  }
}
const resetPrivateKey = () => {
  if (pageData.privateKey) {
    getWalletBnbBlanceOf()
  }
}

onMounted(() => {
  _loadData();
  _initPrivateKey();
});
</script>

<template>
  <el-card :shadow="'never'">
    <el-space wrap>
      <el-card class="box-card" style="margin: 12px 0;">
        <template #header>
          <div class="card-header">
            钱包地址:<el-input v-model="pageData.privateKey" style="width: 440px;margin-left: 12px;" disabled clearable
              placeholder="请输入" />
            <el-button type="primary" style="margin-left: 12px;" @click="openPrivateKey">添加私钥</el-button>
            <el-button type="info" style="margin-left: 12px;" @click="resetPrivateKey">刷新BNB余额</el-button>
            <el-button type="danger" @click="delPrivateKey">删除私钥</el-button>
          </div>
        </template>
        <div class="text item">
          <span>BNB数量:{{ fromWei(pageData.privateKeyBnb) }}</span>
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
      <template #slotScope="scope">
        <span>{{ fromWei(scope.row[scope.column.property]) }}</span>
      </template>
    </pure-table>
    <privateKeyDialog ref="privateKeyDialogRef" @change="privateKeyChange"></privateKeyDialog>
    <NftAddTextareaDialog ref="nftAddTextareaDialogRef" @change="nftAddTextareaDialogChange"></NftAddTextareaDialog>
  </el-card>
</template>
