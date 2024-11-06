// ** Next, React And Locals Imports
import { useState } from "react";
import { ADD_PRODUCT_REVIEW } from "@/Queries/Products.js";
import { FormTextArea } from "@/Helpers/FormFields.js";
import { isRequired } from "@/Helpers/FormValidators.js";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import DropzoneSingle from "./DropzoneSingle";
import useStyles from "./styles.js";

// ** MUI Imports
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// ** Third Party Imports
import { useMutation } from "@apollo/client";
import { Form, Field } from "react-final-form";
import { useTranslation } from "next-i18next";
import { MdClose } from "react-icons/md";

function AddReview({ products, orderId, closeModal }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // States
  const [product, setProduct] = useState(products[0]?.product._id); // product id
  const [rating, setRating] = useState();

  const handleChange = (event) => {
    setProduct(event.target.value);
  };

  const closeReviewModal = () => {
    closeModal(false);
  };

  // To set rating
  const handleRating = (e) => {
    setRating(e.target.value);
  };

  const submit = (values) => {
    const valuesObject = {
      productId: product,
      review: {
        orderId,
        rating: parseInt(rating),
        comment: values.comment,
        media: values.media,
      },
    };

    if (!rating) {
      ToastStatus("Error", "Please rate a product");
    } else {
      if (product && orderId) {
        addReview({ variables: valuesObject });
      } else {
        ToastStatus("Error", "Please choose a product to review");
      }
    }
  };

  const [addReview, { loading }] = useMutation(ADD_PRODUCT_REVIEW, {
    onCompleted(data) {
      if (data.addProductReview.status === 200) {
        closeReviewModal();
        ToastStatus("Success", data.addProductReview.message);
      } else {
        ToastStatus("Error", data.addProductReview.message);
      }
    },
  });

  return (
    <div className={classes.modalCtn}>
      <Paper className={classes.modal}>
        <MdClose className={classes.closeIcon} onClick={closeReviewModal} />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          {t("account.review.products")}:
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select value={product} onChange={handleChange}>
            {products?.map((product, index) => (
              <MenuItem key={index} value={product.product._id}>
                {product.product.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          <Typography variant="subtitle1">
            {t("account.review.rateText")}:
          </Typography>
          <Rating
            value={rating}
            size="large"
            onChange={(e) => handleRating(e)}
            className={classes.ratingIcon}
          />
        </div>
        <Form onSubmit={submit}>
          {({ handleSubmit, invalid }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                {t("account.review.content")}:
              </Typography>
              <div className={classes.formField}>
                <Field
                  name="comment"
                  component={FormTextArea}
                  validate={isRequired}
                  rows={4}
                  placeholder={t("account.review.contentText")}
                />
              </div>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                {t("account.review.shareImage")}:
              </Typography>
              <div className={classes.formField}>
                <Field name="media">
                  {(props) => <DropzoneSingle {...props.input} />}
                </Field>
              </div>
              <div className={classes.btn}>
                <PrimaryButton
                  type="submit"
                  disabled={invalid}
                  text={t("account.review.submit")}
                  spinner={loading}
                />
              </div>
            </form>
          )}
        </Form>
      </Paper>
    </div>
  );
}

export default AddReview;
