const getDomainFromAttributes = ({
  attributes
}: {
  attributes: {
    [x: string]: string
  }
}) => attributes['X-Shopify-Shop-Domain']

const getTopicFromAttributes = ({
  attributes
}: {
  attributes: {
    [x: string]: string
  }
}) => attributes['X-Shopify-Topic']

export { getDomainFromAttributes, getTopicFromAttributes }
