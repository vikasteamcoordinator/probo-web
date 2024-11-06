// ** Next, React And Locals Imports
import { useRouter } from "next/router";
import { LOGOUT } from "@/Queries/Auth.js";
import Greetings from "@/Helpers/Greetings.js";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { FiLogOut } from "react-icons/fi";

function GreetingsLayout({ customer }) {
  const { classes } = useStyles();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  // Logout
  const handleLogout = () => {
    logout();
  };

  const [logout] = useMutation(LOGOUT, {
    onCompleted(data) {
      // Removing all items from local storage
      localStorage.clear();

      router.push("/login");
    },
  });

  return (
    <div className={classes.greetings}>
      <div>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t("greeting.hey")}, {""}
          {customer?.firstName?.length > 0
            ? customer.firstName
            : t("greeting.friend")}
        </Typography>
        {Greetings()}
      </div>
      <div className={classes.logoutBtn} onClick={handleLogout}>
        <SecondaryButton text={t("greeting.logout")} endIcon={<FiLogOut />} />
      </div>
    </div>
  );
}

export default GreetingsLayout;
