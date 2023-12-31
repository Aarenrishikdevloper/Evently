
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Input} from "@/components/ui/input";
import {startTransition, useEffect, useState} from "react";
import {ICategory} from "@/lib/database/models/category.model";
import {createCategory, getAllCategories} from "@/lib/actions/category.action";

type dropdownprops = {
  value?:string
  onChangeHandler?: ()=>void
}
const DropdownMenu = ({value, onChangeHandler }:dropdownprops) => {
   const[newcategory, setnewcategory] = useState('');
   const [categories, setCategories] = useState<ICategory[]>([])
   const handlecategory = ()=>{
     createCategory({categoryName:newcategory.trim()}).then((category)=>{
             setCategories((prevState)=>[...prevState, category])
         }

     )
   }
   useEffect(()=>{
       const getcategories = async()=>{
           const categoryList = await getAllCategories();
           categoryList && setCategories(categoryList as ICategory[])
       }
       getcategories()
   },[])
  return(
      <Select onValueChange={onChangeHandler} defaultValue={value}>
        <SelectTrigger className="select-field">
          <SelectValue placeholder="category" />
        </SelectTrigger>
          <SelectContent>
              {categories.length > 0 && categories.map((category)=>(
                  <SelectItem key={category._id} value={category._id}  className="select-item p-regular-14">
                      {category.name}
                  </SelectItem>
              ))}



          <AlertDialog>
            <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">Add new category</AlertDialogTrigger>

            <AlertDialogContent className= 'bg-white'>
              <AlertDialogHeader>
                <AlertDialogTitle>New Category</AlertDialogTitle>
                <AlertDialogDescription>
                   <Input type={"text"} placeholder={"Category Name"} className="input-field mt-3" onChange={(e)=>setnewcategory(e.target.value)}/>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction  onClick={()=>startTransition(handlecategory)}>Add</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </SelectContent>
      </Select>
  )
};

export default DropdownMenu;