// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import CustomImage from "@/Components/Image/CustomImage";
import Toaster from "@/Components/Toaster/Toaster";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

// ** Third Party Imports
import {
  FacebookShareButton,
  WhatsappShareButton,
  PinterestShareButton,
} from "react-share";
import { useTranslation } from "next-i18next";
import { FiCopy } from "react-icons/fi";
import { GrClose } from "react-icons/gr";

function Share({ product, modal, handleShare }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const image = product?.images?.[0];

  return (
    <div>
      <Toaster />
      {product && (
        <Modal
          open={modal}
          onClose={handleShare}
          className={classes.socialShare}
        >
          <div className={classes.socialShareCtn}>
            <div className={classes.closeIcon}>
              <GrClose onClick={handleShare} />
            </div>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {t("product.share.title")}
            </Typography>
            <div className={classes.socialIcons}>
              <FacebookShareButton
                url={currentUrl}
                quote={product.title}
                hashtag={`#${process.env.NEXT_PUBLIC_SITE_NAME}`}
              >
                <CustomImage
                  src={`/assets/facebook.png`}
                  alt="facebook logo"
                  width={35}
                  height={35}
                />
              </FacebookShareButton>
              <PinterestShareButton
                url={currentUrl}
                media={image}
                description={product.desc}
              >
                <CustomImage
                  src={`/assets/pinterest.png`}
                  alt="pinterest logo"
                  width={35}
                  height={35}
                />{" "}
              </PinterestShareButton>
              <WhatsappShareButton
                url={currentUrl}
                title={product.title}
                separator="::"
              >
                <CustomImage
                  src={`/assets/whatsapp.png`}
                  alt="whatsapp logo"
                  width={35}
                  height={35}
                />{" "}
              </WhatsappShareButton>
            </div>
            <Typography variant="subtitle1" className={classes.copyLink}>
              {t("product.share.copyText1")}
              <FiCopy
                fontSize={"1.5em"}
                onClick={() => {
                  navigator.clipboard.writeText(currentUrl);

                  ToastStatus("Success", "Link copied");
                }}
              />
              {t("product.share.copyText2")}
            </Typography>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Share;
