"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/shadcn/toggle-group";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    description: "Perfect for trial and familiarization to the platform",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Maximum of 3 stores",
      "Maximum of 1 audit per store",
      "Maximum of 100 locations per audit",
      "Maximum of 1,000 scannable barcodes in store's inventory",
      "Maximum of 10 users",
      "Allows strict barcodes only",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    description:
      "For clients who do stock taking on a regular and have prospects for growth",
    monthlyPrice: 14.99,
    yearlyPrice: 9.99,
    features: [
      "Maximum of 100 stores",
      "Maximum of 100 audits per store",
      "Maximum of 10,000 locations per audit",
      "Maximum of 100,000 scannable barcodes in store's inventory",
      "Maximum of 100 users",
      "Maximum of 10 concurrent scanning sessions",
      "Allows strict & variable barcodes",
      "Lease extra scanning devices from Foresee",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Ultimate",
    description:
      "For clients who offer inventory audits to myriads of warehouses & large enteprises",
    monthlyPrice: 49.99,
    yearlyPrice: 45.99,
    features: [
      "Infinite stores",
      "Infinite audits per store",
      "Infinite locations per audit",
      "Upto 10 million scannable barcodes in store's inventory",
      "Upto 10,000 users",
      "Maximum of 100 concurrent scanning sessions",
      "Allows strict & variable barcodes",
      "Lease extra scanning devices from Foresee",
    ],
    cta: "Get Started",
    popular: false,
  },
];

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Pricing Plans
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Choose your plan
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We've broken down our pricing to help you decide which plan you wish
            to proceed with. You can upgrade to a higher plan at any time.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-2">
            <ToggleGroup
              type="single"
              value={isYearly ? "yearly" : "monthly"}
              onValueChange={(value) => setIsYearly(value === "yearly")}
              className="bg-secondary text-secondary-foreground border-none rounded-full p-1 cursor-pointer shadow-none"
            >
              <ToggleGroupItem
                value="monthly"
                className="data-[state=on]:bg-background data-[state=on]:border-border border-transparent border px-6 rounded-full! data-[state=on]:text-foreground hover:bg-transparent cursor-pointer transition-colors"
              >
                Monthly
              </ToggleGroupItem>
              <ToggleGroupItem
                value="yearly"
                className="data-[state=on]:bg-background data-[state=on]:border-border border-transparent border px-6 rounded-full! data-[state=on]:text-foreground hover:bg-transparent cursor-pointer transition-colors"
              >
                Annually
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">Save 20%</span> On
            Annual Billing
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border">
            <div className="grid lg:grid-cols-3">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`p-8 grid grid-rows-subgrid row-span-4 gap-6 ${
                    plan.popular
                      ? "my-2 mx-4 rounded-xl bg-card border-transparent shadow-xl ring-1 ring-foreground/10 backdrop-blur"
                      : ""
                  }`}
                >
                  {/* Plan Header */}
                  <div>
                    <div className="text-lg font-medium tracking-tight mb-2">
                      {plan.name}
                    </div>
                    <div className="text-muted-foreground text-balance text-sm">
                      {plan.description}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <div className="text-4xl font-bold mb-1">
                      {plan.name === "Lifetime"
                        ? `$${plan.monthlyPrice}`
                        : plan.name === "Free"
                          ? "$0"
                          : `$${isYearly ? plan.yearlyPrice : plan.monthlyPrice}`}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {plan.name === "Lifetime"
                        ? "One-time payment"
                        : "Per month"}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div>
                    <Button
                      className={`w-full cursor-pointer my-2 ${
                        plan.popular
                          ? "shadow-md border-[0.5px] border-white/25 shadow-black/20 bg-primary ring-1 ring-primary/15 text-primary-foreground hover:bg-primary/90"
                          : "shadow-sm shadow-black/15 border border-transparent bg-background ring-1 ring-foreground/10 hover:bg-muted/50"
                      }`}
                      variant={plan.popular ? "default" : "secondary"}
                    >
                      {plan.cta}
                    </Button>
                  </div>

                  {/* Features */}
                  <div>
                    <ul role="list" className="space-y-3 text-sm">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-3"
                        >
                          <Check
                            className="text-muted-foreground size-4 shrink-0"
                            strokeWidth={2.5}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise Note */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Need custom components or have questions?{" "}
            <Button
              variant="link"
              className="p-0 h-auto cursor-pointer"
              asChild
            >
              <a href="#contact">Contact our team</a>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
