// ** Next, React And Locals Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GET_ORDER_BY_ID } from "@/Queries/Orders.js";
import Order from "@/Components/Profile/Orders/Order";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** Third Party Imports
import { useMutation } from "@apollo/client";

export default function ViewOrder() {
  const router = useRouter();

  // Order id
  const orderId = router.asPath.split("/")[2];

  // States
  const [guest, setGuest] = useState(false);
  const [order, setOrder] = useState(null);

  // Customer
  const customer = order?.customer;

  // Get Order
  const [getOrderById] = useMutation(GET_ORDER_BY_ID, {
    onCompleted(data) {
      // Returning to 404
      if (!data.getOrderById) {
        return router.push("/404");
      }

      // Checking whether the order is placed by guest customer or not
      const customerId = data.getOrderById.customer.customerId.split("-");

      //Showing the order to guest customer only
      if (customerId.length > 1) {
        setOrder(data.getOrderById);
        setGuest(true);
      } else {
        router.push("/404");
      }
    },
  });

  useEffect(() => {
    if (orderId?.length === 24) {
      getOrderById({ variables: { id: orderId } });
    } else {
      router.push("/404");
    }
  }, [orderId, getOrderById]);

  return (
    <>
      {order && customer && (
        <Order order={order} customer={customer} guest={guest} />
      )}
    </>
  );
}

export { getServerSideProps };
