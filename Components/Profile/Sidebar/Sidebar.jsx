// ** Next, React And Locals Imports
import Link from "next/link";
import { useRouter } from "next/router";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";

// ** Third Party Imports
import { useTranslation } from "next-i18next";

function Sidebar() {
  const { classes } = useStyles();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  const pathname = router.asPath;

  const tabs = [
    { name: t("sidebar.profile"), link: "/profile" },
    { name: t("sidebar.address"), link: "/profile/address" },
    { name: t("sidebar.orders"), link: "/profile/orders" },
    { name: t("sidebar.wishlist"), link: "/profile/wishlist" },
    { name: t("sidebar.coupons"), link: "/profile/coupons" },
    { name: t("sidebar.changePassword"), link: "/profile/change-password" },
  ];

  return (
    <div className={classes.container}>
      <Paper elevation={0}>
        {tabs.map((tab, index) => {
          return (
            <MenuItem
              key={index}
              className={pathname === tab.link && classes.active}
            >
              <Link href={tab.link}>
                <Typography variant="subtitle1">{tab.name}</Typography>
              </Link>
            </MenuItem>
          );
        })}
      </Paper>
    </div>
  );
}

export default Sidebar;
