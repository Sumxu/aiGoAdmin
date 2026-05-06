import { type Result, post, put ,get} from "../base";

/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function queryPage<T>(data?: any): Promise<Result<T>> {
  return post("/nft/list", data);
}
/**
 * 列表添加
 * @param query .
 * @returns .
 */
export function queryAdd<T>(data?: any): Promise<Result<T>> {
  return post("/nft/add", data);
}