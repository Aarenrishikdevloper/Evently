
import React from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Collection from "@/components/shared/Collection";
import {auth} from "@clerk/nextjs";
import {getEventuser} from "@/lib/actions/event.action";
import {SearchParamProps} from "@/types";
import {getOrderByuser} from "@/lib/actions/order.action";
import {IOrder} from "@/lib/database/models/order.model";

const Profile = async({searchParams}:SearchParamProps) => {
    const {sessionClaims} =auth();
    const eventpages = Number(searchParams?.eventpages) || 1;
    const userId = sessionClaims?.userId as string;
    const organizesevnt = await getEventuser({userId, page:eventpages })
    const orderspage = Number(searchParams?.orderpages) || 1;
    const order = await getOrderByuser({userId, page: orderspage})
    const orderdata =order?.data.map((order:IOrder)=>order.event) || []
    console.log(userId);
    console.log(organizesevnt);
  return (
      <>
          <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
              <div className={'wrapper flex items-center justify-center sm:justify-between'}>
                  <h3 className="h3-bold text-center sm:text-left"> My Ticket</h3>
                  <Button asChild size='lg' className='button hidden sm:flex'>
                      <Link href={'/#events'}>
                          Explore More Events
                      </Link>

                  </Button>

              </div>
          </section>
          <section className={'wrapper my-8'}>
              <Collection data={orderdata} emptyTitle='No event tickets purchased yet'
                          emptyStateSubtext={"No worries - plenty of exciting events to explore!"}
                          collectionType="My_Ticket" limit={3} page={orderspage} totalPages={order?.totalpages}/>
          </section>
          <section className='bf-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>

              <div className={'wrapper flex items-center justify-center sm:justify-between'}>
                  <h3 className="h3-bold text-center sm:text-left"> Event Organized</h3>
                  <Button asChild size='lg' className='button hidden sm:flex'>
                      <Link href={'/events/create'}>
                          Create New Event
                      </Link>

                  </Button>

              </div>
          </section>
          <section className={'wrapper my-8'}>
              <Collection data={organizesevnt?.data} emptyTitle='No event have been Created'
                          emptyStateSubtext={"Go create some now"}
                          collectionType="Event_Organizer" limit={3} page={eventpages} totalPages={organizesevnt?.totalPages} urlparamname='eventsPage'   />
          </section>


      </>
  );
};

export default Profile;