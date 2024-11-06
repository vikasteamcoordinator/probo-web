// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import { ADD_TO_NEWSLETTER } from "@/Queries/Newsletter.js";
import { FormTextField } from "@/Helpers/FormFields.js";
import {
  composeValidators,
  isRequired,
  isValidEmail,
} from "@/Helpers/FormValidators.js";
import Toaster from "@/Components/Toaster/Toaster";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { Form, Field } from "react-final-form";
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";

function Newsletter({ settings }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // States
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const [message, setMessage] = useState(false);

  useEffect(() => {
    // Showing newsletter to non subscribed customers only
    if (typeof window !== "undefined") {
      const isSubscribed = localStorage.getItem("isNewsletterSubscribed");
      if (isSubscribed) {
        setIsNewsletterSubscribed(isSubscribed);
      } else {
        setIsNewsletterSubscribed(false);
      }
    }
  }, []);

  // Add customer to newsletter
  const submit = (value) => {
    if (!value.email) {
      return ToastStatus("Error", "Please enter your email");
    }

    addToNewsletter({ variables: value });
  };

  const [addToNewsletter, { loading }] = useMutation(ADD_TO_NEWSLETTER, {
    onCompleted(data) {
      if (data.newsletter.status === 200) {
        setMessage(true);
        localStorage.setItem("isNewsletterSubscribed", true);
      } else {
        ToastStatus("Error", "Error occurred");
      }
    },
  });

  return (
    <>
      <Toaster />
      {!isNewsletterSubscribed && settings?.newsletter && (
        <div className={classes.container}>
          <div className={classes.main}>
            {!message ? (
              <>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  {settings.newsletterHeading}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3 }}>
                  {settings.newsletterText}
                </Typography>
                <Form onSubmit={submit}>
                  {({ handleSubmit }) => (
                    <form noValidate onSubmit={handleSubmit}>
                      <div className={classes.formField}>
                        <Field
                          name="email"
                          component={FormTextField}
                          validate={composeValidators(isValidEmail, isRequired)}
                          placeholder={t("home.newsletter.email")}
                        />
                      </div>
                      <div className={classes.actionBtn}>
                        <PrimaryButton
                          type={"submit"}
                          text={settings.newsletterBtnText}
                          fullWidth={true}
                          spinner={loading}
                        />
                      </div>
                    </form>
                  )}
                </Form>
              </>
            ) : (
              <>
                <Typography variant="h2" sx={{ mb: 3 }}>
                  {settings.newsletterSuccessHeading}
                </Typography>
                <Typography variant="subtitle1">
                  {settings.newsletterSuccessText}
                </Typography>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Newsletter;
