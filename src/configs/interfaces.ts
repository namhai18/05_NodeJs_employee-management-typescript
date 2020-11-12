export interface Restful {
  generateTable(): any;

  findOne(condition: any): any;
  findMany(condition: any): any;

  createOne(data: any, condition: any): any;
  createMany(data: any, condition: any): any;
}

export interface HTTPdata {
  code: number;
  message: string;
  data: any;
}

export interface UserInfo {
  id: number;
  username: string;
  role: string;
}
