"use client";

import { type VariantProps } from "class-variance-authority";
import { GlobeIcon, Menu, User, Users } from "lucide-react";
import { ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import LaunchUI from "@/components/logos/launch-ui";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "@/components/ui/navbar";
import Navigation from "@/components/ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  PricingColumn,
  PricingColumnProps,
} from "@/components/ui/pricing-column";
//import { Section } from "@/components/ui/section";

interface PricingProps {
  title?: string | false;
  description?: string | false;
  plans?: PricingColumnProps[] | false;
  className?: string;
}

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
}

const siteConfig = {
  url: "https://launchui.com",
};

import { CalendarIcon, FileTextIcon, InputIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Marquee } from "@/components/ui/marquee";

const files = [
  {
    name: "bitcoin.pdf",
    body: "Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
  },
  {
    name: "finances.xlsx",
    body: "A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.",
  },
  {
    name: "logo.svg",
    body: "Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.",
  },
  {
    name: "keys.gpg",
    body: "GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.",
  },
  {
    name: "seed.txt",
    body: "A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.",
  },
];
const features = [
  {
    Icon: FileTextIcon,
    name: "Save your files",
    description: "We automatically save your files as you type.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -top-20 -right-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "Full text search",
    description: "Search through all your files in one place.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -top-20 -right-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Multilingual",
    description: "Supports 100+ languages and counting.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -top-20 -right-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Calendar",
    description: "Use the calendar to filter your files by date.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -top-20 -right-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Notifications",
    description:
      "Get notified when someone shares a file or mentions you in a comment.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -top-20 -right-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

import React from "react";
import KineticTestimonial from "@/components/ui/kinetic-testimonials";
import CreateAccount from "@/components/admin/clients/create-account";

const testimonials = [
  {
    name: "Ava Thompson",
    handle: "@ava_thompson",
    review:
      "ScrollX UI is a game-changer! The animations are smooth, and the UI is beyond stunning.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Elijah Carter",
    handle: "@elijah_ui",
    review:
      "Absolutely mesmerizing! The attention to detail in ScrollX UI is incredible.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Sophia Martinez",
    handle: "@sophia_codes",
    review:
      "As a front-end developer, I love how intuitive and powerful ScrollX UI is. It's a must-have tool!",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Michael Brown",
    handle: "@michaelb_dev",
    review:
      "This changed the way I build interfaces. The animations are top-notch!",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Liam Anderson",
    handle: "@liamdesigns",
    review:
      "The best UI toolkit I've ever used! Smooth animations and top-notch performance.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Olivia Hayes",
    handle: "@olivia_h",
    review:
      "This is absolutely mind-blowing. AI-powered UI is the future, and ScrollX UI is leading the way!",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Daniel Lee",
    handle: "@daniel_dev",
    review:
      "Brilliant execution! The user experience feels effortless and elegant.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Sarah Green",
    handle: "@sarahgreen",
    review:
      "I can't stop recommending this. It makes everything feel premium and polished!",
    avatar:
      "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Mia Patel",
    handle: "@miapatel",
    review: "ScrollX UI took my web app to the next level. Highly recommend!",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "James Walker",
    handle: "@jameswalker",
    review:
      "This is the future of web design! Can't believe something this good is available for free.",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Emma Johnson",
    handle: "@emma_uiux",
    review:
      "Phenomenal work! Every detail is thoughtfully crafted for an amazing experience.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Ethan Roberts",
    handle: "@ethan_rob",
    review: "This toolkit has completely changed my workflow. Incredible work!",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Isabella Davis",
    handle: "@bella_designs",
    review:
      "The seamless integration and intuitive interface make this tool indispensable for modern web development.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Noah Wilson",
    handle: "@noah_dev",
    review:
      "Performance is outstanding! My sites load faster and look more professional than ever.",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Charlotte Moore",
    handle: "@charlotte_ui",
    review:
      "The learning curve is minimal, but the impact is massive. This is what modern development tools should be.",
    avatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Lucas Taylor",
    handle: "@lucas_codes",
    review:
      "Revolutionary approach to UI development. The AI suggestions are spot-on every time.",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Amelia Clark",
    handle: "@amelia_design",
    review:
      "Client satisfaction has gone through the roof since I started using ScrollX UI.",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    name: "Benjamin Lewis",
    handle: "@ben_frontend",
    review:
      "The animation library is extensive and the performance optimizations are incredible.",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
];

export default function Home({
  logo = <LaunchUI />,
  name = "Launch UI",
  homeUrl = siteConfig.url,
  mobileLinks = [
    { text: "Getting Started", href: siteConfig.url },
    { text: "Components", href: siteConfig.url },
    { text: "Documentation", href: siteConfig.url },
  ],
  actions = [
    { text: "Sign in", href: siteConfig.url, isButton: false },
    {
      text: "Get Started",
      href: siteConfig.url,
      isButton: true,
      variant: "default",
    },
  ],
  showNavigation = true,
  customNavigation,
  title = "Build your dream landing page, today.",
  description = "Get lifetime access to all the components. No recurring fees. Just simple, transparent pricing.",
  plans = [
    {
      name: "Free",
      description: "For everyone starting out on a website for their big idea",
      price: 0,
      priceNote: "Free and open-source forever. Get started now.",
      cta: {
        variant: "glow",
        label: "Get started for free",
        href: "/docs/getting-started/introduction",
      },
      features: [
        "1 website template",
        "9 blocks and sections",
        "4 custom animations",
      ],
      variant: "default",
      className: "hidden lg:flex",
    },
    {
      name: "Pro",
      icon: <User className="size-4" />,
      description: "For early-stage founders, solopreneurs and indie devs",
      price: 99,
      priceNote: "Lifetime access. Free updates. No recurring fees.",
      cta: {
        variant: "default",
        label: "Get all-access",
        href: "siteConfig.pricing.pro",
      },
      features: [
        ` templates`,
        ` blocks and sections`,
        ` illustrations`,
        ` custom animations`,
      ],
      variant: "glow-brand",
    },
    {
      name: "Pro Team",
      icon: <Users className="size-4" />,
      description: "For teams and agencies working on cool products together",
      price: 499,
      priceNote: "Lifetime access. Free updates. No recurring fees.",
      cta: {
        variant: "default",
        label: "Get all-access for your team",
        href: "siteConfig.pricing.team",
      },
      features: [
        "All the templates, components and sections available for your entire team",
      ],
      variant: "glow",
    },
  ],
  className,
}: NavbarProps) {
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  return (
    <>
      <CreateAccount
        isOpen={isCreateAccountOpen}
        setIsOpen={setIsCreateAccountOpen}
      />

      <section className={cn(className)}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12">
          {(title || description) && (
            <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
              {title && (
                <h2 className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-md text-muted-foreground max-w-[600px] font-medium sm:text-xl">
                  {description}
                </p>
              )}
            </div>
          )}
          {plans !== false && plans.length > 0 && (
            <div className="max-w-container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <PricingColumn
                  key={plan.name}
                  name={plan.name}
                  icon={plan.icon}
                  description={plan.description}
                  price={plan.price}
                  originalPrice={plan.originalPrice}
                  promotionText={plan.promotionText}
                  priceNote={plan.priceNote}
                  cta={plan.cta}
                  features={plan.features}
                  variant={plan.variant}
                  className={plan.className}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <KineticTestimonial
        testimonials={testimonials}
        className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-black dark:to-black md:py-0 py-0 not-prose"
        cardClassName="hover:scale-105 shadow-lg"
        avatarClassName="ring-2 ring-purple-500"
        desktopColumns={3}
        tabletColumns={3}
        mobileColumns={2}
        speed={1.5}
        title="Customer Reviews"
        subtitle="What our users think about our product"
      />

      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </>
  );
}
