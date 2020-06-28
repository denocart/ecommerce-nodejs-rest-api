import {Router} from 'express';
import { registerAdmin, adminLogin, getAdminRefreshToken } from '../controllers/adminController';
import { adminRegisterValidation, adminLoginValidation, adminRefreshTokenValidation } from '../validations/adminValidation';

const adminRoute : Router = Router();

adminRoute.post('/register', adminRegisterValidation, registerAdmin );
adminRoute.post('/login', adminLoginValidation, adminLogin );
adminRoute.post('/refreshtoken', adminRefreshTokenValidation, getAdminRefreshToken );

export default adminRoute;