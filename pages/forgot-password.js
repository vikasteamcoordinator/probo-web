// ** Next, React And Locals Imports
import { FormTextField } from "@/Helpers/FormFields.js";
import {
  composeValidators,
  isRequired,
  isValidEmail,
} from "@/Helpers/FormValidators.js";
import { GET_SITE_SETTINGS } from "@/Queries/SiteSettings.js";
import { FORGOT_PASSWORD } from "@/Queries/Auth.js";
import Toaster from "@/Components/Toaster/Toaster";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import CustomImage from "@/Components/Image/CustomImage";
import CustomLink from "@/Components/Link/CustomLink";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import useStyles from "@/styles/passwordReset.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

// ** Third Party Imports
import { Form, Field } from "react-final-form";
import { useQuery, useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { FiUnlock } from "react-icons/fi";

export default function ForgotPassword() {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Queries
  const siteSettingsQuery = useQuery(GET_SITE_SETTINGS);

  const siteSettingsData = siteSettingsQuery?.data?.getSiteSettings;

  const websiteLogo = siteSettingsData?.logo;

  // Handle password change
  const submit = (values) => {
    forgotPassword({ variables: values });
  };

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD, {
    onCompleted(data) {
      if (data.forgotPassword.status === 200) {
        ToastStatus("Success", data.forgotPassword.message);
      } else {
        ToastStatus("Error", data.forgotPassword.message);
      }
    },
  });

  return (
    <div>
      <Toaster />
      <div className={classes.bgImg}></div>
      <Paper className={classes.form}>
        <div>
          {websiteLogo && (
            <CustomImage
              src={process.env.NEXT_PUBLIC_BACKEND_URL + "logos/" + websiteLogo}
              alt="website logo"
              width={130}
              height={50}
            />
          )}
        </div>
        <div className={classes.content}>
          <div>
            <Typography variant="h4" sx={{ pt: 2 }}>
              {t("forgotPassword.title")} 🤔
            </Typography>
          </div>
          <Typography variant="subtitle1" sx={{ pt: 1 }} align="left">
            {t("forgotPassword.text")}
          </Typography>
        </div>
        <Form onSubmit={submit}>
          {({ handleSubmit, invalid }) => (
            <form noValidate onSubmit={handleSubmit}>
              <div className={classes.formField}>
                <Field
                  name="email"
                  component={FormTextField}
                  validate={composeValidators(isRequired, isValidEmail)}
                  label={t("forgotPassword.form.email")}
                />
              </div>
              <div className={classes.actionBtn}>
                <PrimaryButton
                  type="submit"
                  text={t("forgotPassword.form.send")}
                  disabled={invalid}
                  fullWidth={true}
                  endIcon={<FiUnlock />}
                  spinner={loading}
                />
              </div>
              <Typography variant="subtitle1">
                <CustomLink
                  href="/login"
                  text={t("forgotPassword.login")}
                  color={true}
                  hover={true}
                />
              </Typography>
            </form>
          )}
        </Form>
      </Paper>
    </div>
  );
}

export { getServerSideProps };
