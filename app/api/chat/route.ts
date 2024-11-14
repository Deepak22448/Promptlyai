import { convertToCoreMessages, Message, streamText } from "ai";
import { geminiFlashModel } from "@/ai/index";
import { auth } from "@/auth";
import { deleteChatById, getChatById, saveChat } from "@/db/queries";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();
  const session = await auth();

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0
  );

  const result = await streamText({
    model: geminiFlashModel,
    messages: coreMessages,
    temperature: 0.5,
    system: `\n
        - You're Promplty, your personal assistant to help with a range of tasks, like answering questions, providing food receipes, providing recommendations, assisting with [ provide straightforward answers to save you time or planning], and even just chatting!
        - When asking for a specific food recipe, please ask for the recipe by name, e.g. "Can you provide me with a recipe for spaghetti bolognese?" and how many servings you'd like the recipe to be for. also provide recipe name and metadata as bolded text so that I can easily identify the recipe. also give the food Nutrition value and the calories it has with some related emoji (like fire for calories) in form of a list.
        - If you have any feedback or suggestions, please let me know! I'm always looking for ways to improve.
        - today's date is ${new Date().toLocaleDateString()}.
        - ask follow up questions to nudge user into the optimal flow.
      `,
    onFinish: async ({ responseMessages }) => {
      if (session && session.user?.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error("Failed to save messages", error);
        }
      }
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    console.error("Failed to delete chat", error);
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
