import * as constants from "./constants";
/**
 * enabled convert
 * @param value .
 * @returns .
 */
export function enableConvert(value: number): string {
  return constants.enableMap[value];
}
export function enabledBooleanConvert(value: number): boolean {
  return constants.enableBooleanMap[value];
}

/**
 *系统配置类型
 * @param value .
 * @returns .
 */
export function configTypeConvert(value: number): string {
  return constants.configTypeMap[value];
}

export function statusConvert(value: number): string {
  return constants.statusMap[value];
}

export function levelConvert(value: number): string {
  return constants.levelMap[value];
}
export function userTypeConvert(value: number): string {
  return constants.userTypeMap[value];
}

export function typeConvert(value:number): string{
  return constants.typeMap[value];
}

export function userlevelConvert(value: number): string {
  return constants.userlevelMap[value];
}

export function miningMachineEarningsConvert(value: number): string {
  return constants.miningMachineEarningsMap[value];
}

export function pledgeConvert(value:number):string{
  return constants.pledgeMap[value];
}
export function pidScopeConvert(value:number):string{
  return constants.pidMap[value];

}
export function coinTypeConvert(value:number):string{
  return constants.coinTypeMap[value];
}
export function bizTypeConvert(value:number):string{
  return constants.bizTypeMap[value];
}
export function orderConvert(value:number):string{
  return constants.orderMap[value];
}
export function payTypeConvert(value:number):string{
  return constants.payTypeMap[value];
}
export function classifyConvert(value:number):string{
  return constants.classifyMap[value];
}

export function betTypeMapConvert(value:number):string{
  return constants.betTypeMap[value];
}
export function quizStatusMapConvert(value:number):string{
  return constants.quizStatusMap[value];
}
export function quizInfoStatusMapConvert(value:number):string{
  return constants.quizInfoStatusMap[value];
}

export function quizClaimStatusMapConvert(value:number):string{
  return constants.quizClaimStatusMap[value];
}

export function erc20IndexMapConvert(value:number):string{
  return constants.erc20IndexMap[value];
}
