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
        <Button 
          onPress={() =>
            navigation.navigate({
              target: "customer-account.page.render",
              path: "/extensions/action-account-extension?mode=shipping",
            })
          }
        >
          Select Wines for Shipping
        </Button>
        <Button 
          onPress={() =>
            navigation.navigate({
              target: "customer-account.page.render",
              path: "/extensions/action-account-extension?mode=storage",
            })
          }
        >
          Show Storage Inventory
        </Button>
        <Button to="/actions?mode=shipping">
          Select Wines for Shipping
        </Button>

        <Button to="/actions?mode=storage">
          Show Storage Inventory
        </Button>
      </Grid>
    </BlockStack>
  );
}