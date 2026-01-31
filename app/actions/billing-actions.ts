"use server";

import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function createCheckoutSession(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const origin = (await headers()).get("origin");

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    metadata: {
      userId: user.id,
    },
    line_items: [
      {
        price: "price_1Q...", // Replace with actual Stripe Price ID or use environment variable
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${origin}/dashboard/billing?success=true`,
    cancel_url: `${origin}/dashboard/billing?canceled=true`,
  });

  if (session.url) {
    redirect(session.url);
  }
}
