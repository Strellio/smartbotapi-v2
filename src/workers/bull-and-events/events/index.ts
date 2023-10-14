import { PubsubMessage } from "@google-cloud/pubsub/build/src/publisher";
import { parseString } from "../../../lib/utils";
import logger from "../../../lib/logger";
import {
  getDomainFromAttributes,
  getTopicFromAttributes,
} from "./get-attributes";
import businessService from "../../../services/businesses";
import { Business } from "../../../models/businesses/types";
import { deleteVectoreStoreDocument } from "../../../lib/vectorstore/delete-vectoresore-document";
import shopifyService from "../../../services/external-platforms/shopify";
import { createVectoreStore } from "../../../lib/vectorstore/create-vectorstore";
import { PLATFORM_MAP } from "../../../models/businesses/schema/enums";

export enum ResourceType {
  ORDER = "ORDER",
  PRODUCT = "PRODUCT",
}

const mapPlatformToOrderHandler = {
  [PLATFORM_MAP.SHOPIFY]: shopifyService().getOrderDocument,
};

const mapPlatformToProductHandler = {
  [PLATFORM_MAP.SHOPIFY]: shopifyService().getProductDocument,
};

const handleOrderEvent = async (
  data: any,
  eventName: string,
  business: Business
) => {
  // delete order if event is delete order
  const isDeleteOrUpdateEvent =
    eventName.includes("delete") || eventName.includes("updated");

  if (isDeleteOrUpdateEvent) {
    await deleteVectoreStoreDocument({
      dbName: business.account_name,
      collectionName: "orders-store",
      id: data.id,
    });
      
    logger().info(`deleted order from the vectorestore for ${data.id}`);

  }
    
    if (!eventName.includes("delete")) {
        const handler = mapPlatformToOrderHandler[business.platform];

        if (handler) {
          const documents = await handler({ business, data });
      
          await createVectoreStore({
            dbName: business.account_name,
            indexName: "orders-retriever",
            collectionName: "orders-store",
            documents,
          });
      
          logger().info(`order added to vectorestore for ${business.domain}`);
        }
        
    }

};

const handleProductEvent = async (
    data: any,
    eventName: string,
    business: Business
) => {
    // delete order if event is delete order
    const isDeleteOrUpdateEvent =
        eventName.includes("delete") || eventName.includes("update");

    if (isDeleteOrUpdateEvent) {
        await deleteVectoreStoreDocument({
            dbName: business.account_name,
            collectionName: "products-store",
            id: data.id,
        });
        logger().info(`deleted product from the vectorestore for ${data.id}`);

    }
    if (!eventName.includes("delete")) {

        const handler = mapPlatformToProductHandler[business.platform];

        if (handler) {
            const documents = await handler({ business, data });

            await createVectoreStore({
                dbName: business.account_name,
                indexName: "products-retriever",
                collectionName: "products-store",
                documents,
            });
            logger().info(`Product added to vectorestore for ${business.domain}`);
        }
    };
}

export default async function handleEvent(
  event: PubsubMessage & {
    ack: Function;
  }
) {
  const data = parseString(event.data as any);

  logger().info(
    "New Event" + JSON.stringify(data),
    +" " + getTopicFromAttributes({ attributes: (event as any).attributes })
  );

  const eventName =
    event.attributes &&
    getTopicFromAttributes({ attributes: event.attributes });

  const business = await businessService().getByExternalPlatformDomain(
    getDomainFromAttributes({
      attributes: event.attributes as never,
    })
  );

  let resource;
  let type: ResourceType;

  if (eventName && eventName.includes("order")) {
    type = ResourceType.ORDER;
    resource = await handleOrderEvent(data, eventName, business);
  }
  if (eventName && eventName.includes("product")) {
    type = ResourceType.PRODUCT;
    resource = await handleProductEvent(data, eventName, business);
  }

//   if (resource) {
//     console.log(resource);
//   }

  logger().info("ack event");

  event.ack();
}
