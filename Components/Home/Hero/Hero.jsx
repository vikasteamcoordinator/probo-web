// ** Next, React And Locals Imports
import Skeletons from "@/Components/Skeletons/Skeletons";
import Layout1 from "./Layout1/Layout1";
import Layout2 from "./Layout2/Layout2";
import Layout3 from "./Layout3/Layout3";

function Hero({ settings, loading }) {
  const heroType = settings?.heroType;

  return (
    <div>
      {!loading ? (
        <>
          {/* Hero Layouts */}
          {heroType === "heroType1" && <Layout1 settings={settings} />}
          {heroType === "heroType2" && <Layout2 settings={settings} />}
          {heroType === "heroType3" && <Layout3 settings={settings} />}
        </>
      ) : (
        <Skeletons type="hero" />
      )}
    </div>
  );
}

export default Hero;
