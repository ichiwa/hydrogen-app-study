import {useShopQuery, flattenConnection} from '@shopify/hydrogen';
import {useServerProps} from '@shopify/hydrogen/client';
import Layout from '../components/Layout.server';
import ProductList from '../components/ProductList';
import gql from 'graphql-tag';
// Import the `LoadMore` component that you created.
import LoadMore from '../components/LoadMore.client';
// Fetch the first three products on the product list page.
export default function Index({first = 3}) {
  // const {serverProps} = useServerProps();
  // console.log(serverProps)

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      first,
    },
  });

  const products = flattenConnection(data.products);
  console.log(products);
  // Return the first three products and the load more button.
  return (
    <Layout>
      <LoadMore current={first}>
        <ProductList products={products} />
      </LoadMore>
    </Layout>
  );
}

// Define the GraphQL query.
const QUERY = gql`
  query HomeQuery($first: Int!) {
    products(first: $first) {
      edges {
        node {
          handle
          id
          media(first: 10) {
            edges {
              node {
                ... on MediaImage {
                  mediaContentType
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
          metafields(first: 3) {
            edges {
              node {
                id
                type
                namespace
                key
                value
                createdAt
                updatedAt
                description
                reference {
                  __typename
                  ... on MediaImage {
                    id
                    mediaContentType
                    image {
                      id
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
            }
          }
          priceRange {
            maxVariantPrice {
              currencyCode
              amount
            }
            minVariantPrice {
              currencyCode
              amount
            }
          }
          title
          variants(first: 250) {
            edges {
              node {
                id
                title
                availableForSale
                image {
                  id
                  url
                  altText
                  width
                  height
                }
                priceV2 {
                  currencyCode
                  amount
                }
                compareAtPriceV2 {
                  currencyCode
                  amount
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;
