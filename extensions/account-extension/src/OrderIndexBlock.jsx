import {
  Badge,
  BlockStack,
  Button,
  Card,
  InlineStack,
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

  const fetchAuctions = async (page = 1) => {
    const customerId = api.authenticatedAccount.customer.current.id;

    if (!customerId) {
      setAuthenticated(false);
      setError("Customer not authenticated");
      return;
    }

    const customerAuctionsUrlLambda = 'https://74391d056253.ngrok-free.app';

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

  const handleShip = async (auctionId) => {
    try {
      await fetch(`https://lambda-url.com/auctions/${auctionId}/ship`, {
        method: "POST",
      });

      fetchAuctions(pagination.page);
    } catch (err) {
      console.error("Error shipping auction:", err);
    }
  };

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

              <Grid columns={['0.01fr', '1.5fr', '2fr', '1fr','0.5fr', '0.01fr']} spacing="loose">
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
                <Grid key={index} columns={['0.01fr', '1.5fr', '2fr', '1fr','0.5fr', '0.01fr']} spacing="loose">
                  <Text />
                  <InlineStack spacing="tight">
                    <Text>{auction.auction_id}</Text>
                    <Badge tone={auction.status === 'ORDER PAID' ? 'success' : (auction.status === 'SUBSCRIPTION CREATED'? 'critical': 'subdued')}>
                      {auction.status === 'ORDER PAID' ? 'Marked as Ship' : (auction.status === 'SUBSCRIPTION CREATED'? 'Marked as Storage': auction.status)}
                    </Badge>                    
                  </InlineStack>
                  <Text>
                    {auction.data_webkul.product_title} 
                  </Text>
                  <Text>{auction.status}</Text>
                  {auction.status === 'SUBSCRIPTION CREATED' ? (
                    <Button kind="plain" onPress={() => handleShip(auction.auction_id)}>Ship</Button>
                  ) : (
                    <BlockStack alignment="center" inlineAlignment="center">
                      <Text>N/A</Text>
                    </BlockStack>
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