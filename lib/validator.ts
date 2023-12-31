import * as z from "zod";

export const evevtFormschema = z.object({
    title:z.string().min(3,"title must be at least 3 characters"),
    description:z.string().min(3,"Description must be at least 3 characters").max(1000, "description must be about 400 chracters"),
    location:z.string().min(3,"Location must be at least 3 characters").max(400, "location must be about 400 chracters"),
    imageUrl: z.string(),
    startDateTime:z.date(),
    endDateTime: z.date(),
    categoryId:z.string(),
    price:z.string(),
    isFree:z.boolean(),
    url:z.string().url(),
})