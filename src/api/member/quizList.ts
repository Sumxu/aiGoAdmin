import { type Result, post} from "../base";

/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function queryPage<T>(data?: any): Promise<Result<T>> {
  return post("/quiz/page", data);
}


/**
 * 统计查询
 * @param query .
 * @returns .
 */
export function queryTotal<T>(data?: any): Promise<Result<T>> {
  return post("/quiz/total", data);
}