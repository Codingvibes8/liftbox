import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <div className="space-y-4 max-w-lg">
          <div className="space-y-2">
             <Label htmlFor="username">Username</Label>
             <Input id="username" placeholder="johndoe" disabled />
             <p className="text-[0.8rem] text-muted-foreground">
              This is your public display name.
             </p>
          </div>
          <div className="space-y-2">
             <Label htmlFor="email">Email</Label>
             <Input id="email" placeholder="john@example.com" disabled />
          </div>
          <Button>Update profile</Button>
      </div>
       <Separator />
       <div className="space-y-4 max-w-lg">
           <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
            <div className="border border-red-200 rounded-md p-4 bg-red-50 dark:bg-red-950/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-red-900 dark:text-red-400">Delete Account</h4>
                        <p className="text-sm text-red-700 dark:text-red-300">Permanently delete your account and all of your content.</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                </div>
            </div>
       </div>
    </div>
  );
}
