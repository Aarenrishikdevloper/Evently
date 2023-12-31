import React from "react";
import {IEvent} from "@/lib/database/models/event.model";
import Card from "@/components/shared/Card";
import Pagination from "@/components/shared/Pagination";
type Collectionprops ={
    data:IEvent[],
    emptyTitle:string,
    emptyStateSubtext:string
    limit:number,
    page:number | string,
    totalPages?:number,
    urlparamname?:string,
    collectionType?:"Event_Organizer" | "My_Ticket" | "All_Events"
}
const Collection = ({data, emptyTitle, limit, page, totalPages = 0, urlparamname, collectionType, emptyStateSubtext}:Collectionprops) => {

 console.log(data);
  return (
    <>
        {data.length > 0 ?(
            <div className='flex flex-col items-center gap-10'>
                <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {data.map((event)=> {
                       const hasorderedlink = collectionType === 'Event_Organizer';
                       const hideprice = collectionType  === "My_Ticket";
                       return(
                           <li key={event._id} className="flex justify-center">
                               <Card event={event} hasorderlink={hasorderedlink} hideprice={hideprice}/>
                           </li>
                       )
                    })}

                </ul>
                {totalPages > 1 &&(
                   <Pagination page={page} totalPages={totalPages} uriParamName={urlparamname}/>
                )}
            </div>
        ):(
            <div className= "flex-center wrapper min-h-[200px] w-full flex-col  gap-3 rounded-[14px] bg-gray-50 py-28 text-center ">

                <h3 className={"p-bold-20 md:h5-bold"}>
                    {emptyTitle}
                </h3>
                <p className={"p-regular-14"}>{emptyStateSubtext}</p>

            </div>
        )}
    </>
  );
};

export default Collection;