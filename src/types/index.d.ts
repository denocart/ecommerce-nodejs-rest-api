import { Request } from "express";

namespace Denocart {
  export interface IadminUser {
    id:string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    phoneCode: string;
    password: string;
    role: [String];
    active: boolean;
    refreshToken: string;
    createAt: Date;
    updateAt: Date;
  }
  export interface IGetUserAuthInfoRequest extends Request {
    user: any; // or any other type
    updateRole: any;
  }
}

declare namespace Express {
  export interface Request {
    user: IadminUser; 
  }
}