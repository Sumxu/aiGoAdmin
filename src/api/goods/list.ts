import { type Result, post ,get} from "../base";

export function queryPage<T>(data?: any): Promise<Result<T>> {
  return post("/product/page", data);
}
export function update<T>(data?: any): Promise<Result<T>> {
  return post("/product/info/update", data);
}
export function add<T>(data?: any): Promise<Result<T>> {
  return post("/product/info/add", data);
}

export function addSpec<T>(data?: any): Promise<Result<T>> {
  return post("/product/item/add", data);
}
export function updateSpec<T>(data?: any): Promise<Result<T>> {
  return post("/product/item/update", data);
}

export function merChatList<T>(data?: any): Promise<Result<T>> {
  return get("/member/user/merchant", data);
}
