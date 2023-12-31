'use server'

import {CreateCategoryParams} from "@/types";
import {handleError} from "@/lib/utils";
import {connectToDatabase} from "@/lib/database";
import Category from "@/lib/database/models/category.model";
export const createCategory = async({categoryName}:CreateCategoryParams)=>{
   try{
       await connectToDatabase();
       const newcategory = await Category.create({name:categoryName});
       return JSON.parse(JSON.stringify(newcategory));
   }catch (e) {
       handleError(e)
   }
}
export const getAllCategories = async()=>{
    await connectToDatabase();
    try{
        const categories = await Category.find();
        return JSON.parse(JSON.stringify(categories));
    }catch(e){
        handleError(e)
    }
}