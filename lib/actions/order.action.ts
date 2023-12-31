'use server'

import {CheckoutOrderParams, CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams} from "@/types";
import Stripe from 'stripe'
import {metadata} from "@/app/layout";
import {redirect} from "next/navigation";
import {handleError} from "@/lib/utils";
import {connectToDatabase} from "@/lib/database";
import Order from "@/lib/database/models/order.model";
import User from "@/lib/database/models/user.model";
import Event from "@/lib/database/models/event.model";
import {ObjectId} from "mongodb";

export const checkoutorder = async(order:CheckoutOrderParams)=>{
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const price = order.isFree?0:Number(order.price)*100
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data:{
                        currency:"usd",
                        unit_amount:price,
                        product_data:{
                            name:order.eventTitle
                        }
                    },
                    quantity:1
                },

            ],
            metadata:{
                eventId:order.eventId,
                buyerId:order.buyerId,
            },
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
        });

       redirect(session.url!)
    }catch (e) {
        throw e;
    }
}
export const createOrder = async(order:CreateOrderParams)=>{
    try {
        await connectToDatabase();
        const neworder = await Order.create({...order, event:order.eventId, buyer:order.buyerId});
        return JSON.parse(JSON.stringify(neworder));
    }catch (e) {
        handleError(e);
    }
}
export async function getOrderByuser({userId, limit=3, page}:GetOrdersByUserParams){
    try {
        const skipamount = (Number(page) -1)*limit;
        const condition = {buyer:userId}
        const orders  = await Order.distinct('event._id')
            .find(condition)
            .sort({"createdAt":"desc"})
            .limit(limit)
            .populate({path:'event', model:Event,populate:{path:"organizer", model:User, select:"_id firstName lastName"}})
        const orderscount = await Order.distinct('event._id').countDocuments(condition)
        return {data:JSON.parse(JSON.stringify(orders)), totalpages:Math.ceil(orderscount/limit)}
    }catch (e) {
        handleError(e);
    }
}
export async function getordersbyevents({searchString, eventId}:GetOrdersByEventParams){
    try {
        await connectToDatabase();
        if(!eventId){
            throw new Error("Event Id Missing")
        }
        const eventObjectId = new ObjectId(eventId);
        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'buyer',
                    foreignField: '_id',
                    as: 'buyer',
                },
            },
            {
                $unwind: '$buyer',
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'event',
                    foreignField: '_id',
                    as: 'event',
                },
            },
            {
                $unwind: '$event',
            },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    createdAt: 1,
                    eventTitle: '$event.title',
                    eventId: '$event._id',
                    buyer: {
                        $concat: ['$buyer.firstName', ' ', '$buyer.lastName'],
                    },
                },
            },
            {
                $match: {
                    $and: [{ eventId: eventObjectId }, { buyer: { $regex: RegExp(searchString, 'i') } }],
                },
            },
        ])
        return JSON.parse(JSON.stringify(orders));
    }catch (e) {
        handleError(e);
    }
}