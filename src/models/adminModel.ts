import mongoose, { Schema, Document } from "mongoose";

export enum RoleEnum {
    admin,
    superadmin
  }

export interface IAdmin extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: [String];
  active: boolean;
  refreshtoken: string;
  createAt: Date;
  updateAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, default:'' },
    lastName: { type: String, required: true,default:'' },
    email: { type: String, required: true, unique: true , default:''},
    phone:{type: String, required:true, unique:true, default:''},
    password: { type: String, required: true , default:''},
    role: { type: [String], required: true, default:'',  enum:RoleEnum },
    active: { type: Boolean, required: true ,default:true},
    refreshtoken: { type: String, required: true, default:'' }
  },
  { timestamps: true }
);

// Export the model and return your IUser interface
export default mongoose.model<IAdmin>("Admins", AdminSchema);
