import SimpleMSKPageComponent from "@/components/site/pages//SimpleMSK";
import AboutPageComponent from "@/components/site/pages/About";
import AccessSimpleMSKFormsPageComponent from "@/components/site/pages/AccessSimpleMSKForms";
import AccessibilityStatementPageComponent from "@/components/site/pages/AccessibilityStatement";
import BehavioralHealthFormsPageComponent from "@/components/site/pages/BehavioralHealthForms";
import CareersPageComponent from "@/components/site/pages/Careers";
import ContactUsPageComponent from "@/components/site/pages/ContactUs";
import DiversityEquityInclusionPageComponent from "@/components/site/pages/DiversityEquityInclusion";
import HolidayGreetingsPageComponent from "@/components/site/pages/HolidayGreetings";
import InformedTelehealthConsentPageComponent from "@/components/site/pages/InformedTelehealthConsent";
import MemberAccessLoginPageComponent from "@/components/site/pages/MemberAccessLogin";
import NotFound from "@/components/site/pages/NotFound";
import PrivacyPolicyPageComponent from "@/components/site/pages/PrivacyPolicy";
import ProviderPageComponent from "@/components/site/pages/Provider";
import SecurityPageComponent from "@/components/site/pages/Security";
import SimpleBehavioralPageComponent from "@/components/site/pages/SimpleBehavioral";
import SimpleEAPPageComponent from "@/components/site/pages/SimpleEAP";
import SimpleWellbeingPageComponent from "@/components/site/pages/SimpleWellbeing";
import TermsConditionsPageComponent from "@/components/site/pages/TermsConditions";
import TestimonialsPageComponent from "@/components/site/pages/Testimonials";
import VacanciesPageComponent from "@/components/site/pages/Vacancies";
import { PageActive } from "@/types/entities/page";
import React from "react";

interface DynamicPageProps {
  idx: string;
  post: any;
  allVacancies: {
    title: string;
    contentHtml: string;
    buttonText?: string;
    buttonLink?: string;
  }[];
  pageDate: PageActive;
}

const SinglePage = ({ idx, post, allVacancies, pageDate }: DynamicPageProps) => {
  const componentsMap: { [key: string]: JSX.Element } = {
    about: <AboutPageComponent pageData={pageDate} />,
    simpleMSK: <SimpleMSKPageComponent pageData={pageDate} />,
    simpleEAP: <SimpleEAPPageComponent pageData={pageDate} />,
    simpleWellbeing: <SimpleWellbeingPageComponent pageData={pageDate} />,
    simpleBehavioral: <SimpleBehavioralPageComponent pageData={pageDate} />,
    diversityEquityInclusion: <DiversityEquityInclusionPageComponent pageData={pageDate} />,
    careers: <CareersPageComponent allVacancies={allVacancies} pageData={pageDate} />,
    testimonials: <TestimonialsPageComponent />,
    securityPage: <SecurityPageComponent pageData={pageDate} />,
    privacyPolicy: <PrivacyPolicyPageComponent post={post} />,
    termsConditions: <TermsConditionsPageComponent post={post} />,
    informedTelehealthConsent: <InformedTelehealthConsentPageComponent post={post} />,
    providers: <ProviderPageComponent pageData={pageDate} />,
    vacancy: <VacanciesPageComponent allVacancies={allVacancies} />,
    contact: <ContactUsPageComponent />,
    accessibilityStatement: <AccessibilityStatementPageComponent post={post} />,
    accessSimpleMSKForms: <AccessSimpleMSKFormsPageComponent pageData={pageDate} />,
    behavioralHealthForms: <BehavioralHealthFormsPageComponent pageData={pageDate} />,
    memberLogin: <MemberAccessLoginPageComponent />,
    holidayGreetings: <HolidayGreetingsPageComponent />,
  };
  const Component = componentsMap[idx] || <NotFound />;
  return <>{Component}</>;
};

export default SinglePage;
