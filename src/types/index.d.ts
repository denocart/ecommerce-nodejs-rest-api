import {Request} from 'express';
declare global {
  namespace Express {
    interface Request {
      user: any
    }
  }
}
namespace Denocart {
  export interface IadminUser {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    phoneCode:string;
    password: string;
    role: [String];
    active: boolean;
    refreshToken: string;
    createAt: Date;
    updateAt: Date;
  }
  export interface IGetUserAuthInfoRequest extends Request {
    user: any // or any other type
    updateRole: any
  }
}

