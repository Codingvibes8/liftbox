import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CloudIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-14 items-center px-4 lg:px-6 border-b">
        <Link className="flex items-center justify-center" href="#">
          <CloudIcon className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-xl font-bold">LiftBox</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
        </nav>
        <div className="ml-4">
            <Link href="/login">
                <Button>Sign In</Button>
            </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Secure Cloud Storage for Everyone
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Store, share, and access your files from anywhere. Secure, fast, and reliable.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Get Started for Free</Button>
                </Link>
                <Button variant="outline" size="lg">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 LiftBox. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}