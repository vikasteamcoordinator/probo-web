// ** Next, React And Locals Imports
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

function Seo({ title, desc, image }) {
  const router = useRouter();

  // States
  const [pageTitle, setPageTitle] = useState(title);

  const pageDesc = desc
    ? desc
    : "Fabyoh is a NextJs Based Seo Optimized Readymade eCommerce Script With Advanced Features Built For Small Business Owners And Entrepreneurs";

  // Canonical link
  const canonicalLink =
    process.env.NEXT_PUBLIC_CLIENT_URL + router.asPath.slice(1);

  // Favicon
  const siteSettings = useSelector((state) => state.siteSettings.siteSettings);

  const favicon = siteSettings?.favicon
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL + "logos/" + siteSettings.favicon}`
    : "/favicon.png";

  // Image
  const metaImage =
    image && `${process.env.NEXT_PUBLIC_BACKEND_URL + "product/" + image}`;

  // Set title when component mounts
  useEffect(() => {
    setPageTitle(title || "Fabyoh - Readymade Ecommerce Script");
  }, [title]);

  // Dynamic tab change
  useEffect(() => {
    const attentionMessage = "Come Back⚡";

    const dynamicTabChange = () => {
      var isPageActive = !document.hidden;

      if (!isPageActive) {
        setPageTitle(attentionMessage);
      } else {
        setPageTitle(title || "Fabyoh - Readymade Ecommerce Script");
      }
    };

    window.addEventListener("visibilitychange", dynamicTabChange);

    return () => {
      window.removeEventListener("visibilitychange", dynamicTabChange);
    };
  }, [title]);

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <link rel="canonical" href={canonicalLink} />
      <link rel="icon" href={favicon} />
      {/* Open Graph meta tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={canonicalLink} />
      {metaImage && <meta property="og:image" content={metaImage} />}
      {/* Twitter Card meta tags */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:url" content={canonicalLink} />
      {metaImage && <meta name="twitter:image" content={metaImage} />}
    </Head>
  );
}

export default Seo;
