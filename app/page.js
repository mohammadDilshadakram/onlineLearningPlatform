'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/workspace");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>

      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
          Build Smarter Courses with AI
        </h1>
        <p className="text-lg mb-6 opacity-90">
          Generate and customize entire courses in seconds. Leverage AI to design interactive, structured content for any subject.
        </p>

        <Button
          onClick={handleGetStarted}
          className="bg-white text-indigo-700 hover:bg-indigo-100 px-6 py-3 text-md font-semibold rounded-full transition duration-200"
        >
          Get Started
        </Button>
      </div>

      <div className="mt-12">
        <Image
          src="/img2.png" // Replace with your actual image path
          alt="AI Course Builder"
          width={600}
          height={400}
          className="rounded-lg shadow-lg border border-white/20"
        />
      </div>
    </div>
  );
}
