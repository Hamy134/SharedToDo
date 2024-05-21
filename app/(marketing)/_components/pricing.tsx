"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FREQUENCIES, TIERS } from "@/constants";
import { useAction } from "@/hooks/use-action";
import { cn } from "@/lib/utils";

import styles from "@/pricing.module.css";
import { Separator } from "@radix-ui/react-separator";

type PricingProps = {
  isSubscribed: boolean;
  isLoggedIn: boolean;
};

export const Pricing = ({ isSubscribed, isLoggedIn }: PricingProps) => {
  const [frequency, setFrequency] = useState(FREQUENCIES[0]);
  const router = useRouter();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      toast.loading("Redirecting to checkout...");
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubscribe = (tier: (typeof TIERS)[number]) => {
    if (tier.soldOut) return;
    if (!isLoggedIn) router.push("/sign-in");

    if (tier.id === "0") router.push("/dashboard");

    if (tier.id === "1") {
      const interval = frequency.id === "1" ? "month" : "year";

      execute({ interval });
    }
  };

  return (
   
    <div
      className={cn("flex flex-col w-full items-center", styles.fancyOverlay)}
    >
        <div className="w-full flex flex-col items-center">
    <Separator className="my-20" />
    <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full lg:w-auto mx-auto max-w-4xl lg:text-center">
        <h1 className="text-6xl md:text-6xl lg:text-7xl xl:text-8xl flex justify-center font-bold md:px-20 pb-8 dark:bg-gradient-to-r from-black to-gray-400 dark:from-white dark:to-gray-500 bg-clip-text dark:text-transparent font-bold !leading-tight">
          Pricing
        </h1>
      </div>

          {FREQUENCIES.length > 1 ? (
            <div className="mt-16 flex justify-center">
              <RadioGroup
                defaultValue={frequency.value}
                onValueChange={(value: string) => {
                  setFrequency(FREQUENCIES.find((f) => f.value === value)!);
                }}
                className="grid gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 bg-white dark:bg-black ring-1 ring-inset ring-gray-200/30 dark:ring-gray-800"
                style={{
                  gridTemplateColumns: `repeat(${FREQUENCIES.length}, minmax(0, 1fr))`,
                }}
              >
                <Label className="sr-only">Payment frequency</Label>
                {FREQUENCIES.map((option) => (
                  <Label
                    className={cn(
                      frequency.value === option.value
                        ? "bg-slate-500/90 text-white dark:bg-slate-900/70 dark:text-white/70"
                        : "bg-transparent text-gray-500 hover:bg-slate-500/10",
                      "cursor-pointer rounded-full px-2.5 py-2 transition-all"
                    )}
                    key={option.value}
                    htmlFor={option.value}
                  >
                    {option.label}

                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="hidden"
                    />
                  </Label>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="mt-12" aria-hidden="true" />
          )}

          <div
            id="pricing"
            className={cn(
              "isolate mx-auto mt-4 mb-28 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none",
              TIERS.length === 2 ? "lg:grid-cols-2" : "",
              TIERS.length === 3 ? "lg:grid-cols-3" : ""
            )}
          >
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  tier.featured
                    ? "!bg-gray-900 ring-gray-900 dark:!bg-gray-100 dark:ring-gray-100"
                    : "bg-white dark:bg-gray-900/80 ring-gray-300/70 dark:ring-gray-700",
                  "max-w-xs ring-1 rounded-3xl p-8 xl:p-10",
                  tier.highlighted ? styles.fancyGlassContrast : ""
                )}
              >
                <h3
                  id={tier.id}
                  className={cn(
                    tier.featured
                      ? "text-white dark:text-black"
                      : "text-black dark:text-white",
                    "text-2xl font-bold tracking-tight"
                  )}
                >
                  {tier.name}
                </h3>
                <p
                  className={cn(
                    tier.featured
                      ? "text-gray-300 dark:text-gray-500"
                      : "text-gray-600 dark:text-gray-400",
                    "mt-4 text-sm leading-6"
                  )}
                >
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={cn(
                      tier.featured
                        ? "text-white dark:text-black"
                        : "text-black dark:text-white",
                      "text-4xl font-bold tracking-tight"
                    )}
                  >
                    {typeof tier.price === "string"
                      ? tier.price
                      : tier.price[frequency.value as keyof {}]}
                  </span>

                  {typeof tier.price !== "string" ? (
                    <span
                      className={cn(
                        tier.featured
                          ? "text-gray-300 dark:text-gray-500"
                          : "dark:text-gray-400 text-gray-600",
                        "text-sm font-semibold leading-6"
                      )}
                    >
                      {frequency.priceSuffix}
                    </span>
                  ) : null}
                </p>
                <Button
                  size="lg"
                  disabled={tier.soldOut || isLoading}
                  aria-disabled={tier.soldOut || isLoading}
                  className={cn(
                    "w-full text-black dark:text-white mt-6",
                    !tier.highlighted && !tier.featured
                      ? "bg-gray-100 dark:bg-gray-600"
                      : "bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700",
                    tier.featured || tier.soldOut
                      ? "bg-white dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-black"
                      : "hover:opacity-80 transition-opacity"
                  )}
                  variant={tier.highlighted ? "default" : "outline"}
                  onClick={() => handleSubscribe(tier)}
                >
                  {tier.soldOut && "Sold out"}
                  {tier.id === "0" && !tier.soldOut
                    ? isLoggedIn
                      ? "Dashboard"
                      : "Sign up"
                    : null}
                  {tier.id === "1" && !tier.soldOut
                    ? isSubscribed
                      ? "Manage"
                      : "Upgrade"
                    : null}
                </Button>

                <ul
                  className={cn(
                    tier.featured
                      ? "text-gray-300 dark:text-gray-500"
                      : "text-gray-700 dark:text-gray-400",
                    "mt-8 space-y-3 text-sm leading-6 xl:mt-10"
                  )}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircle2
                        className={cn(
                          tier.featured ? "text-white dark:text-black" : "",
                          tier.highlighted ? "text-slate-500" : "text-gray-500",

                          "h-6 w-5 flex-none"
                        )}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
