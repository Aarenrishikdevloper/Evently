'use client'
import React from "react";
import {Button} from "@/components/ui/button";
import {useRouter, useSearchParams} from "next/navigation";
import {formUrlQuery} from "@/lib/utils";
type paginationprops ={
    page:number | string,
    totalPages:number,
    uriParamName?:string
}

const Pagination = ({page,totalPages, uriParamName}:paginationprops) => {
    const router = useRouter();
    const searchparam = useSearchParams();
    const OnClick = (btn:string)=>{
        const pageValue = btn === 'next'?Number(page)+1:Number(page)-1
        const newurl = formUrlQuery({
            params:searchparam.toString(),
            key:uriParamName||'page',
            value:pageValue.toString()
        })
        router.push(newurl, {scroll:false});
    }
  return (
      <div className={'flex gap-2'}>
          <Button  size={"lg"} variant={'outline'} className='w-28' onClick={()=>OnClick('prev')} disabled={Number(page) <=1}>
              Previous
          </Button>
          <Button  size={"lg"} variant={'outline'} className='w-28' onClick={()=>OnClick('next')} disabled={Number(page) >=totalPages}>
              Next
          </Button>

      </div>
  );
};

export default Pagination;