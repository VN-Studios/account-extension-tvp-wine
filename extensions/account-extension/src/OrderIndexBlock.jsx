import {
  BlockStack,
  Button,
  reactExtension,
  useApi,
} from "@shopify/ui-extensions-react/customer-account";
import { Grid } from "@shopify/ui-extensions/checkout";

export default reactExtension(
  "customer-account.order-index.block.render",
  () => <WineOptions />
);

function WineOptions() {
  const { navigation } = useApi();

  return (
    <BlockStack spacing="loose">
      <Grid
        columns={['1fr', '1fr']}
        spacing="loose"
      >
        <Button to="/account/extensions/action-account-extension?mode=shipping">
          Select Wines for Shipping
        </Button>

        <Button to="/account/extensions/action-account-extension?mode=storage">
          Show Storage Inventory
        </Button>
      </Grid>
    </BlockStack>
  );
}