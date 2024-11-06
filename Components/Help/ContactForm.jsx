// ** Next, React And Locals Imports
import { useState } from "react";
import { ENQUIRY } from "@/Queries/Enquiry.js";
import { FormTextField, FormTextArea } from "@/Helpers/FormFields.js";
import {
  composeValidators,
  isValidEmail,
  isMobileNumber,
  isRequired,
} from "@/Helpers/FormValidators.js";
import Toaster from "@/Components/Toaster/Toaster";
import CustomImage from "@/Components/Image/CustomImage";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { MdClose } from "react-icons/md";

// ** Third Party Imports
import { Field, Form } from "react-final-form";
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";

function ContactForm({ handleClose }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // States
  const [message, setMessage] = useState(false);

  const submit = (values) => {
    const valuesObject = {
      name: values.name,
      email: values.email,
      contactNumber: values.phone,
      subject: values.subject,
      enquiry: values.enquiry,
    };

    enquiryNow({ variables: valuesObject });
  };

  const [enquiryNow, { loading }] = useMutation(ENQUIRY, {
    onCompleted(data) {
      if (data.customerEnquiry.status === 200) {
        setMessage(true);
      } else {
        ToastStatus("Error", "Please try again later");
      }
    },
  });

  const closeModal = () => {
    handleClose(false);
  };

  return (
    <div className={classes.formContainer}>
      <Toaster />
      <Paper className={classes.form}>
        {message && (
          <div className={classes.message}>
            <CustomImage
              src={"/assets/Gif/mail-sent.gif"}
              alt="mail sent"
              width="100"
              height="100"
            />
            <Typography variant="h4">{t("help.form.successTitle")}</Typography>
            <Typography variant="subtitle1" sx={{ p: 1 }}>
              {t("help.form.successInfo")}{" "}
            </Typography>
          </div>
        )}
        <MdClose className={classes.closeIcon} onClick={closeModal} />
        <div style={{ visibility: message ? "hidden" : "visible" }}>
          <Typography variant="h4" align="center">
            {t("help.form.title")}
          </Typography>
          <Form onSubmit={submit}>
            {({ handleSubmit, invalid }) => (
              <form noValidate onSubmit={handleSubmit}>
                <div className={classes.formField}>
                  <Field
                    name="name"
                    component={FormTextField}
                    validate={composeValidators(isRequired)}
                    label={t("help.form.name")}
                    required={true}
                  />
                </div>
                <div className={classes.formField}>
                  <Field
                    name="email"
                    component={FormTextField}
                    validate={composeValidators(isRequired, isValidEmail)}
                    label={t("help.form.email")}
                    required={true}
                  />
                </div>
                <div className={classes.formField}>
                  <Field
                    name="phone"
                    component={FormTextField}
                    validate={isMobileNumber}
                    label={t("help.form.phone")}
                  />
                </div>
                <div className={classes.formField}>
                  <Field
                    name="subject"
                    component={FormTextField}
                    validate={composeValidators(isRequired)}
                    label={t("help.form.subject")}
                    required={true}
                  />
                </div>
                <div className={classes.formField}>
                  <Field
                    name="enquiry"
                    component={FormTextArea}
                    validate={composeValidators(isRequired)}
                    label={t("help.form.enquiry")}
                    rows={5}
                    required={true}
                  />
                </div>
                <div style={{ textAlign: "right", marginTop: "20px" }}>
                  <PrimaryButton
                    type={"submit"}
                    text={t("help.form.send")}
                    disabled={invalid}
                    fullWidth={false}
                    spinner={loading}
                  />
                </div>
              </form>
            )}
          </Form>
        </div>
      </Paper>
    </div>
  );
}

export default ContactForm;
