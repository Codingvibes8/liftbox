import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/billing-actions";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Billing &amp; Subscription</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            <ul className="space-y-2 text-sm text-gray-500">
               <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" /> 2 GB Storage</li>
               <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" /> Basic Support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>Current Plan</Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
         <Card className="border-blue-600 shadow-md relative">
           <div className="absolute top-0 right-0 p-2">
             <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">Recommended</span>
           </div>
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>For power users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">$10<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
             <ul className="space-y-2 text-sm text-gray-500">
               <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" /> 100 GB Storage</li>
               <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" /> Priority Support</li>
               <li className="flex items-center"><CheckIcon className="mr-2 h-4 w-4 text-green-500" /> Full-text Search</li>
            </ul>
          </CardContent>
          <CardFooter>
             <form action={createCheckoutSession} className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Upgrade to Pro</Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
