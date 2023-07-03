export interface ResponseMessage<D> {
  code: number;
  message: string;
  data?: D;
}
