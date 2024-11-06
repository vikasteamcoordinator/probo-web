// ** Next, React And Locals Imports
import { useRouter } from "next/router";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs";
import { GET_SITE_SETTINGS } from "@/Queries/SiteSettings";
import { AUTH_REGISTER } from "@/Queries/Auth.js";
import { FormTextField, FormPasswordField } from "@/Helpers/FormFields.js";
import {
  composeValidators,
  isValidEmail,
  isValidPassword,
  isRequired,
} from "@/Helpers/FormValidators.js";
import Toaster from "@/Components/Toaster/Toaster";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import CustomLink from "@/Components/Link/CustomLink";
import CustomImage from "@/Components/Image/CustomImage";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import Seo from "@/Components/Seo/Seo";
import useStyles from "@/styles/register.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";

// ** Third Party Imports
import { useQuery, useMutation } from "@apollo/client";
import { Form, Field } from "react-final-form";
import { useTranslation } from "next-i18next";

export default function Register() {
  const { classes } = useStyles();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  // Seo
  const getTitleDescQuery = useQuery(GET_SEO_TITLE_DESCS);

  const getTitleDesc = getTitleDescQuery?.data?.getSeoTitleDescs;

  const titleDesc = getTitleDesc?.find((item) => {
    return item.pageName === "register";
  });

  // Queries
  const siteSettingsQuery = useQuery(GET_SITE_SETTINGS);

  const siteSettingsData = siteSettingsQuery?.data?.getSiteSettings;

  const websiteLogo = siteSettingsData?.logo;

  // Handle register
  const submit = (values) => {
    authRegister({ variables: values });
  };

  const [authRegister, { loading }] = useMutation(AUTH_REGISTER, {
    onCompleted(data) {
      if (data.authRegister.status === 201) {
        // Removing all items from local storage
        localStorage.clear();

        router.push("/");
      } else {
        ToastStatus("Error", data.authRegister.message);
      }
    },
  });

  // Google login
  const handleGoogle = async () => {
    window.open(process.env.NEXT_PUBLIC_BACKEND_URL + "auth/google", "_self");
  };

  return (
    <div className={classes.container}>
      <Seo title={titleDesc?.title} desc={titleDesc?.desc} />
      <Toaster />
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
        <Typography variant="h4" sx={{ mt: 4 }}>
          {t("register.welcome.title")}
        </Typography>
        <Form onSubmit={submit}>
          {({ handleSubmit, invalid }) => (
            <form noValidate onSubmit={handleSubmit}>
              <div className={classes.formField}>
                <Field
                  name="email"
                  component={FormTextField}
                  validate={composeValidators(isRequired, isValidEmail)}
                  label={t("register.form.email")}
                />
              </div>
              <div className={classes.formField}>
                <Field
                  name="password"
                  component={FormPasswordField}
                  validate={composeValidators(isRequired, isValidPassword)}
                  label={t("register.form.password")}
                />
              </div>
              <div style={{ textAlign: "left" }}>
                <Typography variant="subtitle2" sx={{ pt: 1 }}>
                  {t("register.terms.text1")}{" "}
                  <CustomLink
                    href="/static/terms-and-conditions"
                    text={t("register.terms.text2")}
                    color={true}
                    hover={true}
                  />
                  , {t("register.terms.text3")}{" "}
                  <CustomLink
                    href="/static/privacy-policy"
                    text={t("register.terms.text4")}
                    color={true}
                    hover={true}
                  />
                  .
                </Typography>
              </div>
              <div className={classes.actionBtn}>
                <PrimaryButton
                  type="submit"
                  text={t("register.form.register")}
                  disabled={invalid}
                  fullWidth={true}
                  spinner={loading}
                />
              </div>
            </form>
          )}
        </Form>
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          {t("register.signIn.text1")}{" "}
          <CustomLink
            href="/login"
            text={t("register.signIn.text2")}
            color={true}
            hover={true}
          />
        </Typography>
        <Divider variant="fullWidth" textAlign="center" light="false">
          {t("register.signIn.text3")}
        </Divider>
        <div className={classes.actionBtn} onClick={handleGoogle}>
          <SecondaryButton
            text={t("register.google.text")}
            fullWidth={true}
            startIcon={
              <Avatar
                src={"/assets/google.png"}
                sx={{ width: 30, height: 30 }}
              />
            }
          />
        </div>
      </Paper>
    </div>
  );
}

export { getServerSideProps };
