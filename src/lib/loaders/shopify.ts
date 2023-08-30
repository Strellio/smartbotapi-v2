import { BaseDocumentLoader } from "langchain/document_loaders/base";
import { Document } from "langchain/document";
import handlebars from "handlebars";
import Shopify from "shopify-api-node";
import shopifyLib from "../shopify";

interface ProductVariant {
  price: string;
  requires_shipping: boolean;
  weight: string;
  weight_unit: string;
  title: string;
}

export enum ShopifyResource{
  PRODUCTS = 'products',
  ORDERS = 'orders'
}

interface Product {
  id: string;
  title: string;
  status: string;
  product_type: string;
  handle: string;
  variants: ProductVariant[];
  vendor: string;
  tags: string;
  body_html: string;
  image: {
    src: string;
  };
  options: {
    name: string;
    values: any[];
  }[];
}

type Options = {
  moneyFormat: string;
};

function generateProductContent(
  product: Product,
  domain: string,
  options: Options
): string {
  const moneyTemplate = handlebars.compile(options.moneyFormat);
  let sentence = `Product with title '${product.title}' is a ${
    product.status
  } ${product.product_type} available at ${moneyTemplate({
    amount: product.variants[0].price,
  })}.`;
  sentence += ` It has the product or purchase or checkout URL as ${domain}/products/${product.handle} `;

  if (product.variants.length > 1) {
    sentence += ` With the following variants base on ${product.options.reduce(
      (acc, option, index) =>
        acc +
        option.name +
        `${index !== product.options.length - 1 ? "and" : ""}`,
      ""
    )} as  ${product.variants.reduce(
      (acc, variant) =>
        acc +
        `${variant.title} for ${moneyTemplate({ amount: variant.price })},`,
      ""
    )}`;
  }
  sentence += `With tags: ${product.tags}.`;

  if (product.variants[0].requires_shipping) {
    sentence += " Shipping is available.";
  } else {
    sentence += " No shipping available.";
  }

  sentence += ` Weight: ${product.variants[0].weight} ${product.variants[0].weight_unit}.`;
  sentence += ` Description: ${product.body_html}`;

  return sentence;
}

function generateOrderContent(orderData) {
  const order = orderData.orders[0];

  const orderDetails = `
Order Details:
- Order Number: #${order.order_number}
- Order Status: ${order.confirmed ? "Confirmed" : "Pending"}
- Order Date: ${order.created_at}
- Total Price: ${order.current_total_price} ${order.currency}
- Total Tax: ${order.current_total_tax} ${order.currency}
- Currency: ${order.currency}
- Payment Method: ${order.payment_gateway_names[0]}
- Customer Email: ${order.contact_email}
`;

  const shippingAddress = `
Shipping Address:
- Name: ${order.customer.first_name} ${order.customer.last_name}
- Address: ${order.customer.default_address.address1}, ${order.customer.default_address.country_name}, ${order.customer.default_address.zip}
- Phone: ${order.customer.default_address.phone}
`;

  const orderedItems = order.line_items
    .map(
      (item) => `
${item.title}:
- Price: ${item.price} ${order.currency}
- Quantity: ${item.quantity}
- Total Tax: ${item.tax_lines[0].price} ${order.currency} (${item.tax_lines[0].title})
`
    )
    .join("");

  const orderTracking = `
Order Tracking:
You can track your order's status and details by visiting the following link:
${order.order_status_url}

For any inquiries or assistance, please contact us at ${order.contact_email} or visit our website.
`;

  const trackingInfo = `
${orderDetails}
${shippingAddress}
${orderedItems}
${orderTracking}
`;

  return `A customer with email ${order.customer.email} is the owner of the order with these details ${trackingInfo}`;
}



export class ShopifyLoader extends BaseDocumentLoader {
  private resource: ShopifyResource;
  private domain: string;
  private options: Options;

  private client: Shopify;

  mapResourceToHandler = {
    [ShopifyResource.PRODUCTS]: this.loadProducts,
    [ShopifyResource.ORDERS]: this.loadOrders
  }

  constructor(
    domain: string,
    resource: ShopifyResource,
    access_token: string,
    options: Options
  ) {
    super();
    this.resource = resource;
    this.domain = domain;
    access_token = access_token;
    this.options = options;
    this.client = shopifyLib().shopifyClient({
      shop: domain,
      accessToken: access_token,
    });
  }

  private async loadProducts(): Promise<Document[]> {
    let products: Product[] = [];

    let params = { limit: 250, published_status: "published" };

    do {
      const result = await this.client.product.list(params);

      products = [...products, ...result] as Product[];

      params = result.nextPageParameters;
    } while (params !== undefined);

    return this.getProductDocuments(products);
  }


  private async loadOrders(): Promise<Document[]> {
    let orders: any[] = [];

    let params = { limit: 250};

    do {
      const result = await this.client.order.list(params);

      orders = [...orders, ...result] as any[];

      params = result.nextPageParameters;
    } while (params !== undefined);

    return this.getOrderDocuments(orders);
  }

  private getProductDocuments(products: Product[]): Document[] {
    return products.map((product) => ({
      pageContent: generateProductContent(product, this.domain, this.options),
      metadata: product,
    }));
  }


  private getOrderDocuments(orders: any[]): Document[] {
    return orders.map((order) => ({
      pageContent: generateOrderContent(order),
      metadata: order,
    }));
  }

  async load(): Promise<Document[]> {
    const handler = this.mapResourceToHandler[this.resource]
    return await handler();
  }
}
