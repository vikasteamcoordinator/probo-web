// ** Next, React And Locals Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FormPasswordField, FormTextField } from "@/Helpers/FormFields.js";
import {
  composeValidators,
  isRequired,
  isValidPassword,
} from "@/Helpers/FormValidators.js";
import { GET_SITE_SETTINGS } from "@/Queries/SiteSettings";
import { CHECK_RESET_TOKEN, RESET_PASSWORD } from "@/Queries/Auth.js";
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

export default function ResetPassword() {
  const { classes } = useStyles();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  // Queries
  const siteSettingsQuery = useQuery(GET_SITE_SETTINGS);

  const siteSettingsData = siteSettingsQuery?.data?.getSiteSettings;

  const websiteLogo = siteSettingsData?.logo;

  // Token
  const [token, setToken] = useState("");
  const resetToken = router.asPath.split("/")[2].split("=")[1];

  const [checkResetToken, { loading: checkPasswordLoading }] = useMutation(
    CHECK_RESET_TOKEN,
    {
      onCompleted(data) {
        if (data.checkResetToken.status === 200) {
          setToken(true);
        } else {
          setToken(false);
          router.push("/404");
        }
      },
    }
  );

  useEffect(() => {
    if (token === "" && resetToken !== undefined) {
      checkResetToken({ variables: { token: resetToken } });
    }
  }, [token, resetToken]);

  // Handle password change
  const submit = (values) => {
    if (values.newPassword.localeCompare(values.confirmNewPassword) !== 0) {
      ToastStatus("Emoji", "Password doesn't match", "😯");
    } else {
      const valuesObject = {
        password: values.newPassword,
        token: resetToken,
      };
      resetPassword({ variables: valuesObject });
    }
  };

  const [resetPassword, { loading: resetPasswordLoading }] = useMutation(
    RESET_PASSWORD,
    {
      onCompleted(data) {
        if (data.updatePassword.status === 200) {
          ToastStatus("Success", data.updatePassword.message);

          setTimeout(() => {
            router.push("/login");
          }, [1500]);
        } else {
          ToastStatus("Error", data.updatePassword.message);
        }
      },
    }
  );

  return (
    <div>
      <Toaster />
      {!checkPasswordLoading && token && (
        <>
          <div className={classes.bgImg}></div>
          <Paper className={classes.form}>
            <div>
              {websiteLogo && (
                <CustomImage
                  src={
                    process.env.NEXT_PUBLIC_BACKEND_URL + "logos/" + websiteLogo
                  }
                  alt="website logo"
                  width={130}
                  height={50}
                />
              )}
            </div>
            <div className={classes.content}>
              <div>
                <Typography variant="h4" sx={{ pt: 2 }}>
                  {t("resetPassword.title")}
                </Typography>
              </div>
              <Typography variant="subtitle1" sx={{ pt: 1 }} align="left">
                {t("resetPassword.text")}
              </Typography>
            </div>
            <Form onSubmit={submit}>
              {({ handleSubmit, invalid }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <div className={classes.formField}>
                    <Field
                      name="newPassword"
                      component={FormPasswordField}
                      validate={composeValidators(isRequired, isValidPassword)}
                      label={t("resetPassword.form.password1")}
                    />
                  </div>
                  <div className={classes.formField}>
                    <Field
                      name="confirmNewPassword"
                      type="password"
                      component={FormTextField}
                      validate={composeValidators(isRequired, isValidPassword)}
                      label={t("resetPassword.form.password2")}
                    />
                  </div>
                  <div className={classes.actionBtn}>
                    <PrimaryButton
                      type="submit"
                      text={t("resetPassword.form.update")}
                      disabled={invalid}
                      fullWidth={true}
                      spinner={resetPasswordLoading}
                    />
                  </div>
                  <div>
                    <Typography variant="subtitle1" sx={{ pt: 2 }}>
                      <CustomLink
                        href="/login"
                        text={t("resetPassword.login")}
                        color={true}
                        hover={true}
                      />
                    </Typography>
                  </div>
                </form>
              )}
            </Form>
          </Paper>
        </>
      )}
    </div>
  );
}

export { getServerSideProps };
