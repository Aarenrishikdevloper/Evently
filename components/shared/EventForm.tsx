"use client"
import React, {useState} from 'react';
import {IEvent} from "@/lib/database/models/event.model";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button"
import {useUploadThing} from "@/lib/uploadthing";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import {evevtFormschema} from "@/lib/validator";
import {eventDefaultValues} from "@/constants";
import DropdownMenu from "@/components/shared/DropdownMenu";
import {Fileuploder} from "@/components/shared/Fileuploader";
import Image from "next/image";

import {Checkbox} from "@/components/ui/checkbox";
import {createEvent, updateEvent} from "@/lib/actions/event.action";
import {useRouter} from "next/navigation";
import {handleError} from "@/lib/utils";

type EventFormProps ={
    userId:string,
    type: "Create" | "Update"
    event?:IEvent,
    eventId?:string
}
const EventForm = ({userId, type, event, eventId}:EventFormProps) => {
    const[files, setfiles] = useState<File[]>([])
    const intialvalues = event && type==="Update"?{...event, startDateTime:new Date(event.startDateTime), endDateTime:new Date(event.endDateTime)}:eventDefaultValues;
    const router = useRouter();
  const form = useForm<z.infer<typeof evevtFormschema>>({
      resolver:zodResolver(evevtFormschema),
      defaultValues:intialvalues
  });
    const{startUpload} = useUploadThing('imageUploader');
    async function  onSubmit(values:z.infer<typeof evevtFormschema>) {
        let uploadedImageUrl = values.imageUrl;
        if(files.length > 0) {
            const uploadedImage = await startUpload(files);
            if (!uploadedImage) {
                return
            }
            uploadedImageUrl = uploadedImage[0].url;
        }
            if(type === 'Create'){
                try{
                    const newEvent = await createEvent(
                        {event:{...values, imageUrl:uploadedImageUrl,},userId,
                            path:'/profile'},

                    )
                    if(newEvent){
                        form.reset();
                        router.push(`/events/${newEvent._id}`)
                    }
                }catch(error){
                    console.log(error)
                }
            }
            if(type === "Update"){
                if(!eventId){
                    router.back();
                }
                try {
                    // @ts-ignore
                    const updateevent = await updateEvent({
                        userId,
                        event:{...values, imageUrl:uploadedImageUrl,_id:eventId as string}, evenId:eventId as string,
                        path:`/events/${event?._id}`
                    });
                    console.log(updateevent);
                    if(updateevent){
                        form.reset();
                        router.push(`/events/${updateevent._id}`);
                    }
                }catch (e) {
                   handleError(e);
                }
            }


    }

    return (
       <Form {...form}>
           <form  className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
               <div className="flex flex-col gap-5 md:flex-row">
                 <FormField control={form.control} render={({field})=>(
                     <FormItem className={'w-full'}>
                         <FormControl>
                             <Input placeholder={"Event Title"} {...field} className={'input-field'} />
                         </FormControl>
                         <FormMessage/>
                     </FormItem>
                 )} name={"title"}/>
                   <FormField control={form.control} render={({field})=>(
                       <FormItem className={'w-full'}>
                           <FormControl>
                              <DropdownMenu onChangeHandler={field.onChange} value={field.value}/>
                           </FormControl>
                           <FormMessage/>
                       </FormItem>
                   )} name={"categoryId"}/>




               </div>
               <div className="flex flex-col gap-5 md:flex-row">
                   <FormField control={form.control} render={({field}) => (
                       <FormItem className={'w-full'}>
                           <FormControl className='h-72'>

                               <Textarea placeholder="Description" {...field} className={'textarea rounded-2xl'}/>
                           </FormControl>
                           <FormMessage/>
                       </FormItem>
                   )} name={"description"}/>

                       <FormField control={form.control} render={({field}) => (
                           <FormItem className={'w-full'}>
                               <FormControl className='h-72'>

                                  <Fileuploder onFieldChange={field.onChange} imageUrl={field.value} setFiles={setfiles}  />
                               </FormControl>
                               <FormMessage/>
                           </FormItem>
                       )} name={"imageUrl"}/>


                   </div>

               <div className="flex flex-col gap-5 md:flex-row">
                   <FormField control={form.control} render={({field}) => (
                       <FormItem className={'w-full'}>
                           <FormControl>

                              <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                  <Image src='/assets/icons/location-grey.svg' alt='Location' width={24} height={24} />
                                  <Input placeholder="Event Location or Online" {...field} className='input-field'/>
                              </div>
                           </FormControl>
                           <FormMessage/>
                       </FormItem>
                   )} name={"location"}/>

               </div>
               <div className='flex flex-col gap-5 md:flex-row'>
                   <FormField control={form.control} render={({field}) => (
                       <FormItem className={'w-full'}>
                           <FormControl>

                               <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                   <Image src='/assets/icons/calendar.svg' alt='icon' width={24} height={24} className={"filter-grey"}/>
                                   <p className="ml-3 whitespace-nowrap text-grey-500">Start Date</p>
                                   <DatePicker onChange={(date:Date)=>field.onChange(date)} selected={field.value} showTimeSelect timeInputLabel={"Time"} dateFormat='MM/dd/YYY h:mm aa' wrapperClassName="datePicker"/>


                               </div>
                           </FormControl>
                           <FormMessage/>
                       </FormItem>
                   )} name={"startDateTime"}/>
                   <FormField control={form.control} render={({field}) => (
                       <FormItem className={'w-full'}>
                           <FormControl>

                               <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                   <Image src='/assets/icons/calendar.svg' alt='icon' width={24} height={24} className={"filter-grey"}/>
                                   <p className="ml-3 whitespace-nowrap text-grey-500">End Date</p>
                                   <DatePicker onChange={(date:Date)=>field.onChange(date)} selected={field.value} showTimeSelect timeInputLabel={"Time"} dateFormat='MM/dd/YYY h:mm aa' wrapperClassName="datePicker"/>


                               </div>
                           </FormControl>
                           <FormMessage/>
                       </FormItem>
                   )} name={"endDateTime"}/>


               </div>
               <div className="flex flex-col gap-5 md:flex-row">

                       <FormField control={form.control} render={({field}) => (
                           <FormItem className={'w-full'}>
                               <FormControl>

                                   <div
                                       className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                       <Image src='/assets/icons/dollar.svg' alt='icon' width={24}
                                              height={24}/>
                                       <Input placeholder="Price" {...field}
                                              className='input-field' type="number"/>
                                       <FormField render={({field})=>(
                                           <FormItem>
                                               <FormControl>
                                                   <div className='flex items-center'>
                                                       <label className='whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor={'isfree'}>

                                                           Free Ticket
                                                       </label>
                                                       <Checkbox onCheckedChange={field.onChange} checked={field.value} id={'isfree'} className="mr-2 h-5 w-5 border-2 border-primary-500"/>

                                                   </div>
                                               </FormControl>
                                           </FormItem>
                                       )} name={'isFree'}/>
                                   </div>
                               </FormControl>
                               <FormMessage/>
                           </FormItem>
                       )} name={"price"}/>

                   <FormField control={form.control} render={({field}) => (
                       <FormItem className={'w-full'}>
                           <FormControl>

                               <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                   <Image src='/assets/icons/link.svg' alt='Location' width={24} height={24} />
                                   <Input placeholder="URL" {...field} className='input-field'/>
                               </div>
                           </FormControl>
                           <FormMessage/>
                       </FormItem>
                   )} name={"url"}/>


                   </div>
                  <Button type='submit' size={'lg'} className='button col-span-2 w-full' disabled={form.formState.isSubmitted}>
                      {form.formState.isSubmitted?(
                          "Submitting...."
                      ):`${type} Event`}
                  </Button>
           </form>
       </Form>
);
};

export default EventForm