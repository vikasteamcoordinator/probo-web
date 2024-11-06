// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs.js";
import { GET_STATIC_PAGES } from "@/Queries/StaticPages.js";
import CapitalizeText from "@/Helpers/CapitalizeText";
import Seo from "@/Components/Seo/Seo";
import useStyles from "@/styles/static-pages.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { useQuery } from "@apollo/client";

export default function StaticPage() {
  const router = useRouter();
  const { classes } = useStyles();

  // Seo
  const getTitleDescQuery = useQuery(GET_SEO_TITLE_DESCS);

  const getTitleDesc = getTitleDescQuery?.data?.getSeoTitleDescs;

  const titleDesc = getTitleDesc?.find((item) => {
    return item.pageName === "home";
  });

  // Queries
  const { data, loading } = useQuery(GET_STATIC_PAGES);

  const [pageName, setPageName] = useState("");
  const [pageContent, setPageContent] = useState("");

  useEffect(() => {
    const pageName = window.location.pathname.split("/")[2];

    const currentPage = data?.getStaticPages.find((item) => {
      return item.pageName === pageName;
    });

    if (!loading) {
      if (currentPage) {
        setPageName(currentPage.pageName);
        setPageContent(currentPage.pageContent);
      } else {
        router.push("/404");
      }
    }
  }, [data, router.asPath]);

  return (
    <div className={classes.container}>
      <Seo
        title={pageName && CapitalizeText(pageName.replaceAll("-", " "))}
        desc={titleDesc?.desc}
      />
      <div className={classes.content}>
        <Typography variant="h1" sx={{ mb: 5 }}>
          {pageName.replaceAll("-", " ").toUpperCase()}
        </Typography>
        <Typography
          variant="subtitle1"
          dangerouslySetInnerHTML={{
            __html: pageContent,
          }}
        />
      </div>
    </div>
  );
}

export { getServerSideProps };
