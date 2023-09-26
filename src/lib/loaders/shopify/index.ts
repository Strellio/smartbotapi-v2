import { BaseDocumentLoader } from "langchain/document_loaders/base";
import { Document } from "langchain/document";
import handlebars from "handlebars";
import Shopify from "shopify-api-node";
import shopifyLib from "../../shopify";
import { generateOrderContent, transformOrder } from "./generate-text";

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







export class ShopifyLoader extends BaseDocumentLoader {
  private resource: ShopifyResource;
  private domain: string;
  private options: Options;

  private client: Shopify;

  mapResourceToSyncHandler = {
    [ShopifyResource.PRODUCTS]: this.loadProducts,
    [ShopifyResource.ORDERS]: this.loadOrders
  }

  mapResourceToGetHandler = {
    [ShopifyResource.PRODUCTS]: this.getProductDocuments,
    [ShopifyResource.ORDERS]: this.getOrderDocuments
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
    this.client = shopifyLib.api({
      platformDomain: domain,
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

    let params = { limit: 250 };
    
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
      metadata: transformOrder(order),
    }));
  }

  async load(): Promise<Document[]> {
    const handler = this.mapResourceToSyncHandler[this.resource]
    return await handler.call(this);
  }

  async getDocuments(data:any[]): Promise<Document[]> {
    const handler = this.mapResourceToGetHandler[this.resource]
    return await handler.call(this, data);
  }
}
