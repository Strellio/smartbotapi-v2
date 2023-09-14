
export function generateOrderStatus(fulfillmentStatus, financialStatus, cancelledAt) {
    console.log(fulfillmentStatus, financialStatus, cancelledAt)
    if (cancelledAt !== null) {
      if (financialStatus === 'refunded') {
        return 'cancelled and refunded';
      } else if (financialStatus === 'partially_refunded') {
        return 'cancelled and partially refunded';
      } else if (financialStatus === 'paid' || financialStatus === 'partially_paid') {
        return 'cancelled and not refunded';
      } else if (financialStatus === 'voided') {
        return 'cancelled and voided';
      } else {
        return 'not paid for and cancelled';
      }
    } else if (financialStatus === 'pending') {
      return 'pending payment';
    } else if (financialStatus === 'authorized') {
      return 'authorized payment';
    } else if (financialStatus === 'refunded') {
      return 'refunded';
    } else if (financialStatus === 'partially_refunded') {
      return 'partially refunded';
    } else if (financialStatus === 'voided') {
      return 'payment voided';
    } else if (fulfillmentStatus === 'fulfilled') {
      return `${financialStatus.replace("_", " ")} and fulfilled`;
    }  else if (fulfillmentStatus === 'partial') {
        return `${financialStatus.replace("_", " ")} and partially fullfilled`
      } else {
        return `${financialStatus.replace("_", " ")} and processing`
    }
  }
export function generateOrderContent(order:any) {
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
    let sentence = `Order for customer with email ${customer?.email} has the order number ${order_number}  is currently ${generateOrderStatus(fulfillment_status, financial_status, cancelled_at)}. `;
    sentence += `You can track your order's status and details by visiting the following link: ${order_status_url} `;
    sentence += `The total price of the order is ${currency} ${current_total_price}. `;

    sentence += ` And the order items are ${line_items.map((item: any) => item.quantity + " " + item.title + " for " + item.price).join(" and ")} `
  
    // Include billing and shipping addresses
    sentence += `Billing Address: ${billing_address? formatAddress(billing_address):"no billing address"} `;
    sentence += `Shipping Address: ${formatAddress(shipping_address)} `;
  
    // Include fulfillments, refunds, and shipping information
    sentence += fulfillments?.length>0? `Fulfillments: ${fulfillments.map(formatFulfillment).join(', ')} `:"";
    // sentence += refunds?.length>0? `Refunds: ${refunds.map(formatRefund(currency)).join(', ')} `:'';
    // sentence += `Shipping Information: ${shipping_lines.map(formatShippingLine(currency)).join(', ')} `;
  
    // Include payment gateway names and order processing details
    sentence += payment_gateway_names?.length >0? `Payment Gateway(s): ${payment_gateway_names.join(', ')} `:'';
    sentence += processed_at?`Processed At: ${processed_at} `:'';
  
    // Include outstanding amount
    sentence += total_outstanding? `Outstanding Amount: ${currency} ${total_outstanding} `:'';
  
    return sentence;
  }
  
  // Helper function to format an address
  function formatAddress(address) {
    return `${address.address1??''}, ${address.city??''}, ${address.province??''}, ${address.country??''} ${address.zip??''}`;
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
  
const order = {
    id: 4586091446412,
    admin_graphql_api_id: 'gid://shopify/Order/4586091446412',
    app_id: 1354745,
    browser_ip: '154.160.30.133',
    buyer_accepts_marketing: true,
    cancel_reason: null,
    cancelled_at: null,
    cart_token: null,
    checkout_id: 22986216636556,
    checkout_token: 'a404db77e85231feea05ab386408c91c',
    client_details: {
      accept_language: null,
      browser_height: null,
      browser_ip: '154.160.30.133',
      browser_width: null,
      session_hash: null,
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
    },
    closed_at: null,
    company: null,
    confirmation_number: 'MFDFKTFA6',
    confirmed: true,
    contact_email: 'kwartengwisdomug95@gmail.com',
    created_at: '2023-09-13T01:41:05-04:00',
    currency: 'GHS',
    current_subtotal_price: '1654.80',
    current_subtotal_price_set: {
      shop_money: { amount: '1654.80', currency_code: 'GHS' },
      presentment_money: { amount: '1654.80', currency_code: 'GHS' }
    },
    current_total_additional_fees_set: null,
    current_total_discounts: '0.00',
    current_total_discounts_set: {
      shop_money: { amount: '0.00', currency_code: 'GHS' },
      presentment_money: { amount: '0.00', currency_code: 'GHS' }
    },
    current_total_duties_set: null,
    current_total_price: '1654.80',
    current_total_price_set: {
      shop_money: { amount: '1654.80', currency_code: 'GHS' },
      presentment_money: { amount: '1654.80', currency_code: 'GHS' }
    },
    current_total_tax: '0.00',
    current_total_tax_set: {
      shop_money: { amount: '0.00', currency_code: 'GHS' },
      presentment_money: { amount: '0.00', currency_code: 'GHS' }
    },
    customer_locale: 'en',
    device_id: null,
    discount_codes: [],
    email: 'kwartengwisdomug95@gmail.com',
    estimated_taxes: false,
    financial_status: 'partially_paid',
    fulfillment_status: 'partial',
    landing_site: null,
    landing_site_ref: null,
    location_id: null,
    merchant_of_record_app_id: null,
    name: '#1040',
    note: null,
    note_attributes: [],
    number: 40,
    order_number: 1040,
    order_status_url: 'https://design-studios-hub.myshopify.com/28462776460/orders/f84bfa7309f79f2c3fc46371c720cc92/authenticate?key=1aa0d93ad4f669c360eedf3b8e13270f',
    original_total_additional_fees_set: null,
    original_total_duties_set: null,
    payment_gateway_names: [ 'manual' ],
    phone: null,
    po_number: null,
    presentment_currency: 'GHS',
    processed_at: '2023-09-13T01:41:04-04:00',
    reference: '7e275d058b11ff45e93a3de45083dacd',
    referring_site: null,
    source_identifier: '7e275d058b11ff45e93a3de45083dacd',
    source_name: 'shopify_draft_order',
    source_url: null,
    subtotal_price: '2680.40',
    subtotal_price_set: {
      shop_money: { amount: '2680.40', currency_code: 'GHS' },
      presentment_money: { amount: '2680.40', currency_code: 'GHS' }
    },
    tags: '',
    tax_exempt: true,
    tax_lines: [],
    taxes_included: false,
    test: false,
    token: 'f84bfa7309f79f2c3fc46371c720cc92',
    total_discounts: '0.00',
    total_discounts_set: {
      shop_money: { amount: '0.00', currency_code: 'GHS' },
      presentment_money: { amount: '0.00', currency_code: 'GHS' }
    },
    total_line_items_price: '2680.40',
    total_line_items_price_set: {
      shop_money: { amount: '2680.40', currency_code: 'GHS' },
      presentment_money: { amount: '2680.40', currency_code: 'GHS' }
    },
    total_outstanding: '1496.80',
    total_price: '2680.40',
    total_price_set: {
      shop_money: { amount: '2680.40', currency_code: 'GHS' },
      presentment_money: { amount: '2680.40', currency_code: 'GHS' }
    },
    total_shipping_price_set: {
      shop_money: { amount: '0.00', currency_code: 'GHS' },
      presentment_money: { amount: '0.00', currency_code: 'GHS' }
    },
    total_tax: '0.00',
    total_tax_set: {
      shop_money: { amount: '0.00', currency_code: 'GHS' },
      presentment_money: { amount: '0.00', currency_code: 'GHS' }
    },
    total_tip_received: '0.00',
    total_weight: 0,
    updated_at: '2023-09-14T01:07:48-04:00',
    user_id: 40889843852,
    billing_address: {
      first_name: 'Wisdom',
      address1: 'Accra ghana',
      phone: '+233509878941',
      city: '',
      zip: '00233',
      province: null,
      country: 'Ghana',
      last_name: 'Kwarteng',
      address2: null,
      company: 'accra ghana',
      latitude: null,
      longitude: null,
      name: 'Wisdom Kwarteng',
      country_code: 'GH',
      province_code: null
    },
    customer: {
      id: 3296627032204,
      email: 'kwartengwisdomug95@gmail.com',
      accepts_marketing: true,
      created_at: '2020-04-13T15:25:42-04:00',
      updated_at: '2023-09-13T21:48:16-04:00',
      first_name: 'Wisdom',
      last_name: 'Kwarteng',
      state: 'disabled',
      note: null,
      verified_email: true,
      multipass_identifier: null,
      tax_exempt: true,
      phone: null,
      email_marketing_consent: {
        state: 'subscribed',
        opt_in_level: 'single_opt_in',
        consent_updated_at: '2020-04-13T15:25:43-04:00'
      },
      sms_marketing_consent: null,
      tags: '',
      currency: 'GHS',
      accepts_marketing_updated_at: '2020-04-13T15:25:43-04:00',
      marketing_opt_in_level: 'single_opt_in',
      tax_exemptions: [],
      admin_graphql_api_id: 'gid://shopify/Customer/3296627032204',
      default_address: {
        id: 3308285984908,
        customer_id: 3296627032204,
        first_name: 'Wisdom',
        last_name: 'Kwarteng',
        company: 'accra ghana',
        address1: 'Accra ghana',
        address2: '',
        city: '',
        province: '',
        country: 'Ghana',
        zip: '00233',
        phone: '+233509878941',
        name: 'Wisdom Kwarteng',
        province_code: null,
        country_code: 'GH',
        country_name: 'Ghana',
        default: true
      }
    },
    discount_applications: [],
    fulfillments: [
      {
        id: 4012296831116,
        admin_graphql_api_id: 'gid://shopify/Fulfillment/4012296831116',
        created_at: '2023-09-13T22:46:40-04:00',
        location_id: 36055220364,
        name: '#1040.1',
        order_id: 4586091446412,
        origin_address: {},
        receipt: {},
        service: 'manual',
        shipment_status: null,
        status: 'success',
        tracking_company: 'Amazon Logistics UK',
        tracking_number: '68787877',
        tracking_numbers: [Array],
        tracking_url: 'https://track.amazon.co.uk/tracking/68787877',
        tracking_urls: [Array],
        updated_at: '2023-09-13T22:46:40-04:00',
        line_items: [Array]
      }
    ],
    line_items: [
      {
        id: 12249686212748,
        admin_graphql_api_id: 'gid://shopify/LineItem/12249686212748',
        fulfillable_quantity: 0,
        fulfillment_service: 'manual',
        fulfillment_status: null,
        gift_card: false,
        grams: 0,
        name: 'Anchor Necklace - Black / One Size',
        price: '158.00',
        price_set: [Object],
        product_exists: true,
        product_id: 4398841299084,
        properties: [],
        quantity: 3,
        requires_shipping: true,
        sku: '17518',
        taxable: true,
        title: 'Anchor Necklace',
        total_discount: '0.00',
        total_discount_set: [Object],
        variant_id: 31401372254348,
        variant_inventory_management: 'shopify',
        variant_title: 'Black / One Size',
        vendor: 'Maria Calderara',
        tax_lines: [],
        duties: [],
        discount_allocations: []
      },
      {
        id: 12252265775244,
        admin_graphql_api_id: 'gid://shopify/LineItem/12252265775244',
        fulfillable_quantity: 0,
        fulfillment_service: 'manual',
        fulfillment_status: 'fulfilled',
        gift_card: false,
        grams: 0,
        name: '3/4 Sleeve Kimono Dress - 16',
        price: '551.60',
        price_set: [Object],
        product_exists: true,
        product_id: 4398899429516,
        properties: [],
        quantity: 3,
        requires_shipping: true,
        sku: '23519',
        taxable: true,
        title: '3/4 Sleeve Kimono Dress',
        total_discount: '0.00',
        total_discount_set: [Object],
        variant_id: 31401881337996,
        variant_inventory_management: 'shopify',
        variant_title: '16',
        vendor: 'Antoni & Alison',
        tax_lines: [],
        duties: [],
        discount_allocations: []
      },
      {
        id: 12252910321804,
        admin_graphql_api_id: 'gid://shopify/LineItem/12252910321804',
        fulfillable_quantity: 1,
        fulfillment_service: 'manual',
        fulfillment_status: null,
        gift_card: false,
        grams: 0,
        name: '3/4 Sleeve Kimono Dress - 12',
        price: '551.60',
        price_set: [Object],
        product_exists: true,
        product_id: 4398899429516,
        properties: [],
        quantity: 1,
        requires_shipping: true,
        sku: '23517',
        taxable: true,
        title: '3/4 Sleeve Kimono Dress',
        total_discount: '0.00',
        total_discount_set: [Object],
        variant_id: 31401881272460,
        variant_inventory_management: 'shopify',
        variant_title: '12',
        vendor: 'Antoni & Alison',
        tax_lines: [],
        duties: [],
        discount_allocations: []
      }
    ],
    payment_terms: null,
    refunds: [
      {
        id: 836319641740,
        admin_graphql_api_id: 'gid://shopify/Refund/836319641740',
        created_at: '2023-09-13T02:58:16-04:00',
        note: null,
        order_id: 4586091446412,
        processed_at: '2023-09-13T02:58:16-04:00',
        restock: true,
        total_duties_set: [Object],
        user_id: 40889843852,
        order_adjustments: [],
        transactions: [],
        refund_line_items: [Array],
        duties: []
      },
      {
        id: 836345659532,
        admin_graphql_api_id: 'gid://shopify/Refund/836345659532',
        created_at: '2023-09-13T12:37:36-04:00',
        note: null,
        order_id: 4586091446412,
        processed_at: '2023-09-13T12:37:36-04:00',
        restock: true,
        total_duties_set: [Object],
        user_id: 40889843852,
        order_adjustments: [],
        transactions: [],
        refund_line_items: [Array],
        duties: []
      },
      {
        id: 836345921676,
        admin_graphql_api_id: 'gid://shopify/Refund/836345921676',
        created_at: '2023-09-13T12:41:52-04:00',
        note: null,
        order_id: 4586091446412,
        processed_at: '2023-09-13T12:41:52-04:00',
        restock: true,
        total_duties_set: [Object],
        user_id: 40889843852,
        order_adjustments: [],
        transactions: [],
        refund_line_items: [Array],
        duties: []
      },
      {
        id: 836367188108,
        admin_graphql_api_id: 'gid://shopify/Refund/836367188108',
        created_at: '2023-09-13T21:44:44-04:00',
        note: null,
        order_id: 4586091446412,
        processed_at: '2023-09-13T21:44:44-04:00',
        restock: true,
        total_duties_set: [Object],
        user_id: 40889843852,
        order_adjustments: [],
        transactions: [],
        refund_line_items: [Array],
        duties: []
      }
    ],
    shipping_address: {
      first_name: 'Wisdom',
      address1: 'Accra ghana',
      phone: '+233509878941',
      city: '',
      zip: '00233',
      province: null,
      country: 'Ghana',
      last_name: 'Kwarteng',
      address2: null,
      company: 'accra ghana',
      latitude: null,
      longitude: null,
      name: 'Wisdom Kwarteng',
      country_code: 'GH',
      province_code: null
    },
    shipping_lines: []
}
  

console.log(generateOrderContent(order))
  