import { desc, eq } from "drizzle-orm";
import { db } from ".";
import { type Chat, chats } from "./schema";

export async function saveChat({
  id,
  userId,
  messages,
}: Pick<Chat, "id" | "userId"> & { messages: unknown }) {
  try {
    const selectedChats = await db.select().from(chats).where(eq(chats.id, id));

    // If chat already exists, update it with new messages.
    if (selectedChats.length > 0) {
      return await db
        .update(chats)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chats.id, id));
    }

    // If chat doesn't exist, create a new chat.
    return await db.insert(chats).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: Pick<Chat, "id">) {
  try {
    return await db.delete(chats).where(eq(chats.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ userId }: Pick<Chat, "userId">) {
  try {
    return await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: Pick<Chat, "id">) {
  try {
    const [selectedChat] = await db
      .select()
      .from(chats)
      .where(eq(chats.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}
