import { type Result, post, put, get } from "../base";

/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function queryPage<T>(data?: any): Promise<Result<T>> {
  return post("/deposit/page", data);
}
export function queryInfo<T>(data?: any): Promise<Result<T>> {
  return post("/deposit/redeemTotal", data);
}

export function queryEndPage<T>(data?: any): Promise<Result<T>> {
  return post("/deposit/page/end", data);
}
export function queryTotalEnd<T>(data?: any): Promise<Result<T>> {
  return get("/deposit/totalEnd", data);
}
/**
 * 导出报表
 * @param query .
 * @returns .
 */
export function exportXlsx<T>(data?: any): Promise<Result<T>> {
  return post("/deposit/export", data);
}
/**
 * 导出报表
 * @param query .
 * @returns .
 */
export function queryTotal<T>(data?: any): Promise<Result<T>> {
  return get("/deposit/total", data);
}