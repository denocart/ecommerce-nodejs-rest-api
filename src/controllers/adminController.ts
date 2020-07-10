//import models
import Admin from "../models/adminModel";
import isEmpty from '../validations/isEmpty';
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { Denocart } from "../types";
import jwt   from 'jsonwebtoken';
import { secretOrKey } from "../utils/config";
//import function
import * as code from '../utils/responseCode';
import logger from "../utils/logger";

//import npm package

export const requestFromAdmin = (req :Request, res:Response, next:NextFunction) =>{
  req.body.requestFrom = 'admin'
  next();
}

/** 
 * Admin Register
 * method : POST
 * url    : /api/admin/register
 * body   : firstName, lastName, phone, email, role, password
*/
export const registerAdmin = async (req : Request,res: Response) => {
  try{
    let reqBody  = req.body;
    let checkDoc = await Admin.findOne({
      "$or":[ 
        { 'phone': reqBody.phone },
        { 'email': reqBody.email } 
      ],
    });
    if(checkDoc){
      if(checkDoc.email == reqBody.email){
        return res.status(code.BAD_REQUEST).json({'success':false, 'message':"validation error",'data':{"email":"email already exist"}})
      }
      else if(checkDoc.phone == reqBody.phone){
        return res.status(code.BAD_REQUEST).json({'success':false, 'message':"validation error", 'data':{"phone":"phone already exist"}})
      }
    }
    let adminDoc = new Admin({
      firstName : reqBody.firstName,
      lastName  : reqBody.lastName,
      phone     : reqBody.phone,
      email     : reqBody.email,
      role      : reqBody.role,
      phoneCode : reqBody.phoneCode
    })
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(reqBody.password, salt);
    adminDoc.password = hash;
    let adminData = await adminDoc.save();
    if(adminData){
      logger.error(adminData)
      return res.status(code.OK).json({'success':true, 'message':"Added successfully"})
    }
    
  }
  catch(error){
      logger.error(error);
    return res.status(code.SERVER_ERROR).json({'success':false, 'message':"Error on server", 'data':{'server':error.toString()}})
  }
}
/** 
 * Admin login
 * method : POST
 * url    : /api/admin/login
 * body   : email, password, fcmId
*/
export const adminLogin = async (req : Request,res: Response) => {
  try{
    let reqBody = req.body;
    let checkDoc = await Admin.findOne({
      email:reqBody.email
    });
    if(!checkDoc){
      return res.status(code.BAD_REQUEST).json({'success':false, 'message':"validation error.", 'data':{"email":"No user found."}})
    }

    let passwordIsValid = bcrypt.compareSync(reqBody.password, checkDoc.password); // true
    if (!passwordIsValid) return res.status(code.UNAUTHORIZED).json({'success': false, 'message': "Invalid password.", 'data':{"password":'Invalid password.'}}); 
    logger.error('doc----',checkDoc)
    const payload = {
      id:checkDoc._id,
      firstName: checkDoc.firstName,
      lastName:checkDoc.lastName,
      email:checkDoc.email,
      phone:checkDoc.phone,
      phoneCode:checkDoc.phoneCode,
      role:checkDoc.role
    }
    let token = jwt.sign(payload, secretOrKey, { expiresIn: '1d'})
    let refreshToken = jwt.sign(payload, secretOrKey, { expiresIn: '30d' })
    checkDoc.refreshToken = refreshToken;
    checkDoc.save();
    return res.status(code.OK).json({'success':true, 'message':"Login success", 'token':'Bearer '+token, refreshToken })
  }
  catch(error){
    logger.error(error)
    return res.status(code.SERVER_ERROR).json({'success':false, 'message':"Error on server", 'data':{'server':error.toString()}})
  }
}


/** 
 * Admin login
 * method : POST
 * url    : /api/admin/login
 * body   : email, password, fcmId
*/
export const getAdminRefreshToken = async (req : Request,res: Response) => {
  try{
    let reqBody = req.body;
    let checkDoc = await Admin.findOne({
      refreshToken:reqBody.refreshToken
    });
    if(!checkDoc){
      return res.status(code.BAD_REQUEST).json({'success':false, 'message':"validation error.", 'data':{"refreshToken":"No refreshToken found."}})
    }

    let refreshTokenIsValid = jwt.verify(reqBody.refreshToken, secretOrKey); // true
    if (!refreshTokenIsValid) return res.status(code.UNAUTHORIZED).json({'success': false, 'message': "Invalid refreshToken.", 'data':{"refreshToken":'Invalid refreshToken or refreshToken may expired.'}}); 
    logger.error('doc----',checkDoc)
    const payload = {
      firstName: checkDoc.firstName,
      lastName:checkDoc.lastName,
      email:checkDoc.email,
      phone:checkDoc.phone,
      phoneCode:checkDoc.phoneCode,
      role:checkDoc.role
    }
    let token = jwt.sign(payload, secretOrKey, { expiresIn: '2m'})
    let refreshToken = jwt.sign(payload, secretOrKey, { expiresIn: '30d' })
    checkDoc.refreshToken = refreshToken;
    checkDoc.save();
    return res.status(code.OK).json({'success':true, 'message':"New token and refreshToken generated success", 'token':'Bearer '+token, refreshToken })
  }
  catch(error){
    logger.error(error)
    return res.status(code.SERVER_ERROR).json({'success':false, 'message':"Error on server", 'data':{'server':error.toString()}})
  }
}


/** 
 * Admin List
 * method : GET
 * url    : /api/admin/adminList
 * query  : paginationQuery
*/
export const listAdmin = async (req :Request, res:Response, next:NextFunction)=>{
  try{
      const reqQuery : any = req.query;
    logger.error(JSON.parse(reqQuery.searchQuery));
    logger.error(JSON.parse(reqQuery.pageQuery));
    const pageQuery = JSON.parse(reqQuery.pageQuery);
    let searchQuery = JSON.parse(reqQuery.searchQuery);
    const search = reqQuery.search ? reqQuery.search :'';
    if(search){

      searchQuery['$text'] =  { $search:search }

    }
    logger.error(searchQuery)
    // logger.error(await Country.listIndexes())
    let totalCount = await Admin.find(searchQuery).countDocuments(),
      datas = await Admin.find(searchQuery).select('firstName lastName phone email role fcmId softDelete')
        .skip(pageQuery.skip)
        .limit(pageQuery.limit);

    return res.status(code.OK).json({
      success: true,
      message: "Fetched successfully",
      data: datas,
      totalCount: totalCount,
      page: pageQuery.page,
    });
   }catch(error){
    console.error(error);
    return res.status(code.SERVER_ERROR).json({'success':false, 'message':"Error on server",'data':{"server":error.toString()}})
  }
}

/**
 * View Profile
 * method : GET
 * url    : /api/admin/viewProfile
 * header : Authorization
*/
export const viewProfile = (req : Denocart.IGetUserAuthInfoRequest,res: Response) => {

  Admin.findById(
    req.user.id,
    {
      'firstName' : 1,
      'lastName'  : 1,
      'phone'     : 1,
      'email'     : 1,
      'role'      : 1
    },
    function(error,data){
    if(error){ return res.status(code.SERVER_ERROR).json({'success':false, 'data':{'server':"Error on server"}})}
    return res.status(code.OK).json({'success':true, 'users':data})
  })
}

/**
 * View Profile
 * method : GET
 * url    : /api/admin/viewProfile/adminId
 * header : Authorization
*/
export const viewProfileById = (req : Request,res: Response) => {
  Admin.findById(
    req.params.adminId,
    {
      'firstName' : 1,
      'lastName'  : 1,
      'phone'     : 1,
      'email'     : 1,
      'role'      : 1
    },
    function(error,data){
    if(error){ return res.status(code.SERVER_ERROR).json({'success':false, 'data':{'server':"Error on server"}})}
    return res.status(code.OK).json({'success':true, 'data':data})
  })
}

/** 
 * Edit Admin
 * method : PUT
 * url    : /api/admin/update (or) /api/admin/profileUpdate
 * body   : adminId, firstName, lastName, phone, email, role 
*/
export const editAdmin = async (req : Denocart.IGetUserAuthInfoRequest,res: Response) => {
  try{
    let reqBody  = req.body;
    let checkDoc = await Admin.findOne({
      "$or":[ 
        { 'phone': reqBody.phone },
        { 'email': reqBody.email } 
      ],
      "_id":{"$ne":reqBody.adminId}
    });
    if(checkDoc){
      if(checkDoc.email == reqBody.email){
        return res.status(code.BAD_REQUEST).json({'success':false, 'message':"validation error",'data':{"email":"email already exist"}})
      }
      else if(checkDoc.phone == reqBody.phone){
        return res.status(code.BAD_REQUEST).json({'success':false, 'message':"validation error", 'data':{"phone":"phone already exist"}})
      }
    }
    let updateDoc :Partial< Denocart.IadminUser> = {
      firstName : reqBody.firstName,
      lastName  : reqBody.lastName,
      phone     : reqBody.phone,
      email     : reqBody.email,
    }
    if(req.updateRole){
      updateDoc['role'] = reqBody.role;
      if(isEmpty(reqBody.role)){
        return res.status(code.BAD_REQUEST).json({'success':false, 'message':"validation error", 'data':{"role":"role field is required"}})
      }
    }
    let adminDoc = await Admin.findByIdAndUpdate(reqBody.adminId,{$set:updateDoc},{"new":true});
    return res.status(code.OK).json({'success':true, 'message':"Updated successfully"})
  }
  catch(error){
    return res.status(code.SERVER_ERROR).json({'success':false, 'message':"Error on server", 'data':{'server':error.toString()}})
  }
}

/*
* method : DELETE
 * url    : /api/admin/country
 * params : adminId
 */
export const resetAdminPassword = async (req : Request, res: Response) => {
  try {
    logger.error(req.body)
    const reqBody = req.body;
    const adminDetails = await Admin.findById(reqBody.adminId);
    if (adminDetails) {
      if(isEmpty(reqBody.password)){
        return res.status(code.BAD_REQUEST).json({'success':false, 'message':"validation error", 'data':{"password":"password field is required"}})
      }
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(reqBody.password, salt);
      reqBody.password = hash;
      Admin.findByIdAndUpdate(
        req.body.adminId,
        reqBody,
        { new: true },
        (error, resDocs) => {
          if (error) {
            return res.status(code.SERVER_ERROR).json({
              success: false,
              message: "Error on server",
              data: { server: error },
            });
          }
          if (!resDocs) {
            return res.status(code.NOT_FOUND).json({
              success: false,
              message: "Admin not found",
              data: { adminId: "Admin not found." },
            });
          }
          return res.status(code.OK).json({
            success: true,
            message: "Soft Deleted successfully",
            data: resDocs,
          });
        }
      );
    }else{
      return res.status(code.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
        data: { adminId: "Admin not found." },
      });
    }
  } catch (error) {
    logger.error(error);
  }
};

/** 
 * Update Role (true)
 * method : POST
 * url    :
*/
export const updateRoleIsTrue = (req : Denocart.IGetUserAuthInfoRequest,res: Response,next : NextFunction) => {
  req.updateRole = true
  return next();
}

/** 
 * Update Role (false)
 * method : POST
 * url    :
*/
export const updateRoleIsFalse = (req : Denocart.IGetUserAuthInfoRequest,res: Response,next: NextFunction) => {
  req.updateRole = false;
  return next();
}


export const getAdminProfile  =async (req :Request, res:Response, next:NextFunction)=>{

  try{
    const {user} = req;
    //@ts-ignore
    const userId = user?.id;
  
    const adminData = await Admin.findById(userId).select('-password')

    if(adminData){
      return res.status(code.OK).json({'success':true, 'message':"Login success", 'isAuthenticated':true, 'data':adminData })
    }else{
      return res.status(code.NOT_FOUND).json({'success':true, 'message':"Login success", 'isAuthenticated':false, 'data':{} })
  
    }
  }catch(error){
    console.log(error)
    return res.status(code.NOT_FOUND).json({'success':true, 'message':"Login success", 'isAuthenticated':false, 'data':{} })
 
  }
}



/**
 * Delete Admin
 * method : DELETE
 * url    : /api/admin/country
 * params : adminId
 */
export const deleteAdmin = async (req : Request, res: Response) => {
  try {
    logger.error(req.params)
    const adminDetails: any = await Admin.findById(req.params.adminId);
    if (adminDetails) {
      let updateData;
      if (adminDetails.softDelete === true) {
        updateData = { softDelete: false };
      } else {
        updateData = { softDelete: true };
      }
      Admin.findByIdAndUpdate(
        req.params.adminId,
        updateData,
        { new: true },
        (error, resDocs) => {
          if (error) {
            return res.status(code.SERVER_ERROR).json({
              success: false,
              message: "Error on server",
              data: { server: error },
            });
          }
          if (!resDocs) {
            return res.status(code.NOT_FOUND).json({
              success: false,
              message: "Admin not found",
              data: { adminId: "Admin not found." },
            });
          }
          return res.status(code.OK).json({
            success: true,
            message: "Soft Deleted successfully",
            data: resDocs,
          });
        }
      );
    }else{
      return res.status(code.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
        data: { adminId: "Admin not found." },
      });
    }
  } catch (error) {
    logger.error(error);
  }
};