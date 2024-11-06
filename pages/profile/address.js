// ** Next, React And Locals Imports
import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs.js";
import { GET_CUSTOMER, CUSTOMERS } from "@/Queries/Customers.js";
import { getCustomer } from "@/Redux/slices/customer.js";
import { FormTextField } from "@/Helpers/FormFields.js";
import {
  composeValidators,
  isRequired,
  isValidPincode,
} from "@/Helpers/FormValidators.js";
import Sidebar from "@/Components/Profile/Sidebar/Sidebar";
import GreetingsLayout from "@/Components/Profile/GreetingsLayout/GreetingsLayout";
import Seo from "@/Components/Seo/Seo";
import Toaster from "@/Components/Toaster/Toaster";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import useStyles from "@/styles/addressSettings.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

// ** Third Party Imports
import { Field, Form } from "react-final-form";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export default function Address() {
  const dispatch = useDispatch();
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

  // Customer address
  const address = customer?.address;

  //  Update profile
  const submit = (values) => {
    const address = {
      address1: values.address1,
      address2: values.address2,
      city: values.city,
      state: values.state,
      country: values.country,
      postal_code: values.postal_code,
    };

    const valuesObject = {
      id: customer._id,
      email: customer.email,
      address,
    };

    updateUser({ variables: valuesObject });
  };

  const [updateUser, { loading }] = useMutation(CUSTOMERS, {
    onCompleted(data) {
      if (data.customers.status === 200) {
        dispatch(getCustomer(data.customers));
        ToastStatus("Success", "Address updated");
      } else {
        ToastStatus("Error", "Error Occurred");
      }
    },
  });

  return (
    <div className={classes.container}>
      <Seo title={"Edit Address"} desc={titleDesc?.desc} />
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
              {t("account.address.title")}
            </Typography>
            <Form onSubmit={submit} initialValues={address}>
              {({ handleSubmit, invalid }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <div className={classes.formField}>
                    <Field
                      name="address1"
                      component={FormTextField}
                      validate={isRequired}
                      label={t("account.form.address")}
                      required={true}
                      placeholder={t("account.form.address")}
                    />
                  </div>
                  <div
                    className={classes.formField}
                    style={{ marginTop: "30px" }}
                  >
                    <Field
                      name="address2"
                      component={FormTextField}
                      label={t("account.form.landmark")}
                      placeholder={t("account.form.landmark")}
                    />
                  </div>
                  <div className={classes.formFields}>
                    <div className={classes.formField}>
                      <Field
                        name="city"
                        component={FormTextField}
                        validate={isRequired}
                        label={t("account.form.city")}
                        required={true}
                      />
                    </div>
                    <div className={classes.formField}>
                      <Field
                        name="state"
                        component={FormTextField}
                        validate={isRequired}
                        label={t("account.form.state")}
                        required={true}
                      />
                    </div>
                  </div>
                  <div className={classes.formFields}>
                    <div className={classes.formField}>
                      <Field
                        name="country"
                        component={FormTextField}
                        validate={isRequired}
                        label={t("account.form.country")}
                        required={true}
                      />
                    </div>
                    <div className={classes.formField}>
                      <Field
                        name="postal_code"
                        component={FormTextField}
                        validate={composeValidators(isRequired, isValidPincode)}
                        label={t("account.form.postalCode")}
                        required={true}
                      />
                    </div>
                  </div>
                  <div className={classes.actionBtn}>
                    <PrimaryButton
                      type="submit"
                      text={t("account.form.save")}
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
      <div className={classes.prevNext}>
        <Link href="/profile">
          <Typography variant="h5" sx={{ pb: 1 }}>
            <BsChevronLeft fontSize={"0.75em"} />
            {t("account.prev")}
          </Typography>
          <Typography variant="h5"> {t("account.profile.title")}</Typography>
        </Link>
        <Link href="/profile/orders">
          <Typography variant="h5" sx={{ pb: 1 }}>
            {t("account.next")}
            <BsChevronRight fontSize={"0.75em"} />
          </Typography>
          <Typography variant="h5">{t("account.orders.title")}</Typography>
        </Link>
      </div>
    </div>
  );
}

export { getServerSideProps };
