import { BaseDocumentLoader } from "langchain/document_loaders/base";
import { Document } from "langchain/document";
import handlebars from 'handlebars'


interface ProductVariant {
  price: string;
  requires_shipping: boolean;
  weight: string;
  weight_unit: string
  title: string,

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
    name: string,
    values: any[]
  }[]
}


type Options = {
  moneyFormat: string
}

function generateSentences(product: Product, domain: string, options: Options): string {
  const moneyTemplate = handlebars.compile(options.moneyFormat)
  let sentence = `Product with title '${product.title}' is a ${product.status} ${product.product_type} available at ${moneyTemplate({amount:product.variants[0].price})}.`;
  sentence += ` It has the product URL ${domain}/products/${product.handle} `;

  if (product.variants.length > 1) {
    sentence +=` With the following variants base on ${product.options.reduce((acc, option, index)=>acc+ option.name + `${index !== product.options.length -1 ? 'and':''}` , "")} as  ${product.variants.reduce((acc, variant)=>acc + `${variant.title} for ${moneyTemplate({amount:variant.price})},` , "")}`
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

const SHOPIFY_ENDPOINTS: Record<string, string> = {
  products: "/admin/products.json",
};

export class ShopifyLoader extends BaseDocumentLoader {
  private resource: string;
  private domain: string;
  private params: string;
  private options: Options

  constructor(domain: string, resource: string, access_token: string, options:Options) {
    super();
    this.resource = resource;
    this.domain = domain;
    access_token = access_token;
    this.params = `?access_token=${access_token}&published_status=published`;
    this.options = options
  }

  private async makeRequest(url: string): Promise<Document[]> {
    const response = await fetch(`${url}${this.params}`);
    const json_data = await response.json();
    const products: Product[] = json_data.products;

    
    return products.map(product => ({
      pageContent: generateSentences(product, this.domain, this.options),
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
