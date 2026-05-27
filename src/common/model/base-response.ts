export class BaseResponse<T> {
  data?: T;
}

export class BaseResponsePagination<T> {
  total?: number;
  records?: Array<T>;
}
