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
  const handleViewInventory = () => {
    window.location.href = "/tools/storage-inventory";
  };

  const handleSelectWines = () => {
    window.location.href = "/tools/select-wines";
  };

  return (
    <BlockStack spacing="loose">
      <Grid
        columns={['1fr', '1fr']}
        spacing="loose"
      >
        <Button onPress={handleSelectWines}>Select Wines for Shipping</Button>
        <Button onPress={handleViewInventory}>Show Storage Inventory</Button>
      </Grid>
    </BlockStack>
  );
}