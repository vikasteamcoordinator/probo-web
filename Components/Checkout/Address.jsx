// ** Next, React And Locals Imports
import {
  composeValidators,
  isMobileNumber,
  isRequired,
  isValidEmail,
  isValidPincode,
} from "@/Helpers/FormValidators.js";
import { FormTextField } from "@/Helpers/FormFields.js";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import useStyles from "./styles.js";

// ** MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import axios from "axios";
import { Form, Field } from "react-final-form";
import { useTranslation } from "next-i18next";

function Address({
  customer,
  customerLoggedIn,
  defaultAddress,
  handleDefaultAddress,
  handleAccordion,
  handleDiffAddress,
  paymentMethods,
}) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  //  Address Details Form Submit
  const submit = (values) => {
    const valuesObject = {
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
      address: {
        address1: values.address1,
        address2: values.address2,
        city: values.city,
        state: values.state,
        country: values.country,
        postal_code: values.postal_code,
      },
      stripeCusId: customerLoggedIn?.stripeCusId,
    };

    const customerObject = {
      name: valuesObject.name,
      email: valuesObject.email || null,
      phoneNumber: valuesObject.phoneNumber || null,
      address1: valuesObject.address?.address1 || null,
      address2: valuesObject.address?.address2 || null,
      city: valuesObject.address?.city || null,
      state: valuesObject.address?.state || null,
      country: valuesObject.address?.country || null,
      postal_code: valuesObject.address?.postal_code || null,
    };

    const handleAddress = async () => {
      if (paymentMethods?.includes("stripe")) {
        //update stripe customer
        try {
          const response = await axios.post(
            process.env.NEXT_PUBLIC_API_URL + "stripe/customer",
            valuesObject
          );

          //on success, open next accordion
          if (response.data.status === 200) {
            // Removing null values from valuesObject
            Object.keys(customerObject).forEach((key) => {
              if (customerObject[key] === null) {
                delete customerObject[key];
              }
            });

            if (
              Object.keys(customerObject).length === 9 ||
              (Object.keys(customerObject).length === 8 &&
                !customerObject.address2)
            ) {
              // Removing stripeCusId
              const filteredValuesObject = valuesObject;

              delete filteredValuesObject["stripeCusId"];

              handleDiffAddress(filteredValuesObject, false, true);
            }
          }
        } catch (error) {
          // ToastStatus("Error", "Stripe initialization failed");
        }
      } else {
        handleDiffAddress(valuesObject, false, true);
      }
    };

    handleAddress();
  };

  return (
    <Paper className={classes.addressDetails}>
      {/* By default defaultAddress value is true */}
      {(customer !== null || !defaultAddress) && (
        <FormControlLabel
          sx={{
            width: "100%",
            justifyContent: "end",
            pb: 3,
          }}
          control={
            <Checkbox
              checked={defaultAddress}
              onChange={() => handleDefaultAddress(!defaultAddress)}
              color="primary"
            />
          }
          label={t("checkout.defaultAddress")}
        />
      )}
      {customer !== null && defaultAddress && (
        <>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">
                <b>{t("checkout.customer.name")}</b>: {customer.name}
              </Typography>
              <Typography variant="subtitle1">
                <b>{t("checkout.customer.email")}</b>: {customer.email}
              </Typography>
              <Typography variant="subtitle1">
                <b>{t("checkout.customer.phone")}</b>: {customer.phoneNumber}
              </Typography>
              <Typography variant="subtitle1">
                <b> {t("checkout.customer.address")}</b>:{" "}
                {customer.address?.address1},{customer.address?.city},
                {customer.address?.state},{customer.address?.country} -{" "}
                {customer.address?.postal_code}
              </Typography>
            </CardContent>
          </Card>
          <div
            className={classes.btn}
            onClick={() => handleAccordion(false, true)}
          >
            <PrimaryButton
              text={t("checkout.continueToPayment")}
              fullWidth={true}
            />
          </div>
          <div
            className={classes.btn}
            onClick={() => handleDefaultAddress(!defaultAddress)}
          >
            <SecondaryButton text={t("checkout.newAddress")} fullWidth={true} />
          </div>
        </>
      )}
      {(!defaultAddress || customer === null) && (
        <Form onSubmit={submit}>
          {({ handleSubmit, invalid }) => (
            <form noValidate onSubmit={handleSubmit}>
              <div className={classes.formField}>
                <Field
                  name="name"
                  component={FormTextField}
                  validate={isRequired}
                  placeholder={t("checkout.form.name")}
                  label={t("checkout.form.name")}
                  required
                />
              </div>
              <div className={classes.formField}>
                <Field
                  name="email"
                  component={FormTextField}
                  validate={composeValidators(isRequired, isValidEmail)}
                  placeholder={t("checkout.form.email")}
                  label={t("checkout.form.email")}
                  required
                />
              </div>
              <div className={classes.formField}>
                <Field
                  name="phoneNumber"
                  component={FormTextField}
                  validate={composeValidators(isRequired, isMobileNumber)}
                  placeholder={t("checkout.form.phone")}
                  label={t("checkout.form.phone")}
                  required
                />
              </div>
              <div className={classes.formField}>
                <Field
                  name="address1"
                  component={FormTextField}
                  validate={isRequired}
                  placeholder={t("checkout.form.address")}
                  label={t("checkout.form.address")}
                  required
                />
              </div>
              <div className={classes.formField}>
                <Field
                  name="address2"
                  component={FormTextField}
                  placeholder={t("checkout.form.landmark")}
                  label={t("checkout.form.landmark")}
                />
              </div>
              <div className={classes.formField}>
                <Field
                  name="city"
                  component={FormTextField}
                  validate={isRequired}
                  placeholder={t("checkout.form.city")}
                  label={t("checkout.form.city")}
                  required
                />
              </div>
              <div className={classes.formField}>
                <Field
                  name="state"
                  component={FormTextField}
                  validate={isRequired}
                  placeholder={t("checkout.form.state")}
                  label={t("checkout.form.state")}
                  required
                />
              </div>
              <div className={classes.formField}>
                <Field
                  name="country"
                  component={FormTextField}
                  validate={composeValidators(isRequired)}
                  placeholder={t("checkout.form.country")}
                  label={t("checkout.form.country")}
                  required
                />
              </div>
              <div className={classes.formField}>
                <Field
                  name="postal_code"
                  component={FormTextField}
                  validate={composeValidators(isRequired, isValidPincode)}
                  placeholder={t("checkout.form.postalCode")}
                  label={t("checkout.form.postalCode")}
                  required
                />
              </div>
              <div className={classes.btn}>
                <PrimaryButton
                  type="submit"
                  text={t("checkout.continueToPayment")}
                  disabled={invalid}
                  fullWidth={true}
                />
              </div>
            </form>
          )}
        </Form>
      )}
    </Paper>
  );
}

export default Address;
