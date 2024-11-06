// ** Next, React And Locals Imports
import Layout1 from "./Layout1/Layout1.jsx";
import Layout2 from "./Layout2/Layout2.jsx";

function Footer({ settings, productSettings, desc }) {
  const footerType = settings?.footerLayout;

  const categories = productSettings?.categories;

  const socials = settings?.socials;

  const websiteLogo = settings?.logo;

  return (
    <div id="turnOffCart">
      {footerType === "footerType1" && (
        <Layout1
          categories={categories}
          socials={socials}
          websiteLogo={websiteLogo}
          desc={desc}
        />
      )}
      {footerType === "footerType2" && (
        <Layout2 categories={categories} socials={socials} />
      )}
    </div>
  );
}

export default Footer;
