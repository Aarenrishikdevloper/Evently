
import mongoose from "mongoose";
let cached =(global as any). momgoose || {conn:null, promise:null};
export const connectTodatabase = async()=>{
    const MONGO_URI = process.env.MONGO_URI;
    if(cached.conn) return cached.conn;
    if(!MONGO_URI) throw new Error("NONGODB_URI is missing");
    cached.promise = cached.promise || mongoose.connect(MONGO_URI, {dbName:"Eventapp", bufferCommands:false});

    cached.conn =await cached.promise;
    return cached.conn;

}