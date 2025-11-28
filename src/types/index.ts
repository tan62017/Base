export type ArrType = Record<string, any>[];
export type ObjType = { [name: string]: any };
export type ResponseType = {
  code: number;
  data: ObjType | ArrType | any;
  msg: string;
  [name: string]: any;
};
