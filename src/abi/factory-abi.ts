export default {
  abi: [
    "function buyFee() view returns (uint)",
    "function sellFee() view returns (uint)",
    "function setFee(uint256 _buyFee,uint256 _sellFee)",
    "function setExcludeAddress(address[] memory _excludeAddress,bool flg)",
    "function poolList(uint index) view returns (uint256 value,uint256,uint256,uint256,uint256,uint8)",
    "function updatePool(uint256 index,uint256 value,uint256 number,uint256 numberPer,uint256 numberQuota,uint8 status)"
  ]
};
