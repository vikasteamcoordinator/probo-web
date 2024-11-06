// ** Next, React And Locals Imports
import { useState } from "react";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs.js";
import Seo from "@/Components/Seo/Seo";
import ContactForm from "@/Components/Help/ContactForm";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import CustomImage from "@/Components/Image/CustomImage";
import useStyles from "@/Components/Help/styles.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";

// ** Third Party Imports
import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";

export default function Help() {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Seo
  const getTitleDescQuery = useQuery(GET_SEO_TITLE_DESCS);

  const getTitleDesc = getTitleDescQuery?.data?.getSeoTitleDescs;

  const titleDesc = getTitleDesc?.find((item) => {
    return item.pageName === "help";
  });

  const [modal, setModal] = useState(false);

  const handleModal = () => {
    setModal(!modal);
  };

  // To open tidio chat
  const openTidioChat = () => {
    window.tidioChatApi.open();
  };

  return (
    <div className={classes.container}>
      <Seo title={titleDesc?.title} desc={titleDesc?.desc} />
      <div className={classes.intro}>
        <div className={classes.introContent}>
          <Typography variant="h1">{t("help.title")}</Typography>
        </div>
      </div>
      <div className={classes.reachOut}>
        <Typography variant="h3">{t("help.reachOut.title")}</Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          {t("help.reachOut.content")}
        </Typography>
      </div>
      <div className={classes.grids}>
        <Grid container spacing={5} justifyContent="center">
          <Grid item lg={4} sm={6} xs={12}>
            <div className={classes.card}>
              <CustomImage
                src={"/assets/contact-email.png"}
                alt="email us"
                width={60}
                height={60}
              />
              <Typography variant="h4" sx={{ pt: 1 }}>
                {t("help.mail.title")}
              </Typography>
              <Typography variant="subtitle1" sx={{ pt: 1 }}>
                {t("help.mail.text")}
              </Typography>
              <div onClick={handleModal} className={classes.btn}>
                <SecondaryButton
                  text={t("help.mail.button")}
                  fullWidth={false}
                />
              </div>
              <Modal open={modal}>
                <ContactForm handleClose={handleModal} />
              </Modal>
            </div>
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <div className={classes.card}>
              <CustomImage
                src={"/assets/contact-twitter.png"}
                alt="twitter logo"
                width={60}
                height={60}
              />
              <Typography variant="h4" sx={{ pt: 1 }}>
                {t("help.social.title")}
              </Typography>
              <Typography variant="subtitle1" sx={{ pt: 1 }}>
                {t("help.social.text")}
              </Typography>
              <div className={classes.btn}>
                <SecondaryButton
                  href={process.env.NEXT_PUBLIC_CLIENT_SOCIAL_SUPPORT}
                  text={t("help.social.button")}
                  target={"_blank"}
                  fullWidth={false}
                />
              </div>
            </div>
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <div className={classes.card}>
              <CustomImage
                src={"/assets/liveChat.png"}
                alt="live chat"
                width={60}
                height={60}
              />
              <Typography variant="h4" sx={{ pt: 1 }}>
                {t("help.chat.title")}
              </Typography>
              <Typography variant="subtitle1" sx={{ pt: 1 }}>
                {t("help.chat.text")}
              </Typography>
              <div className={classes.btn} onClick={() => openTidioChat()}>
                <SecondaryButton
                  text={t("help.chat.button")}
                  fullWidth={false}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export { getServerSideProps };
