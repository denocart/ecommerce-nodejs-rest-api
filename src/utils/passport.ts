//import npm package
const
JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt  = require('passport-jwt').ExtractJwt;

//import function
import * as config from './config';

var opts:any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey    = config.secretOrKey;

// //import model
// import Login from '../models/loginModel';
import Admin from "../models/adminModel";

export const adminAuth = (passport:any) => {
  passport.use("admin",
    new JwtStrategy(opts, async function(jwt_payload:any, done:any) {
     await Admin.findById(jwt_payload.id,function(error,user){
        if(error){ return done(error, false) }
        else if(user){  
        let data = {
          id    : user._id,
          role  : user.role,
          email : user.email,
          phone : user.phone,
        }
          return done(null, data);
        }
        return done(null, false)
      })
    })
  )
}

// export const usersAuth = (passport) => {
//   passport.use("usersAuth",
//     new JwtStrategy(opts, async function(jwt_payload, done) {
//       console.log(jwt_payload)
//       Login.findById(jwt_payload.id,function(error,user){
//         if(error){ return done(error, false) }
//         else if(user){  
//           console.log(user)
//         let data = {
//           id    : user._id,
//           role  : user.role,
//           email : user.email,
//           phone : user.phone,
//         }
//           return done(null, data);
//         }
//         return done(null, false)
//       })
//     })
//   )
// }