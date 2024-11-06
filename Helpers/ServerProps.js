// This file is for store authentication & locale purpose!
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default async function getServerSideProps({ req, locale }) {
  const isAuth = req.cookies.fabyoh_customer
    ? JSON.parse(req.cookies.fabyoh_customer)
    : false;

  return {
    props: { isAuth, ...(await serverSideTranslations(locale, ["common"])) },
  };
}
