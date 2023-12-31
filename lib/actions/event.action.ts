'use server'

import {
    CreateEventParams,
    GetAllEventsParams,
    GetRelatedEventsByCategoryParams,
    DeleteEventParams,
    UpdateEventParams, GetEventsByUserParams
} from "@/types";
import {connectToDatabase} from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Event from "@/lib/database/models/event.model";
import {revalidatePath} from "next/cache";
import Category from "@/lib/database/models/category.model";
import {handleError} from "@/lib/utils";
const getcategoryname = async(name:string)=>{
    return Category.findOne({name:{$regex:name, $options:'i'}});
}
export async function createEvent({userId, event, path}:CreateEventParams){
    await  connectToDatabase();
    const organizer = await User.findById(userId);
    if(!organizer) throw new Error("Organizer not found")
    const newEvent = await Event.create({...event, category:event.categoryId ,organizer:userId});
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newEvent));
}

const populateEvent = (query:any)=>{
    return query
        .populate({path:'organizer', model:User, select:'_id firstName lastName'})
        .populate({path:"category", model:Category, select:"_id name"});

}

export async function getEventById(eventId:string){
    try{
        await connectToDatabase();

        const event = await populateEvent(Event.findById(eventId));
        if(!event) throw new Error("Event not found");
        return JSON.parse(JSON.stringify(event));
    }catch (e) {
        handleError(e);
    }
}
export  async function getAllEvents({query, limit=6, page,category}:GetAllEventsParams){
    try{
        await connectToDatabase();
        console.log(query);
        const titleCondition = query? {title:{$regex:query, $options:'i'}}:{}
        const categorycondition = category?await getcategoryname(category):null;
        const condition ={
            $and:[titleCondition, categorycondition?{category:categorycondition._id}:{}],
        }
        const skipamount = (Number(page) - 1)*limit;
        const eventquery = Event.find(condition).sort({createdAt:'desc'}).limit(limit).skip(skipamount);
        const events = await populateEvent(eventquery);
        const eventsCount = await Event.countDocuments(eventquery);
        if(!events) throw new Error("Event not found");
        return{
            data:JSON.parse(JSON.stringify(events)),
            totalpages: Math.ceil(eventsCount/limit),

        }
    }catch (e) {
        handleError(e);
    }
}
export async function getrelatedEvents({categoryId,eventId, limit=3, page=1  }:GetRelatedEventsByCategoryParams){
     try{
         await connectToDatabase();
         const skipamount = (Number(page) - 1)*limit
         const condition = {
             $and: [{category:categoryId},{_id:{$ne:eventId}}]
         };
         const query = Event.find(condition).sort({createdAt:'desc'}).skip(skipamount).limit(limit);
         const events = await populateEvent(query);
         const eventCount = await Event.countDocuments(condition);
         return{
             data:JSON.parse(JSON.stringify(events)), totalpages:Math.ceil(eventCount/limit)
         }

     }catch (e) {
         handleError(e)
     }


}
export async function deleteEvent({eventId,path}:DeleteEventParams){
    try{
      await connectToDatabase();
      const deleteevent = await Event.findByIdAndDelete(eventId);
      if(deleteevent) revalidatePath(path);

    }catch (e) {
        handleError(e);
    }
}

export async function updateEvent({userId, event, path,evenId}:UpdateEventParams){
    try{
        await connectToDatabase();
        const eventToupdate = await Event.findById(evenId);
        console.log(eventToupdate);
        if(!eventToupdate || !userId){
            throw new Error("Unauthorize or event not found");
        }
        const updateevent = await Event.findByIdAndUpdate(evenId, {...event, category:event.categoryId},{new:true})
        revalidatePath(path);
        return JSON.parse(JSON.stringify(updateevent));
    }catch (e) {
         handleError(e);
    }
}
export async function getEventuser({userId, limit=6,page}:GetEventsByUserParams){
    try{
        await connectToDatabase();
        const condition = {organizer:userId}
        const skipAmount = (page-1)*limit
        const eventquery = Event.find(condition).sort({createdAt:'desc'}).skip(skipAmount).limit(limit);
        const event = await populateEvent(eventquery);
        const eventcount = await Event.countDocuments(condition);
        return {data:JSON.parse(JSON.stringify(event)), totalPages: Math.ceil(eventcount)}

    }catch (e) {
        handleError(e);
    }
}