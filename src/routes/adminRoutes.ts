import {Router} from 'express';
import passport from 'passport';
import { registerAdmin, adminLogin, getAdminRefreshToken, getAdminProfile } from '../controllers/adminController';
import { adminRegisterValidation, adminLoginValidation, adminRefreshTokenValidation } from '../validations/adminValidation';

const adminRoute : Router = Router();
const passportAuth =  passport.authenticate("admin", {  session: false });
adminRoute.post('/register', adminRegisterValidation, registerAdmin );
adminRoute.post('/login', adminLoginValidation, adminLogin );
adminRoute.post('/refreshtoken', adminRefreshTokenValidation, getAdminRefreshToken );
adminRoute.get('/admin',passportAuth, getAdminProfile)

export default adminRoute;