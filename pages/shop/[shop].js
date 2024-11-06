// ** Next, React And Locals Imports
import { useRouter } from "next/router";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs";
import ShopPage from "@/Components/Shop/Shop";
import Seo from "@/Components/Seo/Seo";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** Third Party Imports
import { useQuery } from "@apollo/client";

export default function Shop() {
  const router = useRouter();

  // Seo
  const getTitleDescQuery = useQuery(GET_SEO_TITLE_DESCS);

  const getTitleDesc = getTitleDescQuery?.data?.getSeoTitleDescs;

  const titleDesc = getTitleDesc?.find((item) => {
    return item.pageName === "shop";
  });

  //Pathname
  const pathname = router.asPath.split("/")[2];

  return (
    <div>
      <Seo title={titleDesc?.title} desc={titleDesc?.desc} />
      <ShopPage pathname={pathname} />
    </div>
  );
}

export { getServerSideProps };
