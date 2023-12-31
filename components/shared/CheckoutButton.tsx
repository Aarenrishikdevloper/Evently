'use client'
import React from "react";
import {IEvent} from "@/lib/database/models/event.model";
import {SignedIn, SignedOut, useUser} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";

import Link from "next/link";
import Checkout from "@/components/shared/Checkout";
import {useRouter} from "next/navigation";
const CheckoutButton = ({event}:{event:IEvent}) => {
    const {user} = useUser();
    const userid = user?.publicMetadata.userId as string
    const haseventfinished = new Date(event.endDateTime)< new Date()
    const router = useRouter();
  return (
    <div className="flex items-center gap-3">
        {haseventfinished  && event.organizer._id !== userid ?(
            <p className="p-2 text-red-500">Sorry, tickets are no longer available</p>
        ):(
            <>


                        <SignedOut>
                            <Button asChild className="button rounded-full">
                                <Link  href={"/sign-in"}>
                                    Get Ticket
                                </Link>
                            </Button>
                        </SignedOut>
                        <SignedIn>
                            {event.organizer._id !== userid ?<Checkout event={event} userId={userid}/>: <Button  className="button rounded-full" onClick={()=>router.push(`/events/${event._id}/update`)}>

                                   Edit The Event

                            </Button>}
                        </SignedIn>
                  

            </>
        )}
    </div>
  );
};

export default CheckoutButton;