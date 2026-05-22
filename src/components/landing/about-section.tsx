"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { CardDecorator } from "@/components/ui/shadcn/card-decorator";
import { Github, Code, Palette, Layout, Crown } from "lucide-react";

const values = [
  {
    icon: Code,
    title: "Customer First",
    description:
      "Our stock-taking application is built with a customer-first mindset, ensuring that every feature directly addresses real-world challenges faced by businesses managing inventory.",
  },
  {
    icon: Palette,
    title: "Design Excellence",
    description:
      "Built with performance and scalability in mind, the application delivers fast, reliable results even in high-volume environments.",
  },
  {
    icon: Layout,
    title: "Production Ready",
    description:
      "Battle-tested components used in real applications with proven performance and reliability across different environments.",
  },
  {
    icon: Crown,
    title: "Premium Quality",
    description:
      "Hand-crafted with attention to detail and performance optimization, ensuring exceptional user experience and accessibility.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            About Foresee Technologies
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Built for stock taking
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Eliminate manual errors and time-consuming spreadsheets with
            automated stock tracking, smart reconciliation tools, and intuitive
            dashboards that give you instant insights into your inventory
            levels. Whether you manage a single store or multiple locations, our
            platform scales with your business—helping you reduce losses,
            optimize stock levels, and make data-driven decisions with
            confidence. Stay in control, improve efficiency, and transform the
            way you manage inventory—all from one secure, cloud-based solution.
          </p>
        </div>

        {/* Modern Values Grid with Enhanced Design */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
          {values.map((value, index) => (
            <Card key={index} className="group shadow-xs py-2">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center">
                  <CardDecorator>
                    <value.icon className="h-6 w-6" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium text-balance">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm">
                    {value.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
