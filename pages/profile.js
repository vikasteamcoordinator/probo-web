// ** Next, React And Locals Imports
import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs.js";
import { GET_CUSTOMER, CUSTOMERS } from "@/Queries/Customers.js";
import { getCustomer } from "@/Redux/slices/customer.js";
import {
  FormTextField,
  FormSelectField,
  FormMobileDatePicker,
  FormDesktopDatePicker,
} from "@/Helpers/FormFields.js";
import {
  composeValidators,
  isValidEmail,
  isMobileNumber,
  isRequired,
} from "@/Helpers/FormValidators.js";
import GreetingsLayout from "@/Components/Profile/GreetingsLayout/GreetingsLayout";
import Sidebar from "@/Components/Profile/Sidebar/Sidebar";
import DropzoneSingle from "@/Components/Profile/ProfileSettings/DropzoneSingle";
import Toaster from "@/Components/Toaster/Toaster";
import ToastStatus from "@/Components/Toaster/ToastStatus.jsx";
import Seo from "@/Components/Seo/Seo";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import useStyles from "@/Components/Profile/ProfileSettings/styles.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

// ** Third Party Imports
import { useQuery, useMutation } from "@apollo/client";
import { Field, Form } from "react-final-form";
import { useTranslation } from "next-i18next";
import { BsChevronRight } from "react-icons/bs";

export default function Profile() {
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

  const genders = [
    {
      value: t("account.gender.male"),
    },
    {
      value: t("account.gender.female"),
    },
  ];

  //  Update profile
  const submit = (values) => {
    const valuesObject = {
      id: values._id,
      firstName: values.firstName || null,
      lastName: values.lastName || null,
      avatar: values.avatar || null,
      email: values.email,
      phoneNumber: values.phoneNumber || null,
      gender: values.gender || null,
      dob: values.dob || null,
    };

    updateUser({ variables: valuesObject });
  };

  const [updateUser, { loading }] = useMutation(CUSTOMERS, {
    onCompleted(data) {
      if (data.customers.status === 200) {
        dispatch(getCustomer(data.customers));
        ToastStatus("Success", data.customers.message);
      } else {
        ToastStatus("Error", "Error Occurred");
      }
    },
  });

  return (
    <div className={classes.container}>
      <Seo title={"My Profile"} desc={titleDesc?.desc} />
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
              {t("account.profile.title")}
            </Typography>
            <Form onSubmit={submit} initialValues={customer}>
              {({ handleSubmit, invalid }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <div className={classes.dropzoneField}>
                    <Field name="avatar">
                      {(props) => (
                        <div>
                          <DropzoneSingle {...props.input} />
                        </div>
                      )}
                    </Field>
                  </div>
                  <div className={classes.formFields}>
                    <div className={classes.formField}>
                      <Field
                        name="firstName"
                        component={FormTextField}
                        label={t("account.form.firstName")}
                      />
                    </div>
                    <div className={classes.formField}>
                      <Field
                        name="lastName"
                        component={FormTextField}
                        label={t("account.form.lastName")}
                      />
                    </div>
                  </div>
                  <div className={classes.formFields}>
                    <div className={classes.formField}>
                      <Field
                        name="email"
                        component={FormTextField}
                        validate={composeValidators(isRequired, isValidEmail)}
                        label={t("account.form.email")}
                        required={true}
                        disabled
                      />
                    </div>
                    <div className={classes.formField}>
                      <Field
                        name="phoneNumber"
                        component={FormTextField}
                        validate={isMobileNumber}
                        label={t("account.form.phoneNumber")}
                      />
                    </div>
                  </div>
                  <div className={classes.formFields}>
                    <div className={classes.formField}>
                      <Field
                        name="gender"
                        component={FormSelectField}
                        label={t("account.form.gender")}
                        options={genders}
                        initializeValue={customer.gender}
                      />
                    </div>
                    {/* Desktop Date Picker */}
                    <div
                      className={`${classes.formField} ${classes.desktopDatePicker}`}
                    >
                      <Field
                        name="dob"
                        component={FormDesktopDatePicker}
                        label={t("account.form.dob")}
                      />
                    </div>
                    {/* Mobile Date Picker */}
                    <div
                      className={`${classes.formField} ${classes.mobileDatePicker}`}
                    >
                      <Field
                        name="dob"
                        component={FormMobileDatePicker}
                        label={t("account.form.dob")}
                      />
                    </div>
                  </div>
                  <div className={classes.actionBtn}>
                    <PrimaryButton
                      type="submit"
                      disabled={invalid}
                      text={t("account.form.save")}
                      spinner={loading}
                    />
                  </div>
                </form>
              )}
            </Form>
          </Paper>
        </div>
      </div>
      <Link href="/profile/address">
        <div className={classes.prevNext}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {t("account.next")} <BsChevronRight fontSize={"0.75em"} />
          </Typography>
          <Typography variant="h5">{t("account.address.title")}</Typography>
        </div>
      </Link>
    </div>
  );
}

export { getServerSideProps };
