import { auth } from "@/auth";
import { getChatsByUserId } from "@/db/queries";

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  const chats = await getChatsByUserId({ userId: session.user.id });
  return Response.json(chats);
}
