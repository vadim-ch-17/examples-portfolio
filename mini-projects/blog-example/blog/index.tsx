import BlogLayout from "@/components/site/Layouts/BlogLayout";
import { BlogCardItem } from "@/components/site/parts/BlogCardItem";
import { BlogFilters } from "@/components/site/parts/BlogFilters";
import { CollToAction } from "@/components/site/parts/CollToAction";
import { CollToActionContent } from "@/components/site/parts/CollToAction/types";
import { Pagination } from "@/components/site/parts/Pagination";
import { getPageActiveBySlug } from "@/lib/db/page";
import { postActiveList } from "@/lib/db/post";
import { postCategoryActiveList } from "@/lib/db/postCategory";
import { postTypeActiveList } from "@/lib/db/postType";
import { PageActive } from "@/types/entities/page";
import { SEO } from "@/types/seo";
import { getPostSeoByLocale, setPostContentItem } from "@/utils/blogUtils";
import { useSiteContext } from "@/utils/siteContext";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import type { GetServerSidePropsContext } from "next/types";
import React, { useEffect } from "react";

export default function Blog({
  seo,
  data,
  currentPage,
  totalPages,
  blogFilters,
}: React.HTMLAttributes<HTMLDivElement> & {
  seo: SEO;
  data: any[];
  currentPage: number;
  totalPages: number;
  blogFilters: any;
}) {
  const { setPosts, setOpenModal, setClosingModal } = useSiteContext();
  const { t } = useTranslation("common");
  const handleOpenModal = () => {
    setOpenModal(true);
    setClosingModal(false);
  };
  const collToAction: CollToActionContent = t("Blog.CollToActionSection", {
    returnObjects: true,
  }) as CollToActionContent;
  useEffect(() => {
    setPosts(data);
  }, [data, setPosts]);
  return (
    <>
      <NextSeo
        nofollow={process.env.NEXT_PUBLIC_APP_MODE === "development"}
        noindex={process.env.NEXT_PUBLIC_APP_MODE === "development"}
        title={seo.title}
        description={seo.description}
        openGraph={{
          title: seo.title,
          description: seo.description,
          images: [
            {
              url: seo?.image || "/images/site/logo/SimpleTherapy.svg",
              width: 1200,
              height: 630,
              alt: seo.title,
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
      <div className="container">
        <h1 className="mb-12 text-center md:mb-19">
          <span className="relative mb-2 mr-2 inline-block w-fit text-site-text-32-38 text-site-text-blue-2 sm:mb-0 md:text-site-text-56-67">
            {t("Blog.mainTitle") || "SimpleTherapy"}
          </span>{" "}
          <br className="block sm:hidden" />
          <span className="relative mr-2 inline w-fit text-site-text-32-38 text-site-text-blue-2 before:absolute before:bottom-[-6px] before:right-[0px] before:z-[1] before:h-[7px] before:w-full before:bg-[url('/images/site/PressMedia/decor_2.svg')] before:bg-cover before:bg-no-repeat after:absolute after:right-[-17px] after:top-0.5 after:h-[20px] after:w-[20px] after:bg-[url('/images/site/PressMedia/decor_1.svg')] after:bg-contain after:bg-no-repeat md:text-site-text-56-67 md:before:bottom-[-4px] md:before:h-[13px] md:after:h-[32px] md:after:w-[28px]">
            {t("Blog.mainTitleDecors") || "Resources"}
          </span>
        </h1>
      </div>
      <div className="container !mx-auto !max-w-[1264px]">
        <BlogFilters blogFilters={blogFilters} />
      </div>
      <div
        className={classNames("container !mx-auto !max-w-[1264px]", totalPages <= 1 ? "mb-8 md:mb-16" : "")}>
        <div className="flex flex-wrap justify-center gap-5">
          {data.length ? (
            data.map((item: any) => <BlogCardItem key={item.id} post={item} />)
          ) : (
            <div className="w-full text-center sm:text-site-text-24-33 md:text-site-text-38-38 lg:text-site-text-58-69">
              No posts found
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            page="blog"
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={blogFilters.searchQuery}
            categoryParams={blogFilters.categoryParams}
            typeParams={blogFilters.typeParams}
          />
        )}
      </div>
      <CollToAction
        content={{
          title: collToAction.title,
          description: collToAction.description,
          buttonText: collToAction.buttonText,
          imageBrand: collToAction.imageBrand,
        }}
        eventHandler={handleOpenModal}
        classWrapper="bg-white"
        classContentWrapper="max-w-[650px]"
        classTitle="items-center gap-4"
        classDescription="text-center md:text-left"
        classButton="bg-site-btn-orange text-white hover:bg-site-btn-orange-hover w-full md:w-fit"
      />
    </>
  );
}

Blog.getLayout = function getLayout(page: React.ReactNode) {
  return <BlogLayout>{page}</BlogLayout>;
};
export const getServerSideProps = async ({ res, req, query, locale }: GetServerSidePropsContext) => {
  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");

  const POSTS_PER_PAGE = /mobile/i.test(req.headers["user-agent"] ?? "")
    ? 3
    : Number(process.env.PAGE_SIZE_SITE_PRESS_AND_MEDIA);
  const page = parseInt(query.page as string) || 1;
  const searchQuery = (query.search as string) || "";
  const categoryQuery = (query.postCategory as string) || "";
  const typeQuery = (query.postType as string) || "";

  const [postTypes, postCategories] = await Promise.all([postTypeActiveList(), postCategoryActiveList()]);

  let postsData: { data: any[]; total: number } = { data: [], total: 0 };
  postsData = await postActiveList(
    page,
    POSTS_PER_PAGE,
    locale ?? "en",
    Number(typeQuery) || null,
    Number(categoryQuery) || null,
    String(searchQuery) || null
  );

  const totalPages = Math.ceil(postsData.total / POSTS_PER_PAGE);

  const translations = await serverSideTranslations(locale || "en", ["common"]);

  const data = postsData.data.map(
    (post: any) => setPostContentItem(post, locale || "en", page, false, "/blog", "preview") as any
  );

  const pageData: PageActive | null = await getPageActiveBySlug("blog", locale ?? "en");

  const seo = await getPostSeoByLocale(pageData, locale || "en", "Blog");

  return {
    props: {
      seo: seo,
      ...translations,
      data: !postsData ? [] : data,
      currentPage: page,
      totalPages,
      page,
      blogFilters: {
        blogCategories: postCategories,
        blogTypes: postTypes,
        searchQuery,
        categoryParams: categoryQuery,
        typeParams: typeQuery,
      },
    },
  };
};
