import mongoose, { Schema, Document } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IAdmin extends Document {
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

const AdminSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, default:'' },
    lastName: { type: String, required: true,default:'' },
    email: { type: String, required: true, unique: true , default:''},
    phone:{type: String, required:true, unique:true, default:''},
    phoneCode:{type: String, required:true, unique:true, default:''},
    password: { type: String, required: true , default:''},
    role: { type: [String], required: true, default:[]},
    active: { type: Boolean ,default:true},
    refreshToken: { type: String, default:'' }
  },
  { timestamps: true }
);

AdminSchema.plugin(mongoosePaginate);
AdminSchema.index({firstName:"text",lastName:"text", phone:"text", email:"text", role:"text"})

// Export the model and return your IUser interface
export default mongoose.model<IAdmin>("Admins", AdminSchema);
