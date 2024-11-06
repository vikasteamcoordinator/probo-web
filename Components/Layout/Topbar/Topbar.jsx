// ** Next, React And Locals Imports
import MarqueeTopbar from "./Marquee/MarqueeTopbar";
import SimpleTopbar from "./Simple/SimpleTopbar";

function Topbar({ settings }) {
  return (
    <div>
      {settings?.topbarStyle === "marquee" && (
        <MarqueeTopbar settings={settings} />
      )}
      {settings?.topbarStyle === "simple" && (
        <SimpleTopbar settings={settings} />
      )}
    </div>
  );
}

export default Topbar;
