// ** Next, React And Locals Imports
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs.js";
import { GET_CUSTOMER } from "@/Queries/Customers.js";
import { CHANGE_PASSWORD } from "@/Queries/Auth.js";
import { getCustomer } from "@/Redux/slices/customer.js";
import { FormTextField, FormPasswordField } from "@/Helpers/FormFields.js";
import {
  composeValidators,
  isRequired,
  isValidPassword,
} from "@/Helpers/FormValidators.js";
import Sidebar from "@/Components/Profile/Sidebar/Sidebar";
import GreetingsLayout from "@/Components/Profile/GreetingsLayout/GreetingsLayout";
import Toaster from "@/Components/Toaster/Toaster";
import Seo from "@/Components/Seo/Seo";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import useStyles from "@/styles/changePassword.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

// ** Third Party Imports
import { Field, Form } from "react-final-form";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { BsChevronLeft } from "react-icons/bs";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Seo
  const getTitleDescQuery = useQuery(GET_SEO_TITLE_DESCS);

  const getTitleDesc = getTitleDescQuery?.data?.getSeoTitleDescs;

  const titleDesc = getTitleDesc?.find((item) => {
    return item.pageName === "home";
  });

  // Queries
  const { data } = useQuery(GET_CUSTOMER);

  const customerData = data?.getCustomer;

  useEffect(() => {
    if (customerData) {
      dispatch(getCustomer(customerData));
    }
  }, [customerData]);

  const customer = useSelector((state) => state.customer.customer);

  //  Update profile
  const submit = (values) => {
    if (values.newPassword.localeCompare(values.confirmNewPassword) !== 0) {
      ToastStatus("Emoji", "Password doesn't match", "😯");
    } else {
      const valuesObject = {
        id: customer._id,
        password: values.newPassword,
      };

      changePassword({ variables: valuesObject });
    }
  };

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted(data) {
      if (data.changeCustomerPassword.status === 200) {
        ToastStatus("Success", "Password changed");

        setTimeout(() => {
          router.push("/login");
        }, [1500]);
      }
    },
  });

  return (
    <div className={classes.container}>
      <Seo title={"Change Password"} desc={titleDesc?.desc} />
      <Toaster />
      <GreetingsLayout customer={customer} />
      <Divider sx={{ mt: 3 }} />
      <div className={classes.mainContainer}>
        <div className={classes.sidebar}>
          <Sidebar />
        </div>
        <div className={classes.main}>
          <Paper className={classes.form}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              {t("account.changePassword.title")}
            </Typography>
            <Form onSubmit={submit}>
              {({ handleSubmit, invalid }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <div className={classes.formField}>
                    <Field
                      name="newPassword"
                      component={FormPasswordField}
                      validate={composeValidators(isRequired, isValidPassword)}
                      label={t("account.changePassword.newPassword")}
                      helperText={t("account.changePassword.passwordText")}
                    />
                  </div>
                  <div
                    className={classes.formField}
                    style={{ marginTop: "20px" }}
                  >
                    <Field
                      name="confirmNewPassword"
                      type="password"
                      component={FormTextField}
                      validate={composeValidators(isRequired, isValidPassword)}
                      label={t("account.changePassword.confirmPassword")}
                    />
                  </div>
                  <div className={classes.actionBtn}>
                    <PrimaryButton
                      type="submit"
                      text={t("account.changePassword.title")}
                      disabled={invalid}
                      spinner={loading}
                    />
                  </div>
                </form>
              )}
            </Form>
          </Paper>
        </div>
      </div>
      <Link href="/profile/coupons">
        <div className={classes.prevNext}>
          <Typography variant="h5" sx={{ pb: 1 }}>
            <BsChevronLeft fontSize={"0.75em"} />
            {t("account.prev")}
          </Typography>
          <Typography variant="h5"> {t("account.coupons.title")}</Typography>
        </div>
      </Link>
    </div>
  );
}

export { getServerSideProps };
