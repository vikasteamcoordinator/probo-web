// ** Next, React And Locals Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { GET_ORDER_BY_ID } from "@/Queries/Orders.js";
import Order from "@/Components/Profile/Orders/Order";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** Third Party Imports
import { useMutation } from "@apollo/client";

export default function ViewOrder() {
  const router = useRouter();

  // Order id
  const orderId = router.asPath.split("/")[3];

  // States
  const [guest, setGuest] = useState(false);
  const [order, setOrder] = useState(null);

  // Customer
  const customer = order?.customer;

  // Customer orders
  const allOrders = useSelector((state) => state.orders.orders);

  // Get Order
  const [getOrderById] = useMutation(GET_ORDER_BY_ID, {
    onCompleted(data) {
      // Returning to 404
      if (!data.getOrderById) {
        return router.push("/404");
      }

      // Checking whether the order is placed by guest customer or not
      const customerId = data.getOrderById.customer.customerId.split("-");

      //Showing the order to authenticated customer only
      if (customerId.length === 1) {
        setOrder(data.getOrderById);
        setGuest(false);
      } else {
        router.push("/404");
      }
    },
  });

  useEffect(() => {
    if (orderId?.length === 24) {
      const isOrderExist = allOrders.find((item) => {
        return item._id === orderId;
      });

      if (isOrderExist) {
        setOrder(isOrderExist);
      } else {
        getOrderById({ variables: { id: orderId } });
      }
    } else {
      router.push("/404");
    }
  }, [orderId, allOrders, getOrderById]);

  return (
    <>
      {order && customer && (
        <Order order={order} customer={customer} guest={guest} />
      )}
    </>
  );
}

export { getServerSideProps };
