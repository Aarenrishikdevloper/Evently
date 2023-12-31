import React from "react";
import {auth} from "@clerk/nextjs";
import {getEventById} from "@/lib/actions/event.action";
import EventForm from "@/components/shared/EventForm";

type updateEventProps={
    params:{
        id:string
    }
}
const Page = async({params:{id}}:updateEventProps) => {
    const{sessionClaims} = auth();
    const userId = sessionClaims?.userId as string;
    const event = await getEventById(id);
    console.log(event._id);

  return (
   <>
        <section className={'bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'}>
             <h3 className={"wrapper h3-bold text-center sm:text-left"}>Update Event</h3>
        </section>
       <div className={"wrapper my-8"}>
           <EventForm userId={userId} type="Update" eventId={event._id} event={event}/>
       </div>
   </>
  );
};

export default Page;