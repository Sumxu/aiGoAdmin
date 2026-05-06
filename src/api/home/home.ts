import { type Result, post ,get} from "../base";

export function queryData<T>(query?: any): Promise<Result<T>> {
  return post("/home/queryData", query);
}
export function queryHome<T>(query?: any): Promise<Result<T>> {
  return get("/userRecord/homeStatistics", query);
}
