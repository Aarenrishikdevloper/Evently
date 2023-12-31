'use client'
import React, {useEffect, useState} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {ICategory} from "@/lib/database/models/category.model";
import {getAllCategories} from "@/lib/actions/category.action";
import {formUrlQuery, removeKeysFromQuery} from "@/lib/utils";
import {useRouter, useSearchParams} from "next/navigation";
const Category = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams()
  useEffect(()=>{
    const getcategories = async()=>{
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList as ICategory[])
    }
    getcategories()
  },[])
  const OnSelectCategory = (category:string)=>{
      let newurl = '';
      if(category && category !== 'All'){
          newurl = formUrlQuery({
              params: searchParams.toString(),
              key: "category",
              value: category
          })
      }else{
          newurl = removeKeysFromQuery({
              params:searchParams.toString(), keysToRemove:['category'],
          })
      }
      router.push(newurl, {scroll:false})


  }

  return(
      <Select onValueChange={(value:string)=>OnSelectCategory(value)}>
        <SelectTrigger className="select-field">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All" className={'select-item p-regular-14'}>All</SelectItem>
          {categories.map((categorie)=>(
              <SelectItem value={categorie.name} key={categorie._id} className={'select-item p-regular-14'}>{categorie.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

  )
};

export default Category;