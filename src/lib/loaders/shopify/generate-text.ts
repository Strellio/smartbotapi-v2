export function generateOrderStatus(
  fulfillmentStatus,
  financialStatus,
  cancelledAt
) {
  console.log(fulfillmentStatus, financialStatus, cancelledAt);
  if (cancelledAt !== null) {
    if (financialStatus === "refunded") {
      return "cancelled and refunded";
    } else if (financialStatus === "partially_refunded") {
      return "cancelled and partially refunded";
    } else if (
      financialStatus === "paid" ||
      financialStatus === "partially_paid"
    ) {
      return "cancelled and not refunded";
    } else if (financialStatus === "voided") {
      return "cancelled and voided";
    } else {
      return "not paid for and cancelled";
    }
  } else if (financialStatus === "pending") {
    return "pending payment";
  } else if (financialStatus === "authorized") {
    return "authorized payment";
  } else if (financialStatus === "refunded") {
    return "refunded";
  } else if (financialStatus === "partially_refunded") {
    return "partially refunded";
  } else if (financialStatus === "voided") {
    return "payment voided";
  } else if (fulfillmentStatus === "fulfilled") {
    return `${financialStatus.replace("_", " ")} and fulfilled`;
  } else if (fulfillmentStatus === "partial") {
    return `${financialStatus.replace("_", " ")} and partially fullfilled`;
  } else {
    return `${financialStatus.replace("_", " ")} and processing`;
  }
}
export function generateOrderContent(order: any) {
  // Extract order details
  const {
    customer,
    order_number,
    fulfillment_status,
    cancelled_at,
    order_status_url,
    currency,
    current_total_price,
    line_items,
    billing_address,
    shipping_address,
    fulfillments,
    refunds,
    shipping_lines,
    payment_gateway_names,
    processed_at,
    total_outstanding,
    financial_status,
  } = order;

  // Generate a sentence with order information
  let sentence = `Order for customer with email ${
    customer?.email
  } has the order number ${order_number}  is currently ${generateOrderStatus(
    fulfillment_status,
    financial_status,
    cancelled_at
  )}. `;
  sentence += `You can track your order's status and details by visiting the following link: ${order_status_url} `;
  sentence += `The total price of the order is ${currency} ${current_total_price}. `;

  sentence += ` And the order items are ${line_items
    .map((item: any) => item.quantity + " " + item.title + " for " + item.price)
    .join(" and ")} `;

  // Include billing and shipping addresses
  sentence += `Billing Address: ${
    billing_address ? formatAddress(billing_address) : "no billing address"
  } `;
  sentence += `Shipping Address: ${formatAddress(shipping_address)} `;

  // Include fulfillments, refunds, and shipping information
  sentence +=
    fulfillments?.length > 0
      ? `Fulfillments: ${fulfillments.map(formatFulfillment).join(", ")} `
      : "";
  // sentence += refunds?.length>0? `Refunds: ${refunds.map(formatRefund(currency)).join(', ')} `:'';
  // sentence += `Shipping Information: ${shipping_lines.map(formatShippingLine(currency)).join(', ')} `;

  // Include payment gateway names and order processing details
  sentence +=
    payment_gateway_names?.length > 0
      ? `Payment Gateway(s): ${payment_gateway_names.join(", ")} `
      : "";
  sentence += processed_at ? `Processed At: ${processed_at} ` : "";

  // Include outstanding amount
  sentence += total_outstanding
    ? `Outstanding Amount: ${currency} ${total_outstanding} `
    : "";

  return sentence;
}

// Helper function to format an address
function formatAddress(address) {
  return `${address.address1 ?? ""}, ${address.city ?? ""}, ${
    address.province ?? ""
  }, ${address.country ?? ""} ${address.zip ?? ""}`;
}

// Helper function to format a fulfillment
function formatFulfillment(fulfillment) {
  return `Tracking Number: ${fulfillment.tracking_number}, Tracking Company: ${fulfillment.tracking_company}, Status: ${fulfillment.status}`;
}

//   // Helper function to format a refund
// function formatRefund(currency) {
//     return (refund) => {
//         return `Amount: ${currency} ${refund.amount}, Reason: ${refund.reason}`;
//     }
// }

//   // Helper function to format a shipping line
// function formatShippingLine(currency) {
//     return (shippingLine) => {
//         return `Carrier: ${shippingLine.title}, Price: ${currency} ${shippingLine.price}`;
//     }
// }

export function transformOrder(inputObject: any) {
  // Destructure the properties you want from the input object
  const {
    id,
    cancel_reason,
    cancelled_at,
    closed_at,
    company,
    confirmation_number,
    confirmed,
    contact_email,
    created_at,
    currency,
    current_subtotal_price,
    current_total_discounts,
    current_total_price,
    current_total_tax,
    discount_codes,
    email,
    financial_status,
    fulfillment_status,
    name,
    number,
    order_number,
    order_status_url,
    payment_gateway_names,
    phone,
    processed_at,
    subtotal_price,
    test,
    total_discounts,
    total_outstanding,
    total_price,
    total_shipping_price_set,
    total_tax,
    total_weight,
    updated_at,
    user_id,
    customer,
  } = inputObject;

  // Create the transformed object
  const transformedObject = {
    id,
    cancel_reason,
    cancelled_at,
    closed_at,
    company,
    confirmation_number,
    confirmed,
    contact_email,
    created_at,
    currency,
    current_subtotal_price,
    current_total_discounts,
    current_total_price,
    current_total_tax,
    discount_codes,
    email,
    financial_status,
    fulfillment_status,
    name,
    number,
    order_number,
    order_status_url,
    payment_gateway_names,
    phone,
    processed_at,
    subtotal_price,
    test,
    total_discounts,
    total_outstanding,
    total_price,
    total_tax,
    total_weight,
    updated_at,
    user_id,
    customer_id: customer.id,
    customer_first_name: customer.first_name,
    customer_last_name: customer.last_name,
    customer_accepts_marketing: customer.accepts_marketing,
    customer_country: customer.default_address.country,
    total_shipping_price: "0.00",
  };

  // Handle the case where total_shipping_price_set is an object with shop_money and presentment_money
  if (total_shipping_price_set) {
    transformedObject.total_shipping_price =
      total_shipping_price_set.shop_money.amount || "0.00";
  }

  return transformedObject;
}
