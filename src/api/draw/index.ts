import { type Result, post } from "../base";
export function queryPage<T>(data?: any): Promise<Result<T>> {
  return post("/predictionContest/predictionContestInfoPage", data);
}
