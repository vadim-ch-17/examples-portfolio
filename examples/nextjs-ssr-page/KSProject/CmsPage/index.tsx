import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import CanonicalLink from "../../../../molecules/CanonicalLink";
import Sections from "../../../../sections";
import { PageProps } from "../../types";
import { useSections } from "./hooks";

const BlogPage = dynamic(() => import("../../../BlogPage"));
const Page = dynamic(() => import("../../../Page"));
const BlogListingPage = dynamic(() => import("../../../BlogListingPage"));

const CmsPage: NextPage<PageProps> = ({
  page,
  banner,
  latestNews,
  blogListingData,
  services,
  storages,
  socialLinks,
  contactForm,
  contactInfo,
  space,
}) => {
  const { __typename } = page;
  const sections = useSections(page.sections);
  const { asPath } = useRouter();

  switch (__typename) {
    case "Page":
      return (
        <Page {...page}>
          <CanonicalLink {...{ url: asPath }} />
          <Sections
            {...{
              sections,
              services,
              storages,
              socialLinks,
              contactForm,
              contactInfo,
              space,
            }}
          />
        </Page>
      );
    case "BlogListingPage":
      return (
        <>
          <CanonicalLink {...{ url: asPath }} />
          <BlogListingPage {...{ ...blogListingData, ...page }} />
        </>
      );
    case "Post":
      return (
        <BlogPage post={page} {...{ banner, latestNews }}>
          <CanonicalLink {...{ url: asPath }} />
          <Sections
            {...{
              sections,
              services,
              storages,
              socialLinks,
              contactForm,
              contactInfo,
              space,
            }}
          />
        </BlogPage>
      );
    default:
      return null;
  }
};

export default CmsPage;
