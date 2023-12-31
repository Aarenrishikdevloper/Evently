'use client'
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import {useRouter, useSearchParams} from "next/navigation";
import {formUrlQuery, removeKeysFromQuery} from "@/lib/utils";

const Search = ({placeholder="Search title"}:{placeholder?:string}) => {
  const [query, setquery] = useState('');
   const router = useRouter();
   const searchParams = useSearchParams()
   useEffect(()=>{
      const delaydebouncefn = setTimeout(()=>{
        let newurl = '';
        if(query){
          newurl = formUrlQuery({
             params:searchParams.toString(),
             key:"query",
            value: query,
          })
        }else{
          newurl = removeKeysFromQuery({
            params:searchParams.toString(), keysToRemove:['query'],
          })
        }
        router.push(newurl, {scroll:false})
      },300)
      return ()=>clearTimeout(delaydebouncefn);

   },[query, searchParams, router]);

  return (
      <div className={"flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2"}>
        <Image src={"/assets/icons/search.svg"} alt={'icon'} width={24} height={24}/>
        <Input type={"text"} placeholder={placeholder} className={"p-regular-16 border-0 bg-gray-50 outline-offset-0 placeholder:text-gray-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"} onChange={(e)=>setquery(e.target.value)}/>
      </div>
  )
};

export default Search;