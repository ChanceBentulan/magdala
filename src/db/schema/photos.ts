import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const photos = pgTable("photos", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    imageUrl: text("image_url").notNull(),
    year: integer("year").notNull(),
    userId: integer("user_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});