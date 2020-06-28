import validator from 'validator';
import { VALIDATIONERROR } from '../utils/responseCode';
import lodash from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { Denocart } from '../types';
import isEmpty from './isEmpty';
import logger from '../utils/logger';

export const adminRegisterValidation = (req : Request, res : Response,next: NextFunction)=>{
    let errors:any = {};
    const firstName = req.body.firstName ? req.body.firstName :'';
    const lastName = req.body.lastName ? req.body.lastName :'';
    const email = req.body.email ? req.body.email :'';
    const phone = req.body.phone ? req.body.phone :'';
    const phoneCode = req.body.phoneCode ? req.body.phoneCode :'';
    const password = req.body.password ? req.body.password :'';
    const role = req.body.role ? req.body.role :'';
   
    if(isEmpty(firstName)){
        errors.firstName='firstName field is required'
    }

    if(isEmpty(lastName)){
        errors.lastName='lastName field is required'
    }

    if(isEmpty(email)){
        errors.email='email field is required'
    }
    if(!validator.isEmail(email)){
        errors.email='email field is inValid'
    }
    if(isEmpty(phone)){
        errors.phone='phone field is required'
    }
    if(isEmpty(phoneCode)){
        errors.phoneCode='phoneCode field is required'
    }

    if(isEmpty(password)){
        errors.password='password field is required'
    }

    if(isEmpty(role)){
        errors.role='role field is required'
    }

    if(!lodash.isEmpty(errors)){
        logger.error(errors)
        return res.status(VALIDATIONERROR).json({success:true, message: 'Validation Error', data:errors})
    }else{
        next();
    }
  

}

export const adminLoginValidation = (req : Request, res : Response,next: NextFunction)=>{
    let errors:any = {};

    const email = req.body.email ? req.body.email :'';
    const password = req.body.password ? req.body.password :'';

   


    if(isEmpty(email)){
        errors.email='email field is required'
    }else if(!validator.isEmail(email)){
        errors.email='email field is inValid'
    }
 

    if(isEmpty(password)){
        errors.password='password field is required'
    }


    if(!lodash.isEmpty(errors)){
        logger.error(errors)
        return res.status(VALIDATIONERROR).json({success:true, message: 'Validation Error', data:errors})
    }else{
        next();
    }
  

}

export const adminRefreshTokenValidation = (req : Request, res : Response,next: NextFunction)=>{
    let errors:any = {};

    const refreshToken = req.body.refreshToken ? req.body.refreshToken :'';


    if(isEmpty(refreshToken)){
        errors.refreshToken='refreshToken field is required'
    }


    if(!lodash.isEmpty(errors)){
        logger.error(errors)
        return res.status(VALIDATIONERROR).json({success:true, message: 'Validation Error', data:errors})
    }else{
        next();
    }
  

}