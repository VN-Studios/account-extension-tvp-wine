import {
  Badge,
  BlockStack,
  Button,
  Card,
  InlineStack,
  Link,
  Text,
  reactExtension,
} from "@shopify/ui-extensions-react/customer-account";
import { Grid } from "@shopify/ui-extensions/checkout";
import { useState, useEffect } from "react";

export default reactExtension(
  "customer-account.order-index.block.render",
  (api) => <WineOptions api={api} />
);

function WineOptions({api}) {
  const [auctions, setAuctions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  
  const orderAuctionUrlLambda = 'https://nywaa.myshopify.com/pages/order-action-landing';

  const AUCTION_STATUS = {
    NOTIFIED: "NOTIFIED",
    SUBSCRIPTION_CREATED: "SUBSCRIPTION CREATED",
    ORDER_CREATED: "ORDER CREATED",
    ORDER_PAID: "ORDER PAID",
  };

  const fetchAuctions = async (page = 1) => {
    const customerId = api.authenticatedAccount.customer.current.id;

    if (!customerId) {
      setAuthenticated(false);
      setError("Customer not authenticated");
      return;
    }

    const customerAuctionsUrlLambda = 'https://abd19aaa6fac.ngrok-free.app';

    setAuthenticated(true);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${customerAuctionsUrlLambda}/get-auctions-by-customer`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          shopifyCustomerId: `gid://shopify/Customer/${customerId}`,
          page,
        }),
      });

      if (!res.ok) {
        throw new Error("Error fetching auctions");
      }

      const data = await res.json();
      setAuctions(data.data.auctions);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions(1);
  }, []);

  return (
    <BlockStack spacing="loose">
      <Text size="large" emphasis="bold">Auctions</Text>
      <Card>
        <BlockStack spacing="tight">
          <BlockStack alignment="center" inlineAlignment="center" spacing="loose">
            {!authenticated && (
              <Text tone="critical">You must be logged in to view your auctions.</Text>
            )}
            {loading && (
              <Text tone="subdued">Loading auctions...</Text>
            )}
            {error && (
              <Text tone="critical">Error: {error}</Text>
            )}
          </BlockStack>

          {!loading && auctions.length > 0 ? (
            <>
              <Grid columns={['0.01fr', '1fr', '2fr', '1fr','1fr', '0.01fr']} spacing="tight">
                <Text /> <Text /> <Text /> <Text /> <Text /> <Text />
                <Text /> <Text /> <Text /> <Text /> <Text /> <Text />
              </Grid>

              <Grid columns={['0.01fr', '1.5fr', '2fr', '1fr','0.7fr', '0.01fr']} spacing="loose">
                <Text /> 
                <Text size="medium" emphasis="bold"># Auction</Text>
                <Text size="medium" emphasis="bold">Product Name</Text>
                <Text size="medium" emphasis="bold">Status</Text>
                <BlockStack alignment="center" inlineAlignment="center">
                  <Text size="medium" emphasis="bold">Action</Text>
                </BlockStack>
                <Text />
              </Grid>

              <Grid columns={['0.01fr', '1fr', '2fr', '1fr','1fr', '0.01fr']} spacing="tight">
                <Text /> <Text /> <Text /> <Text /> <Text /> <Text />
              </Grid>

              {auctions.map((auction, index) => (
                <Grid key={index} columns={['0.01fr', '1.5fr', '2fr', '1fr','0.7fr', '0.01fr']} spacing="loose">
                  <Text />
                  <InlineStack spacing="tight">
                    <Text>{auction.auction_id}</Text>
                    {auction.status !== AUCTION_STATUS.NOTIFIED && (
                      <Badge tone={auction.status === AUCTION_STATUS.ORDER_PAID ? 'success' : (auction.status === AUCTION_STATUS.SUBSCRIPTION_CREATED ? 'critical' : 'subdued')}>
                        {auction.status === AUCTION_STATUS.ORDER_PAID ? 'Marked as Ship' : (auction.status === AUCTION_STATUS.SUBSCRIPTION_CREATED ? 'Marked as Storage' : 'Complete the shipping process')}
                      </Badge>
                    )}
                  </InlineStack>
                  <Text>
                    {auction.data_webkul.product_title} 
                  </Text>
                  <Text>{auction.status}</Text>
                  {auction.status === AUCTION_STATUS.SUBSCRIPTION_CREATED ? (
                    <BlockStack alignment="center" inlineAlignment="center">
                      <Link
                        to={`${orderAuctionUrlLambda}/create-order?auction=${auction.auction_id}`}
                        target="_blank"
                      >
                        <Button kind="plain">Ship</Button>
                      </Link>
                    </BlockStack>
                  ) : (
                    auction.status === AUCTION_STATUS.ORDER_CREATED ? (
                      <BlockStack alignment="center" inlineAlignment="center">
                        <Link
                        to={`${orderAuctionUrlLambda}/create-order?auction=${auction.auction_id}`}
                        target="_self"
                      >
                        <Button kind="plain">Go To Checkout</Button>
                      </Link>
                      </BlockStack>
                    ) : (
                      auction.status === AUCTION_STATUS.NOTIFIED ? (
                        <Grid key={index} columns={['1fr','1fr']} spacing="loose">
                          <Link
                            to={`${orderAuctionUrlLambda}/create-order?auction=${auction.auction_id}`}
                            target="_self"
                          >
                            <BlockStack alignment="center" inlineAlignment="center">
                              <Button kind="plain">Ship</Button>
                            </BlockStack>
                          </Link>
                          <Link
                            to={`${orderAuctionUrlLambda}/create-subscription?auction=${auction.auction_id}`}
                            target="_self"
                          >
                            <Button kind="plain">Storage</Button>
                          </Link>
                        </Grid>
                      ) : (
                        <BlockStack alignment="center" inlineAlignment="center">
                          <Text>N/A</Text>
                        </BlockStack>
                      )
                    )
                  )}
                  <Text />
                </Grid>
              ))}

              <Grid columns={['0.01fr', '1fr', '2fr', '1fr','1fr', '0.01fr']} spacing="tight">
                <Text /> <Text /> <Text /> <Text /> <Text />
                
              </Grid>

              <Grid columns={['0.01fr', '2fr', '0.25fr', '0.25fr', '0.25fr', '0.01fr']} spacing="loose">
                <Text />
                <BlockStack alignment="center">
                  <Text tone="subdued">Page {pagination.page} of {pagination.totalPages}</Text>
                </BlockStack>
                <Text />
                <BlockStack alignment="center">
                  <Button kind="secondary" disabled={pagination.page <= 1} onPress={() => fetchAuctions(pagination.page - 1)}>Prev</Button>
                </BlockStack>
                <BlockStack alignment="center">
                  <Button kind="secondary" disabled={pagination.page >= pagination.totalPages} onPress={() => fetchAuctions(pagination.page + 1)}>Next</Button>
                </BlockStack>
                <Text />
              </Grid>
              <Grid columns={['1fr', '1fr', '0.25fr', '0.25fr', '0.01fr']} spacing="loose">
                <Text /> 
                <Text /> 
                <Text /> 
                <Text /> 
                <Text /> 
              </Grid>
            </>
          ) : (
            authenticated && !loading && !error && (
              <Text tone="subdued">No auctions found.</Text>
            )
          )}
        </BlockStack>
      </Card>
    </BlockStack>
  );
}