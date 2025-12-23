import {
  FeaturesSectionContent,
  CoachingSectionContent,
  CultureOfWellnessSectionContent,
  MainSectionContent,
} from "@/components/site/pages/SimpleWellbeing/types";
import { CollToAction } from "@/components/site/parts/CollToAction";
import { CollToActionContent } from "@/components/site/parts/CollToAction/types";
import { IconTextCardWide } from "@/components/site/parts/IconTextCardWide";
import { ImageTextSection } from "@/components/site/parts/ImageTextSection";
import { ImageTextSectionContent } from "@/components/site/parts/ImageTextSection/types";
import { MainSection } from "@/components/site/parts/MainSection";
import { ResultsDerivedCard } from "@/components/site/parts/ResultsDerivedCard";
import { ResultsDerivedCardProps } from "@/components/site/parts/ResultsDerivedCard/types";
import { PageActive } from "@/types/entities/page";
import { useSiteContext } from "@/utils/siteContext";
import classNames from "classnames";
import parse from "html-react-parser";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import React from "react";

interface DynamicPageProps {
  pageData: PageActive;
}
export default function SimpleWellbeingPageComponent({ pageData }: DynamicPageProps) {
  const { setOpenModal, setClosingModal } = useSiteContext();
  const { t } = useTranslation("common");
  const sections = [
    { key: "mainSection", type: "" },
    { key: "imageTextSection", type: "" },
    { key: "fosteringACultureSection", type: "" },
    { key: "coachingSection", type: "" },
    { key: "resultsDerived", type: "Card" },
    { key: "cultureOfWellnessSection", type: "" },
    { key: "collToActionSection", type: "" },
  ];
  const sectionContents = sections.reduce(
    (acc, { key, type }) => {
      acc[key] = t(`SimpleWellbeing.${key}`, { returnObjects: true }) as any;
      return acc;
    },
    {} as Record<string, any>
  );
  const {
    mainSection,
    imageTextSection,
    fosteringACultureSection,
    coachingSection,
    resultsDerived,
    cultureOfWellnessSection,
    collToActionSection,
  } = sectionContents as {
    mainSection: MainSectionContent;
    imageTextSection: ImageTextSectionContent;
    fosteringACultureSection: FeaturesSectionContent;
    coachingSection: CoachingSectionContent;
    resultsDerived: ResultsDerivedCardProps;
    cultureOfWellnessSection: CultureOfWellnessSectionContent;
    collToActionSection: CollToActionContent;
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setClosingModal(false);
  };

  return (
    <>
      <MainSection
        imgUrl={`/images/site/SimpleWellbeing/${mainSection.imageUrl}`}
        classChildrenWrapper="order-2"
        imgAlt={pageData.imageMainAlt || pageData.translations[0].title || "Simple Therapy"}
        classImage="order-1 max-h-[260px] xs:max-h-[610px] md:min-h-[609px] md:max-w-[609px] object-top"
        position="left">
        <Image
          className="mb-2 h-full max-h-[33px] w-auto object-cover"
          src={`/images/site/SimpleWellbeing/st-logo_brands.svg`}
          alt="Simple Therapy"
          width="240"
          height="33"
        />
        <h1 className="mb-0 grid justify-items-start pb-4">
          <span className="relative inline text-site-text-28-33 font-normal capitalize text-site-text-blue-2 before:absolute before:bottom-[-15px] before:right-[0px] before:h-[24px] before:w-[73%] before:bg-[url('/images/site/SimpleWellbeing/SimpleWellbeingMainLine.svg')] before:bg-contain before:bg-no-repeat sm:text-site-text-38-38 md3:text-site-text-56-67 md3:before:bottom-[-10px]">
            {mainSection.title.lineDecoration}
          </span>
          <span className="relative inline text-site-text-28-33 font-normal capitalize text-site-text-blue-2 sm:text-site-text-38-38 md3:text-site-text-56-67">
            {mainSection.title.line}
          </span>
        </h1>
      </MainSection>
      <ImageTextSection
        imageUrl={`/images/site/SimpleWellbeing/${imageTextSection.imageUrl}`}
        position="right"
        classNameWrapper="py-8 md:py-32 text-white bg-purple"
        classTitle="max-w-full">
        <h2
          className={classNames(
            "mb-4 max-w-[400px] text-site-text-28-33 font-medium md:mb-10 md:text-site-text-48-57"
          )}>
          {parse(imageTextSection.title)}
        </h2>
        <p className={classNames("max-w-[515px] text-site-text-16-24 font-[300] md:text-site-text-18-27")}>
          {imageTextSection.description}
        </p>
      </ImageTextSection>
      <div className={classNames("mb-8 pt-4 md:mb-24 md:pt-16")}>
        <ImageTextSection
          imageUrl={`/images/site/SimpleWellbeing/${fosteringACultureSection.imageUrl}`}
          position="left"
          classNameWrapper="py-8"
          classTitle="max-w-full">
          <h2
            className={classNames("mb-4 text-site-text-28-33 font-medium md:mb-10 md:text-site-text-48-57")}>
            {fosteringACultureSection.title}
          </h2>
          <p className={classNames("max-w-[515px] text-site-text-16-24 font-[300] md:text-site-text-18-27")}>
            {fosteringACultureSection.description}
          </p>
        </ImageTextSection>
        <div className="container">
          {/* <h3
            className={classNames(
              "mb-6 text-center text-site-text-24-33 text-purple md:mb-8 md:text-site-text-32-38"
            )}>
            {fosteringACultureSection?.title}
          </h3> */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            {fosteringACultureSection?.featuresSection?.features?.map((item, idx) => (
              <IconTextCardWide
                key={idx}
                card={{ title: item.title, icon: item.icon }}
                classText="text-purple"
                classIcon="h-[64px] w-[64px] p-4 bg-gray-4"
                classWrapper="py-4 px-2.5 md:py-8 md:px-8 flex-row gap-4 bg-white shadow-icon-card"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-4 py-8 md:py-16">
        <div className="container max-w-[1155px]">
          <h3 className="mb-2 text-site-text-24-28 md:text-site-text-32-38">{coachingSection.title}</h3>
          <p className="mb-6 text-site-text-16-24 md:mb-10 md:text-site-text-18-27">
            {coachingSection.description}
          </p>
          <div className="flex flex-col gap-4">
            {coachingSection?.features?.map((item, idx) => (
              <IconTextCardWide
                key={idx}
                card={{ title: item.title, icon: item.icon }}
                classText="text-purple"
                classIcon="h-[64px] w-[64px] p-4 bg-transparent"
                classWrapper="py-4 px-2.5 flex-row gap-4 bg-white shadow-icon-card"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="container pt-6 md:pt-16">
        <h2 className="mb-4 text-center text-site-text-28-33 font-medium md:mb-6 md:text-site-text-32-38">
          {resultsDerived.title}
        </h2>
        <div className="mb-6 md:mb-14.5">
          <div className="mb-7 flex flex-wrap justify-center gap-6.5 md:gap-8">
            {resultsDerived?.resultsCard?.map((card, idx) => (
              <ResultsDerivedCard
                key={idx}
                card={{
                  percentage: card.percentage,
                  description: card.description,
                  imageUrl: card.imageUrl,
                }}
                classWrapper="max-w-[400px] flex-[1_1_350px]"
              />
            ))}
          </div>
          <div className="hidden md:block">
            <h3 className="mb-2 text-site-text-12-18">{resultsDerived.sourcesTitle}</h3>
            <p className="text-[8px] font-light leading-none">{resultsDerived.sourcesDescription}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-4 py-8 md:bg-transparent md:py-16">
        <div className="container">
          <h3 className="mb-2 text-center text-site-text-24-28 font-normal md:text-site-text-32-38">
            {cultureOfWellnessSection.title}
          </h3>
          <p className="mb-4 text-center text-site-text-16-24 font-normal md:mb-8 md:text-site-text-18-26">
            {cultureOfWellnessSection.description}
          </p>
          <h3 className="mb-4 text-center text-site-text-18-21 font-normal text-purple md:text-site-text-24-33">
            {cultureOfWellnessSection.cardsTitle}
          </h3>
          <div className="mx-auto grid max-w-[1150px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {cultureOfWellnessSection?.features?.map((item, idx) => (
              <IconTextCardWide
                key={idx}
                card={{ title: item.title, icon: item.icon }}
                classText="text-purple text-center"
                classIcon="h-[64px] w-[64px] p-4 bg-gray-4"
                classWrapper="py-3 sm:py-1 px-2 min-h-auto sm:min-h-[215px] flex-row sm:flex-col sm:justify-center gap-2.5 bg-white shadow-icon-card"
              />
            ))}
          </div>
        </div>
      </div>
      <CollToAction
        content={{
          title: collToActionSection.title,
          description: collToActionSection.description,
          buttonText: collToActionSection.buttonText,
          imageBrand: collToActionSection.imageBrand,
        }}
        eventHandler={handleOpenModal}
        classWrapper="bg-white md:bg-gray-4"
        classContentWrapper="max-w-[650px]"
        classTitle="items-center gap-4"
        classDescription="text-center md:text-left"
        classButton="bg-purple text-white hover:bg-pink w-full md:w-fit"
      />
    </>
  );
}
