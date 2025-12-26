import {
  BlockStack,
  Text,
  Link,
  reactExtension,
  useApi,
  InlineStack,
  List,
  ListItem,
} from "@shopify/ui-extensions-react/customer-account";
import { useState, useEffect } from "react";

export default reactExtension(
  "customer-account.page.render",
  () => <ActionAccountExtension />
);

function ActionAccountExtension() {
  const BACKEND_BASE_URL = "https://tu-backend.com/api";

  const { customer, location } = useApi();

  const customerId = customer?.id;

  const search = location?.search ?? "?mode=storage";
  let mode = null;

  if (search) {
    const params = new URLSearchParams(search);
    mode = params.get("mode");
  }

  const [auctions, setAuctions] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (customerId) {
      if (mode === "storage") {
        fetch(`${BACKEND_BASE_URL}/get-storage-auctions?customerId=${customerId}`)
          .then((res) => res.json())
          .then((data) => setAuctions(data))
          .catch((err) => console.error("Error fetching auctions:", err));
      } else if (mode === "shipping") {
        fetch(`${BACKEND_BASE_URL}/get-shipping-data?customerId=${customerId}`)
          .then((res) => res.json())
          .then((data) => setProducts(data))
          .catch((err) => console.error("Error fetching auctions:", err));
      }
    }
  }, [mode, customerId]);

  useEffect(() => {
    if (mode === "storage") {
      const mockData = [
        {
          id: 1,
          auction_id: 5125371,
          status: "SUBSCRIPTION CREATED",
          data_webkul: { 
            product_title: "product test two", 
            shopify_product_id: 9062412320987, 
            product_handle: "product-test-two" 
          },
        },
        {
          id: 2,
          auction_id: 5125315,
          status: "SUBSCRIPTION CREATED",
          data_webkul: { 
            product_title: "product test two", 
            shopify_product_id: 9062412320987, 
            product_handle: "product-test-two" 
          },
        },
      ];
      setAuctions(mockData);
    } else if (mode === "shipping") {
      const mockProducts = [
        {
          id: "gid://shopify/Product/9062412320987",
          title: "product test two",
          sku: "product-test-two",
          price: "0.50",
        },
        {
          id: "gid://shopify/Product/9062412320987",
          title: "product test two",
          sku: "product-test-two",
          price: "0.15",
        },
      ];
      setProducts(mockProducts);
    }
  }, [mode]);

  return (
    <BlockStack spacing="loose">
      {mode === "shipping" && (
        <BlockStack spacing="loose">
          <Text size="large" emphasis="bold">Wines to Ship</Text>

          {products.length === 0 ? (
            <Text size="medium" emphasis="bold">No wines to ship.</Text>
          ) : (
            <List>
              {products.map((product) => (
                <ListItem key={product.id}>
                  <InlineStack spacing="base">
                    <InlineStack spacing="base">
                      <Text size="medium" emphasis="bold">Product Name: </Text>
                      <Text size="medium">{product.title}</Text>
                    </InlineStack>
                    <InlineStack spacing="base">
                      <Text size="medium" emphasis="bold">SKU: </Text>
                      <Text size="medium">{product.sku}</Text>
                    </InlineStack>
                    <InlineStack spacing="base">
                      <Text size="medium" emphasis="bold">Price: </Text>
                      <Text size="medium">{product.price}</Text>
                    </InlineStack>
                    <Link
                      to={`${BACKEND_BASE_URL}/create-checkout?customerId=${customerId}&productId=${product.id}`}
                      target="_blank"
                      underline="none"
                    >
                      Ship this product
                    </Link>
                  </InlineStack>
                </ListItem>
              ))}
            </List>
          )}
        </BlockStack>
      )}

      {mode === "storage" && (
        <BlockStack spacing="loose">
          <Text size="large" emphasis="bold">Storage inventory</Text>

          {auctions.length === 0 ? (
            <Text size="medium" emphasis="bold">No storage items found.</Text>
          ) : (
            auctions.map((auction) => (  
              <ListItem key={auction.id}>
                <InlineStack spacing="base">
                  <InlineStack spacing="base">
                    <Text size="medium" emphasis="bold">Auction #: </Text>
                    <Text size="medium">{auction.auction_id}</Text>
                  </InlineStack>
                  <InlineStack spacing="base">
                    <Text size="medium" emphasis="bold">Status: </Text>
                    <Text size="medium">{auction.status}</Text>
                  </InlineStack>
                  <Link
                      to={`/products/${auction.data_webkul.shopify_product_id}`}
                      target="_blank"
                      underline="none"
                    >
                    {auction.data_webkul.product_title}
                  </Link>
                </InlineStack>
              </ListItem>
            ))
          )}
        </BlockStack>
      )}

      {!mode && <Text size="large">Page not available</Text>}
    </BlockStack>
  );
}