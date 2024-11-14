import { Chat } from "@/components/chat";
import { generateUUID } from "@/lib/utils";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Promptly",
  description:
    "Promptly is a chat assistant that helps you with searching for information ,answering questions, general suggestions, cooking recipes, and much more.",
  metadataBase: new URL("https://promptlyai.vercel.app"),
};

const Home = async () => {
  const id = generateUUID();
  return <Chat key={id} id={id} initialMessages={[]} />;
};

export default Home;
