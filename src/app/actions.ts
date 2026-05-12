"use server"

import { db } from "@/db";
import { photos } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createPhoto(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const year = parseInt(formData.get("year") as string);

    await db.insert(photos).values({
        title,
        description,
        imageUrl,
        userId: 1,
        year
    });

    revalidatePath("/");
}