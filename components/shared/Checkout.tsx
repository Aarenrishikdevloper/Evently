import React, {useEffect} from "react";
import {IEvent} from "@/lib/database/models/event.model";
import {Button} from "@/components/ui/button";

import { loadStripe } from '@stripe/stripe-js';
import {checkoutorder} from "@/lib/actions/order.action";
loadStripe(
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !
);
const Checkout = ({userId, event}:{event:IEvent, userId:string}) => {
    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            console.log('Order placed! You will receive an email confirmation.');
        }

        if (query.get('canceled')) {
            console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
    }, []);
    const oncheckout= async()=>{
        const order = {
            eventTitle:event.title,
            eventId:event._id,
            price:event.price,
            isFree:event.isFree,
            buyerId:userId
        }
        await checkoutorder(order);

        console.log("Checkout")
    }
  return (

      <form action={oncheckout} method="post">
          <Button type={"submit"} role={"link"} size={"lg"} className="button sm:w-fit">
              {event.isFree ?"Get Ticket":'Buy Ticket'}
          </Button>
      </form>
  );
};

export default Checkout;