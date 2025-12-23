import BlogItemPostLayout from "@/components/site/Layouts/BlogItemPostLayout";
import {
  BlogPodcastMain,
  BlogPostMain,
  BlogVideoMain,
} from "@/components/site/parts/BlogMainSections";
import SuggestedPosts from "@/components/site/parts/SuggestedPosts";
import { getPostActiveBySlug, postSuggestedActiveList } from "@/lib/db/post";
import { PostContainer } from "@/styles/site/posts/style-blog";
import { PostActive } from "@/types/entities/post";
import { getPostSeoByLocale, setPostContentItem } from "@/utils/blogUtils";
import parse from "html-react-parser";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

interface BlogPostProps {
  post: Post;
  posts: Post[];
  seo: any;
}

interface Post {
  title: string;
  body: string;
  date: string;
  typeId: number;
  image: string;
  video?: string;
  customFields?: { name: string; value: string }[];
}

const BlogPost = ({ post, posts, seo }: BlogPostProps) => {
  const { locale, asPath } = useRouter();
  const { title, body, date, typeId, image, video, customFields } = post;
  const parseOrSplitContent = (content: string) => {
    return parse(content, {
      replace: (domNode) => {
        if (
          domNode.type === "tag" &&
          domNode.attribs &&
          domNode.attribs.style
        ) {
          domNode.attribs.style = "";
        }
        return domNode;
      },
    });
  };
  const canonicalLocale = locale === "default" ? "" : `/${locale}`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${canonicalLocale}${asPath}`;

  const MainSection: { [key: number]: JSX.Element } = {
    2: <BlogPostMain title={title} dupdated_atate={date} photo_url={image} />,
    6: (
      <BlogVideoMain
        title={title}
        dupdated_atate={date}
        photo_url={image}
        video={video || ""}
      />
    ),
    4: (
      <BlogPodcastMain
        title={title}
        dupdated_atate={date}
        photo_url={image}
        audio={{
          url:
            customFields?.find((item) => item.name === "episode_audio")
              ?.value || "",
          podcastTitle:
            customFields?.find((item) => item.name === "episode_title")
              ?.value || "Podcast Title",
          podcastName:
            customFields?.find((item) => item.name === "podcast_name")?.value ||
            "Podcast Name",
          podcastImage:
            customFields?.find((item) => item.name === "podcast_image")
              ?.value || "",
        }}
      />
    ),
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
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
              url: seo?.image || image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
          type: "article",
          article: {
            publishedTime: date,
            modifiedTime: date,
            authors: ["Simple Therapy"],
            tags: ["Simple Therapy", "Blog"],
          },
        }}
        additionalMetaTags={[
          {
            property: "keywords",
            content: seo?.keywords,
          },
        ]}
      />
      <div className="container pb-8 md:pb-16">
        {MainSection[typeId] || MainSection[2]}
        <PostContainer>{parseOrSplitContent(body)}</PostContainer>
        {typeId === 4 &&
          customFields?.find((item) => item.name === "episode_transcript")
            ?.value && (
            <div>
              <h2 className="mb-4 text-site-text-24-33">Transcript</h2>
              <div className="mb-4 max-h-[521px] overflow-y-auto bg-site-background-white p-6 text-site-text-12-24 font-light">
                {
                  customFields?.find(
                    (item) => item.name === "episode_transcript"
                  )?.value
                }
              </div>
            </div>
          )}
      </div>
      {posts.length ? <SuggestedPosts posts={posts} /> : null}
    </>
  );
};

BlogPost.getLayout = function getLayout(page: React.ReactNode) {
  return <BlogItemPostLayout>{page}</BlogItemPostLayout>;
};
export async function getServerSideProps(context: any) {
  const { res, params, locale, query } = context;
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const postSlug = params.slug;
  const page = Number(query.page) || 1;

  const postData: PostActive | null = await getPostActiveBySlug(
    postSlug,
    locale ?? "en"
  );

  if (!postData) {
    return {
      redirect: {
        destination: `/${locale ?? "en"}/404`,
        permanent: false,
      },
    };
  }
  const suggestedPosts: PostActive[] = await postSuggestedActiveList(
    Number(process.env.PAGE_SIZE_SITE_PRESS_AND_MEDIA),
    locale ?? "en",
    null,
    postSlug
  );

  const posts = suggestedPosts.map((item: any) =>
    setPostContentItem(item, locale, page, false, "/blog")
  );

  const translations = await serverSideTranslations(locale || "en", ["common"]);
  const seo = await getPostSeoByLocale(postData, locale, "Blog");

  return {
    props: {
      seo: seo,
      post: setPostContentItem(postData, locale, page, true, "/blog", "main"),
      ...translations,
      posts: posts,
    },
  };
}

export default BlogPost;
