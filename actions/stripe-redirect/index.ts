"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { StripeRedirect } from "@/schema";

import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return {
      error: "Please Login.",
    };
  }

  const { interval } = data;

  const settingsUrl = absoluteUrl("/dashboard");

  let url = "";

  try {
    const userSubscription = await db.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "CountWave Pro",
                description: "Get all of CountWaves goodies.",
              },
              unit_amount: interval === "month" ? 1200 : 9499,
              recurring: {
                interval: interval || "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId,
        },
      });

      url = stripeSession.url || "";
    }
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { data: url };
};

export const stripeRedirect = createSafeAction(StripeRedirect, handler);
