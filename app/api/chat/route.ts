import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
    });

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (
      runStatus.status === "in_progress" ||
      runStatus.status === "queued"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage =
      messages.data[0].content.find(
        (content): content is OpenAI.Beta.Threads.Messages.TextContentBlock =>
          content.type === "text",
      )?.text.value || "Sorry, I could not process your message.";

    // Delete the thread to clean up
    await openai.beta.threads.del(thread.id);

    return NextResponse.json({ response: assistantMessage });
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
