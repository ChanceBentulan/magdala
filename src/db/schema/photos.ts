import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const photos = pgTable("photos", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    imageUrl: text("image_url").notNull(),
    year: integer("year").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});