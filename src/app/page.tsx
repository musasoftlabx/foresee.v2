"use client";

import React, { Fragment, useEffect, useState } from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { LogoCarousel } from "@/components/landing/logo-carousel";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TeamSection } from "@/components/landing/team-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { BlogSection } from "@/components/landing/blog-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { ContactSection } from "@/components/landing/contact-section";
import { FaqSection } from "@/components/landing/faq-section";
import { LandingFooter } from "@/components/landing/footer";
import {
  LandingThemeCustomizer,
  LandingThemeCustomizerTrigger,
} from "@/components/landing/landing-theme-customizer";
import { AboutSection } from "@/components/landing/about-section";
import CreateAccount from "@/components/modals/(auth)/create-account";
import Login from "@/components/modals/(auth)/login";
import { useParams, useSearchParams } from "next/navigation";

export default function LandingPage() {
  const param = useSearchParams();
  const query = param.toString().split("=")[0];

  const [themeCustomizerOpen, setThemeCustomizerOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (query === "login") setIsLoginOpen(true);
    if (query === "register") setIsCreateAccountOpen(true);
  }, [query]);

  return (
    <Fragment>
      <CreateAccount
        isModalOpen={isCreateAccountOpen}
        setIsModalOpen={setIsCreateAccountOpen}
      />

      <Login isModalOpen={isLoginOpen} setIsModalOpen={setIsLoginOpen} />

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <LandingNavbar
          isLoginOpen={isLoginOpen}
          setIsLoginOpen={setIsLoginOpen}
          isCreateAccountOpen={isCreateAccountOpen}
          setIsCreateAccountOpen={setIsCreateAccountOpen}
        />

        {/* Main Content */}
        <main>
          <HeroSection
            isCreateAccountOpen={isCreateAccountOpen}
            setIsCreateAccountOpen={setIsCreateAccountOpen}
          />
          <LogoCarousel />
          <StatsSection />
          <AboutSection />
          <FeaturesSection />
          <TeamSection />
          <PricingSection />
          <TestimonialsSection />
          {/* <BlogSection /> */}
          <FaqSection />
          <CTASection />
          <ContactSection />
        </main>

        {/* Footer */}
        <LandingFooter />

        {/* Theme Customizer */}
        {/* <LandingThemeCustomizerTrigger
        onClick={() => setThemeCustomizerOpen(true)}
      />
      <LandingThemeCustomizer
        open={themeCustomizerOpen}
        onOpenChange={setThemeCustomizerOpen}
      /> */}
      </div>
    </Fragment>
  );
}
