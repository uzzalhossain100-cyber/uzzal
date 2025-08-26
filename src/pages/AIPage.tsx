import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface AITool {
  name: string;
  description: string;
  url: string;
}

const popularAITools: AITool[] = [
  {
    name: "ChatGPT",
    description: "OpenAI দ্বারা তৈরি একটি বৃহৎ ভাষা মডেল যা কথোপকথনমূলক এআই প্রদান করে।",
    url: "https://chat.openai.com/",
  },
  {
    name: "Google Bard (Gemini)",
    description: "Google দ্বারা তৈরি একটি কথোপকথনমূলক এআই চ্যাটবট।",
    url: "https://gemini.google.com/",
  },
  {
    name: "Midjourney",
    description: "টেক্সট প্রম্পট থেকে উচ্চ-মানের ছবি তৈরি করে।",
    url: "https://www.midjourney.com/",
  },
  {
    name: "DALL-E 3",
    description: "OpenAI দ্বারা তৈরি একটি এআই সিস্টেম যা টেক্সট বর্ণনা থেকে বাস্তবসম্মত ছবি তৈরি করে।",
    url: "https://openai.com/dall-e-3",
  },
  {
    name: "Stable Diffusion",
    description: "টেক্সট-টু-ইমেজ মডেল যা বিভিন্ন শৈলীতে ছবি তৈরি করতে পারে।",
    url: "https://stablediffusionweb.com/",
  },
  {
    name: "GitHub Copilot",
    description: "কোড লেখার জন্য এআই সহকারী, যা কোড সাজেশন এবং স্বয়ংক্রিয় কোড জেনারেশন প্রদান করে।",
    url: "https://github.com/features/copilot",
  },
  {
    name: "Grammarly",
    description: "লেখালেখির সহকারী যা ব্যাকরণ, বানান এবং শৈলী উন্নত করতে সাহায্য করে।",
    url: "https://www.grammarly.com/",
  },
  {
    name: "Jasper (formerly Jarvis)",
    description: "এআই কন্টেন্ট জেনারেটর যা ব্লগ পোস্ট, মার্কেটিং কপি এবং অন্যান্য লেখা তৈরি করে।",
    url: "https://www.jasper.ai/",
  },
  {
    name: "Synthesia",
    description: "এআই ভিডিও জেনারেশন প্ল্যাটফর্ম যা টেক্সট থেকে বাস্তবসম্মত এআই অবতার ভিডিও তৈরি করে।",
    url: "https://www.synthesia.io/",
  },
  {
    name: "RunwayML",
    description: "এআই ম্যাজিক টুলস সহ ভিডিও এডিটিং এবং জেনারেশন প্ল্যাটফর্ম।",
    url: "https://runwayml.com/",
  },
  {
    name: "Descript",
    description: "এআই-চালিত অডিও এবং ভিডিও এডিটিং টুল যা টেক্সট এডিটিংয়ের মতো কাজ করে।",
    url: "https://www.descript.com/",
  },
  {
    name: "Otter.ai",
    description: "এআই ভয়েস মিটিং ট্রান্সক্রিপশন এবং সারাংশ টুল।",
    url: "https://otter.ai/",
  },
  {
    name: "Notion AI",
    description: "Notion-এর মধ্যে এআই সহকারী যা লেখালেখি, সারাংশ এবং ব্রেনস্টর্মিংয়ে সাহায্য করে।",
    url: "https://www.notion.so/product/ai",
  },
  {
    name: "Canva Magic Studio",
    description: "Canva-এর এআই টুলস যা ডিজাইন, ইমেজ জেনারেশন এবং কন্টেন্ট তৈরিতে সাহায্য করে।",
    url: "https://www.canva.com/magic-studio/",
  },
  {
    name: "ElevenLabs",
    description: "উচ্চ-মানের এআই ভয়েস জেনারেশন এবং টেক্সট-টু-স্পিচ প্ল্যাটফর্ম।",
    url: "https://elevenlabs.io/",
  },
  {
    name: "Perplexity AI",
    description: "এআই-চালিত সার্চ ইঞ্জিন যা সরাসরি উত্তর এবং সোর্স প্রদান করে।",
    url: "https://www.perplexity.ai/",
  },
  {
    name: "HeyGen",
    description: "এআই ভিডিও জেনারেশন প্ল্যাটফর্ম যা কাস্টম অবতার এবং ভয়েস ক্লোনিং সমর্থন করে।",
    url: "https://www.heygen.com/",
  },
  {
    name: "Adobe Firefly",
    description: "Adobe-এর জেনারেটিভ এআই মডেল যা টেক্সট-টু-ইমেজ এবং অন্যান্য ক্রিয়েটিভ ফিচার প্রদান করে।",
    url: "https://www.adobe.com/sensei/generative-ai/firefly.html",
  },
  {
    name: "Copilot (Microsoft)",
    description: "Microsoft 365 অ্যাপ্লিকেশনের জন্য এআই সহকারী।",
    url: "https://www.microsoft.com/en-us/microsoft-copilot",
  },
  {
    name: "Writesonic",
    description: "এআই রাইটিং টুল যা ব্লগ পোস্ট, বিজ্ঞাপন কপি এবং ল্যান্ডিং পেজ তৈরি করে।",
    url: "https://writesonic.com/",
  },
];

const AIPage: React.FC = () => {
  const [selectedAITool, setSelectedAITool] = useState<AITool | null>(null);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <Card className="w-full lg:w-1/3 flex flex-col">
        <CardHeader>
          <CardTitle>জনপ্রিয় এআই টুলস</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4">
            <div className="grid gap-2">
              {popularAITools.map((tool, index) => (
                <React.Fragment key={tool.name}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left flex flex-col items-start h-auto py-2"
                    onClick={() => setSelectedAITool(tool)}
                  >
                    <span className="font-semibold text-base">{tool.name}</span>
                    <span className="text-sm text-muted-foreground text-left">{tool.description}</span>
                  </Button>
                  {index < popularAITools.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="w-full lg:w-2/3 flex flex-col">
        <CardHeader>
          <CardTitle>{selectedAITool ? selectedAITool.name : "এআই টুল বিবরণ"}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {selectedAITool ? (
            <iframe
              src={selectedAITool.url}
              title={selectedAITool.name}
              className="w-full h-[calc(100vh-200px)] border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Added sandbox for security
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              একটি এআই টুল নির্বাচন করুন
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPage;