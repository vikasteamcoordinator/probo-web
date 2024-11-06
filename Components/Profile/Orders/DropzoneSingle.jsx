// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import Link from "next/link";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import CustomImage from "@/Components/Image/CustomImage";
import useStyles from "./styles.js";

// ** MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useTranslation } from "next-i18next";

function DropzoneSingle(props) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Image path
  const [imagePath, setImagePath] = useState("");

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: "image/*",
    maxSize: 1000000,
    onDrop: async (acceptedFiles) => {
      let image = new FormData();
      image.append("<REVIEW_MEDIA>", acceptedFiles[0]);

      const { data } = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "review-media",
        image
      );

      setImagePath(data);

      const path = data.path.split("/")[3];

      if (props.onChange) {
        props.onChange(path);
      }
    },
    onDropRejected: () => {
      ToastStatus(
        "Error",
        "You can only upload a file of maximum size of 1 MB."
      );
    },
  });

  useEffect(() => {
    acceptedFiles.length < 1 && props.value && setImagePath(props.value);
  }, [acceptedFiles, props.value]);

  const img = (
    <>
      <div className={classes.previewImgSingle}>
        <CustomImage
          src={process.env.NEXT_PUBLIC_BACKEND_URL + "reviews/" + props.value}
          alt="review"
          fill={true}
        />
        <div className={classes.editOverlaySingle}>
          <CustomImage
            src={"/assets/changeImage.png"}
            alt="change logo"
            width={80}
            height={80}
          />
        </div>
      </div>
    </>
  );

  const handleLinkClick = (event) => {
    event.preventDefault();
  };

  return (
    <Box {...getRootProps()}>
      <input {...getInputProps()} />
      <Box className={classes.dropZoneSingle}>
        {imagePath ? (
          img
        ) : (
          <div>
            <CustomImage
              src={"/assets/uploadImage.png"}
              alt="upload icon"
              width={50}
              height={50}
            />
            <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
              {t("account.review.dropzoneText1")}{" "}
              <Link href="/" onClick={handleLinkClick}>
                {t("account.review.dropzoneText2")}
              </Link>{" "}
              {t("account.review.dropzoneText3")}
            </Typography>
          </div>
        )}
      </Box>
    </Box>
  );
}

export default DropzoneSingle;
