import ColoredLayout from "@/components/site/Layouts/ColoredLayout";
import DefaultLayout from "@/components/site/Layouts/DefaultLayout";
import SinglePage from "@/components/site/pages/SinglePage";
import { getPageActiveBySlug } from "@/lib/db/page";
import { getAllSlugs, getPostData } from "@/lib/markdown";
import { PageActive } from "@/types/entities/page";
import { SEO } from "@/types/seo";
import { getPageSeoByLocale } from "@/utils/pagesUtils";
import { GetStaticPropsContext, GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

interface DynamicPageProps {
  idx: string;
  post: any;
  seo: SEO;
  allVacancies: {
    title: string;
    contentHtml: string;
    buttonText?: string;
    buttonLink?: string;
  }[];
  pageData: PageActive;
}
type Path = { params: { slug: string }; locale: string };

const DynamicPage = ({ idx, post, seo, allVacancies, pageData }: DynamicPageProps) => {
  const { locale, asPath } = useRouter();

  const canonicalLocale = locale === "default" ? "" : `/${locale}`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${canonicalLocale}${asPath}`;

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <NextSeo
        nofollow={seo?.follow}
        noindex={seo?.index}
        title={seo?.title}
        description={seo?.description}
        openGraph={{
          title: seo?.title,
          description: seo?.description,
          images: [
            {
              url: seo?.image || `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/defaultImage.jpg`,
              width: 1200,
              height: 630,
              alt: seo?.title,
            },
          ],
        }}
        additionalMetaTags={[
          {
            property: "keywords",
            content: seo?.keywords,
          },
        ]}
      />
      <SinglePage idx={idx} post={post} allVacancies={allVacancies} pageDate={pageData} />
    </>
  );
};

const setLayout = (page: React.ReactNode): JSX.Element => {
  const Layout: { [key: string]: JSX.Element } = {
    contact: <ColoredLayout>{page}</ColoredLayout>,
    testimonials: <ColoredLayout>{page}</ColoredLayout>,
    holidayGreetings: (
      <ColoredLayout bgColor="bg-secondary" paddingTop="pt-[90px] md:pt-[150px]">
        {page}
      </ColoredLayout>
    ),
  };

  if (typeof page === "object" && (page as React.ReactElement)?.props?.idx) {
    return Layout[(page as React.ReactElement)?.props?.idx] ? (
      Layout[(page as React.ReactElement)?.props?.idx]
    ) : (
      <DefaultLayout>{page}</DefaultLayout>
    );
  }

  return <DefaultLayout>{page}</DefaultLayout>;
};

DynamicPage.getLayout = (page: React.ReactNode) => setLayout(page);

export async function getServerSideProps({ res, params, locale }: GetServerSidePropsContext) {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
  const translations = await serverSideTranslations(locale || "en", ["common"]);

  let postData = null;

  if (!params || !params.slug) {
    return { notFound: true };
  }

  let pageData: PageActive | null = await getPageActiveBySlug(params.slug.toString(), locale ?? "en");

  const postMdContent = getAllSlugs("public/resources", locale || "en");

  if (postMdContent.includes(params.slug.toString())) {
    postData = await getPostData("public/resources", params.slug.toString(), locale || "en");
  }

  const allVacanciesSlugs = getAllSlugs("public/vacancies", locale || "en");

  const allVacancies = await Promise.all(
    allVacanciesSlugs.map(async (slug) => {
      return await getPostData("public/vacancies", slug || "", locale || "en");
    })
  );
  const serializingPageData = pageData && {
    ...pageData,
    updatedAt: pageData?.updatedAt?.toISOString(),
  };
  const seo = await getPageSeoByLocale(pageData, locale || "en", "Page");

  const pageIdx = "sitemap.xml" === params.slug ? "sitemap" : pageData?.name || null;

  return {
    props: {
      slug: params.slug || null,
      idx: pageIdx,
      ...translations,
      post: postData,
      seo: seo,
      pageData: serializingPageData,
      allVacancies: allVacancies,
    },
  };
}

export default DynamicPage;
