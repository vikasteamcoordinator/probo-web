// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import CustomImage from "@/Components/Image/CustomImage";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import useStyles from "./styles.js";

// ** MUI Imports
import Box from "@mui/material/Box";

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
      image.append("<PROFILE_PICTURE>", acceptedFiles[0]);

      const { data } = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "profile-picture",
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
    <div>
      {props.value.includes("googleusercontent") ? (
        <div className={classes.imageContainer}>
          <CustomImage
            src={props.value}
            alt={props.value}
            width={100}
            height={100}
          />
        </div>
      ) : (
        <div className={classes.imageContainer}>
          <CustomImage
            src={process.env.NEXT_PUBLIC_BACKEND_URL + "profile/" + props.value}
            alt={props.value}
            width={100}
            height={100}
          />
        </div>
      )}

      <div className={classes.editOverlaySingle}>
        <CustomImage
          src={"/assets/changeImage.png"}
          alt="change logo"
          width={60}
          height={60}
        />
      </div>
    </div>
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
          <Box className={classes.uploadContainerSingle}>
            <div className={classes.imageContainer}>
              <CustomImage
                src={"/assets/avatar.png"}
                alt="default profile"
                width={100}
                height={100}
              />
            </div>
          </Box>
        )}
      </Box>
      <div onClick={handleLinkClick} className={classes.changeProfileBtn}>
        <SecondaryButton text={t("account.profile.changePicture")} />
      </div>
    </Box>
  );
}

export default DropzoneSingle;
