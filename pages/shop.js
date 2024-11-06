// ** Next, React And Locals Imports
import ShopPage from "@/Components/Shop/Shop";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs";
import Seo from "@/Components/Seo/Seo";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** Third Party Imports
import { useQuery } from "@apollo/client";

export default function Shop() {
  // Seo
  const getTitleDescQuery = useQuery(GET_SEO_TITLE_DESCS);

  const getTitleDesc = getTitleDescQuery?.data?.getSeoTitleDescs;

  const titleDesc = getTitleDesc?.find((item) => {
    return item.pageName === "shop";
  });

  return (
    <div>
      <Seo title={titleDesc?.title} desc={titleDesc?.desc} />
      <ShopPage />
    </div>
  );
}

export { getServerSideProps };
