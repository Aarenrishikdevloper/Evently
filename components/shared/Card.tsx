import { IEvent } from "@/lib/database/models/event.model";
import React from "react";
import Link from "next/link";
import {formatDateTime} from "@/lib/utils";
import {auth} from "@clerk/nextjs";
import Image from "next/image";
import Alertdelete from "@/components/shared/Alertdelete";

type cardprops={
    event:IEvent,
    hasorderlink?:boolean,
    hideprice?:boolean
}
const Card = ({ event, hasorderlink, hideprice }:cardprops) => {
    const {sessionClaims} = auth();
    const userId = sessionClaims?.userId as string;
    const isEventcreator  = userId === event.organizer._id as string

  return (
    <div className=" group relative flex  min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
        <Link href={`/events/${event._id}`} style={{backgroundImage:`url(${event.imageUrl})`}} className={"flex-center flex-grow bg-gray-50 bg-cover bg-center text-gray-500"}/>
        {isEventcreator && !hideprice &&(
            <div className={'absolute right-2 top-2 flex  flex-col gap-4 rounded-xl  bg-white p-3 shadow-sm  transition-all cursor-pointer'}>
               <Link href={`events/${event._id}/update`}>
                   <Image src={"/assets/icons/edit.svg"} alt={'icon'} width={20} height={20}/>
               </Link>
                <Alertdelete eventId={event._id}/>
            </div>
        )}
           <div className={"flex min-h-[230px] flex-col gap-3 p-5 ms:gap-4"}>
               {!hideprice &&(
                   <div className={'flex gap-4'}>
                       <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
                           {event.isFree ?"FREE":`$${event.price}`}

                       </span>
                       <p className={'p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-grey-500 line-clamp-1'}>{event.category.name}</p>
                   </div>
               )}
               <p className={'p-medium-14 md:p-medium-16 text-neutral-600'}>{formatDateTime(event.startDateTime).dateTime}</p>
               <Link href={`/events/${event._id}`}>
                   <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black  ">{event.title}</p>


               </Link>
               <div className="flex-between w-full">
                   <p className={"p-medium-14 md:p-medium-16 text-gray-600"}>{event.organizer.firstName} {event.organizer.lastName}</p>
                   {hasorderlink &&(
                       <Link href={`/order?eventId=${event._id}`} className={'flex gap-2'}>
                           <p className={"text-primary-500"}> OrderDetails</p>
                           <Image src={"/assets/icons/arrow.svg"} alt={"icon"} width={10} height={10}/>
                       </Link>
                   )}
               </div>
           </div>


    </div>
  );
};

export default Card;