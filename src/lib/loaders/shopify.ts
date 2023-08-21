import { BaseDocumentLoader } from "langchain/document_loaders/base";
import { Document } from "langchain/document";

interface ProductVariant {
  price: string;
  requires_shipping: boolean;
  weight: string;
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
}

function generateSentences(product: Product, domain: string): string {
  let sentence = `Product ID ${product.id} with title '${product.title}' is a ${product.status} ${product.product_type} available at ${product.variants[0].price} USD.`;
  sentence += ` It has the handle '${product.handle}' with product URL ${domain}/products/${product.handle} and is provided by ${product.vendor}.`;
  sentence += ` Tags: ${product.tags}.`;

  if (product.variants[0].requires_shipping) {
    sentence += " Shipping is available.";
  } else {
    sentence += " No shipping available.";
  }

  sentence += ` Weight: ${product.variants[0].weight} kg.`;
  sentence += ` Description: ${product.body_html}`;
  sentence += ` Image URL: ${product.image.src}`;

  return sentence;
}

const SHOPIFY_ENDPOINTS: Record<string, string> = {
  products: "/admin/products.json",
};

export class ShopifyLoader extends BaseDocumentLoader {
  private resource: string;
  private domain: string;
  private params: string;

  constructor(
    domain: string,
    resource: string,
    access_token: string | null = null
  ) {
    super();
    this.resource = resource;
    this.domain = domain;
    access_token = access_token;
    this.params = `?access_token=${access_token}&published_status=published`;
  }

  private async makeRequest(url: string): Promise<Document[]> {
    const response = await fetch(`${url}${this.params}`);
    const json_data = await response.json();
    const products: Product[] = json_data.products;
    return products.map((product) => ({
      pageContent: generateSentences(product, this.domain),
      metadata: product,
    }));
  }

  private getResourceUrl(): string | null {
    const endpoint = SHOPIFY_ENDPOINTS[this.resource];
    return endpoint ? `${this.domain}${endpoint}` : null;
  }

  async load(): Promise<Document[]> {
    const resourceUrl = this.getResourceUrl();
    if (!resourceUrl) {
      return [];
    }
    return await this.makeRequest(resourceUrl);
  }
}
