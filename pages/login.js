// ** Next, React And Locals Imports
import { useRouter } from "next/router";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs.js";
import { GET_SITE_SETTINGS } from "@/Queries/SiteSettings.js";
import { AUTH_LOGIN } from "@/Queries/Auth.js";
import { isRequired } from "@/Helpers/FormValidators.js";
import { FormTextField, FormPasswordField } from "@/Helpers/FormFields.js";
import Seo from "@/Components/Seo/Seo";
import Toaster from "@/Components/Toaster/Toaster";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import CustomImage from "@/Components/Image/CustomImage";
import CustomLink from "@/Components/Link/CustomLink";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import useStyles from "@/styles/login.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";

// ** Third Party Imports
import { Form, Field } from "react-final-form";
import { useQuery, useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";

export default function Login() {
  const { classes } = useStyles();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  // Seo
  const getTitleDescQuery = useQuery(GET_SEO_TITLE_DESCS);

  const getTitleDesc = getTitleDescQuery?.data?.getSeoTitleDescs;

  const titleDesc = getTitleDesc?.find((item) => {
    return item.pageName === "login";
  });

  // Queries
  const siteSettingsQuery = useQuery(GET_SITE_SETTINGS);

  const siteSettingsData = siteSettingsQuery?.data?.getSiteSettings;

  const websiteLogo = siteSettingsData?.logo;

  // Handle login
  const submit = (values) => {
    authLogin({ variables: values });
  };

  const [authLogin, { loading }] = useMutation(AUTH_LOGIN, {
    onCompleted(data) {
      if (data.authLogin.status === 200) {
        // Removing all items from local storage
        localStorage.clear();

        router.push("/");
      } else {
        ToastStatus("Error", data.authLogin.message);
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
          {t("login.welcome.title")}
        </Typography>
        <Form onSubmit={submit}>
          {({ handleSubmit, invalid }) => (
            <form noValidate onSubmit={handleSubmit}>
              <div className={classes.formField}>
                <Field
                  name="email"
                  component={FormTextField}
                  validate={isRequired}
                  label={t("login.form.email")}
                />
              </div>
              <div className={classes.formField}>
                <Field
                  name="password"
                  component={FormPasswordField}
                  validate={isRequired}
                  label={t("login.form.password")}
                />
              </div>
              <Typography variant="subtitle1" sx={{ textAlign: "right" }}>
                <CustomLink
                  href="/forgot-password"
                  text={t("login.form.forgotPassword")}
                  color={true}
                  hover={true}
                />
              </Typography>
              <div className={classes.actionBtn}>
                <PrimaryButton
                  type="submit"
                  text={t("login.form.login")}
                  disabled={invalid}
                  fullWidth={true}
                  spinner={loading}
                />
              </div>
            </form>
          )}
        </Form>
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          {t("login.signUp.text1")}{" "}
          <CustomLink
            href="/register"
            text={t("login.signUp.text2")}
            color={true}
            hover={true}
          />
        </Typography>
        <Divider variant="fullWidth" textAlign="center" light={false}>
          {t("login.signUp.text3")}
        </Divider>
        <div className={classes.actionBtn} onClick={handleGoogle}>
          <SecondaryButton
            type="submit"
            text={t("login.google.text")}
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
