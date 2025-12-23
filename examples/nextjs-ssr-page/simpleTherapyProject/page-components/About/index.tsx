import { CollToAction } from "@/components/site/parts/CollToAction";
import { CollToActionContent } from "@/components/site/parts/CollToAction/types";
import { MainSection } from "@/components/site/parts/MainSection";
import { PageActive } from "@/types/entities/page";
import { useSiteContext } from "@/utils/siteContext";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import Image from "next/image";

import {
  AboutProps,
  CaringSectionProps,
  OurApproachProps,
  OurStoryProps,
  OurTeamProps,
} from "./types";

interface DynamicPageProps {
  pageData: PageActive;
}
const AboutPageComponent = ({ pageData }: DynamicPageProps) => {
  const { t } = useTranslation("common");
  const { setOpenModal, setClosingModal } = useSiteContext();

  const handleOpenModal = () => {
    setOpenModal(true);
    setClosingModal(false);
  };
  const sections = [
    { key: "mainSection", type: "AboutProps" },
    { key: "ourStory", type: "OurStoryProps" },
    { key: "ourApproach", type: "OurApproachProps" },
    { key: "ourTeam", type: "OurTeamProps" },
    { key: "caringSection", type: "CaringSectionProps" },
    { key: "collToActionSection", type: "CollToActionContent" },
  ];

  const sectionContents = sections.reduce((acc, { key, type }) => {
    acc[key] = t(`About.${key}`, { returnObjects: true }) as any;
    return acc;
  }, {} as Record<string, any>);
  const {
    mainSection,
    ourStory,
    ourApproach,
    ourTeam,
    caringSection,
    collToActionSection,
  } = sectionContents as {
    mainSection: AboutProps;
    ourStory: OurStoryProps;
    ourApproach: OurApproachProps;
    ourTeam: OurTeamProps;
    caringSection: CaringSectionProps;
    collToActionSection: CollToActionContent;
  };

  return (
    <>
      <MainSection
        imgUrl={`/images/site/About/${mainSection.imageUrl}`}
        imgAlt={
          pageData.imageMainAlt ||
          pageData.translations[0].title ||
          "Simple Therapy"
        }
        classChildrenWrapper=""
        classImage=""
        position="right">
        <p className="mb-2 text-site-text-20-24 md:mb-4 md:text-site-text-30-36">
          {mainSection.sudTitle}
        </p>
        <h1 className="mb-6 flex flex-col md:mb-9.5">
          <span className="relative hidden w-fit text-site-text-56-67 text-site-text-blue-2 before:absolute before:-top-2.5 before:right-[-20px] before:h-[32px] before:w-[28px] before:bg-[url('/images/site/About/decor-2-desk.svg')] before:bg-contain before:bg-no-repeat md:inline">
            {mainSection["title-desk"]["lineDecoration-1"]}
          </span>
          <span className="relative hidden w-fit text-site-text-52-62 font-normal capitalize text-site-text-blue-2 before:absolute before:bottom-[-15px] before:right-[0px] before:z-[-1] before:h-[37px] before:w-full before:bg-[url('/images/site/About/decor_line.svg')] before:bg-cover before:bg-no-repeat md:inline-flex md:before:bottom-[-10px]">
            {mainSection["title-desk"]["lineDecoration-2"]}
          </span>
          <span className="relative inline-flex w-fit text-site-text-33-38 font-normal capitalize text-site-text-blue-2 before:absolute before:bottom-[-6px] before:right-[0px] before:z-[-1] before:h-[20px] before:w-full before:bg-[url('/images/site/About/decor_line.svg')] before:bg-cover before:bg-no-repeat md:hidden md:before:bottom-[-10px]">
            {mainSection["title-mob"]["lineDecoration-1"]}
          </span>
          <span className="relative inline w-fit text-site-text-33-38 text-site-text-blue-2 before:absolute before:-bottom-2.5 before:right-[-20px] before:h-[32px] before:w-[28px] before:bg-[url('/images/site/About/decor-2-mob.svg')] before:bg-contain before:bg-no-repeat md:hidden">
            {mainSection["title-mob"]["lineDecoration-2"]}
          </span>
        </h1>
        <div className="hidden max-w-[500px] md:block">
          <p
            className={classNames(
              "mb-5 text-site-text-18-27 font-light text-site-text-blue-2 md:mb-9.5"
            )}>
            {mainSection["description-1-desk"]}
          </p>
          <p
            className={classNames(
              "mb-6 text-site-text-18-27 font-light text-site-text-blue-2"
            )}>
            {mainSection["description-2-desk"]}
          </p>
        </div>
        <div className="block max-w-[500px] md:hidden">
          <p
            className={classNames(
              "mb-5 text-site-text-18-27 font-light text-site-text-blue-2 md:mb-9.5"
            )}>
            {mainSection["description-1-mob"]}
          </p>
          <p
            className={classNames(
              "mb-6 text-site-text-18-27 font-light text-site-text-blue-2"
            )}>
            {mainSection["description-2-mob"]}
          </p>
        </div>
      </MainSection>
      <div className="bg-site-text-blue-2 py-8 md:py-16">
        <div className="container">
          <div className="flex flex-col gap-0 md:flex-row md:gap-8 lg:gap-16">
            <Image
              src={`/images/site/About/${ourStory.imageUrl}`}
              alt={ourStory.title || "SimpleTherapy"}
              width={544}
              height={440}
              className="hidden basis-1/2 rounded-[40px] object-cover md:block"
            />
            <div className="basis-1/2 text-white">
              <h2 className="mb-6 text-site-text-28-33 md:mb-10 md:text-site-text-48-57">
                {ourStory.title}
              </h2>
              <Image
                src={`/images/site/About/${ourStory.imageUrl}`}
                alt={ourStory.title || "SimpleTherapy"}
                width={544}
                height={440}
                className="mb-6 block rounded-[40px] object-cover md:hidden"
              />
              <p className="mb-4 text-site-text-16-24 font-light md:mb-8 md:text-site-text-18-27">
                {ourStory["description-line-1"]}
              </p>
              <p className="text-site-text-16-24 font-light md:text-site-text-18-27">
                {ourStory["description-line-2"]}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-site-background-gray py-8 md:py-16 lg:py-28">
        <div className="container text-site-text-blue-2">
          <h2 className="mb-6 text-site-text-28-33 md:mb-4 md:text-site-text-48-57">
            {ourApproach.title}
          </h2>
          <p className="mb-6 text-site-text-16-24 font-light md:text-site-text-24-33">
            {ourApproach.description}
          </p>
          <div className="flex flex-col gap-6">
            {ourApproach.items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-[24px] bg-white py-8 pl-6 pr-7.5 md:flex-row md:gap-6">
                <div className="icon hidden h-16 w-16 items-center justify-center rounded-full bg-site-background-gray p-2.5 md:flex">
                  <Image
                    src={`/images/site/About/${item.icon}`}
                    alt={item.title}
                    width={24}
                    height={24}
                  />
                </div>
                <div className="text-site-text-blue-2">
                  <h3 className="mb:text-site-text-24-33 mb-4 flex flex-row items-center text-site-text-20-28 font-bold md:mb-1 md:block">
                    <div className="icon mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-site-background-gray p-2.5 md:hidden">
                      <Image
                        src={`/images/site/About/${item.icon}`}
                        alt={item.title}
                        width={24}
                        height={24}
                      />
                    </div>
                    {item.title}
                  </h3>
                  <p className="text-site-text-16-24 font-light md:text-site-text-18-27">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white py-8 md:py-17">
        <div className="container grid grid-cols-1 gap-6 text-site-text-blue-2 md:grid-cols-2 md:gap-20">
          <div className="max-w-[523px] self-center">
            <h2 className="mb-8.5 max-w-[330px] text-site-text-32-38 capitalize md:mb-5.5 md:max-w-none md:text-site-text-48-57">
              {caringSection.title}
            </h2>
            <p className="text-site-text-18-26">{caringSection.description}</p>
          </div>
          <Image
            src={`/images/site/About/${caringSection.imageUrl}`}
            alt={caringSection.title}
            width={664}
            height={440}
            className="rounded-[40px] object-cover"
          />
        </div>
      </div>
      <CollToAction
        content={{
          title: collToActionSection.title,
          description: collToActionSection.description,
          buttonText: collToActionSection.buttonText,
          buttonLink: collToActionSection.buttonLink,
          imageBrand: collToActionSection.imageBrand,
        }}
        eventHandler={handleOpenModal}
        classWrapper="bg-site-background-gray"
        classTitle="items-start gap-4"
        classContentWrapper="max-w-[650px]"
        classButton="bg-site-btn-orange text-white hover:bg-site-btn-orange-hover self-start md:self-center w-fit"
      />
    </>
  );
};

export default AboutPageComponent;
