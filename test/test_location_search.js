/**
 * Multi-Platform End-to-End Address & Location-to-Store Search Test Suite
 * Validates that user address / pincode / coordinates properly resolve local stores
 * across Zepto, Swiggy Instamart, Blinkit, BigBasket (bbnow), and JioMart,
 * and searches specific products with complete store-specific details.
 */

import { PyPriceClient } from '../index.js';

const client = new PyPriceClient();

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('PyPrice End-to-End Address-to-Store & Product Search Test Suite');
  console.log('Platforms: Zepto (4000), Instamart (5000), Blinkit (6001), BigBasket (7001), JioMart (8001)');
  console.log('================================================================\n');

  // Test 1: Store Resolution by Pincode (Bengaluru HSR Layout - 560102)
  console.log('Test 1: Store Discovery via Pincode 560102 (HSR Layout, Bengaluru)');
  try {
    const locRes = await client.resolveLocation({ pincode: '560102' });
    assert(locRes.platforms.zepto.serviceable, 'Zepto serviceable for 560102');
    assert(locRes.platforms.instamart.serviceable, 'Instamart serviceable for 560102');
    assert(locRes.platforms.blinkit.serviceable, 'Blinkit serviceable for 560102');
    assert(locRes.platforms.bigbasket.serviceable, 'BigBasket serviceable for 560102');
    assert(locRes.platforms.jiomart.serviceable, 'JioMart serviceable for 560102');
    
    console.log('    -> Resolved Stores:');
    console.log(`       • Zepto:     ${locRes.platforms.zepto.store?.name} (ETA: ${locRes.platforms.zepto.store?.etaMinutes}m)`);
    console.log(`       • Instamart: ${locRes.platforms.instamart.pod?.storeName} (ETA: ${locRes.platforms.instamart.pod?.sla?.display})`);
    console.log(`       • Blinkit:   ${locRes.platforms.blinkit.store?.name} (ETA: ${locRes.platforms.blinkit.store?.etaMinutes}m)`);
    console.log(`       • BigBasket: ${locRes.platforms.bigbasket.hub?.name} (ETA: ${locRes.platforms.bigbasket.hub?.etaMinutes}m)`);
    console.log(`       • JioMart:   ${locRes.platforms.jiomart.store?.display_name} (ETA: ${locRes.platforms.jiomart.store?.delivery_promise?.eta_mins}m)`);
  } catch (err) {
    assert(false, `Test 1 failed with error: ${err.message}`);
  }

  // Test 2: Store Resolution by GPS Coordinates (Bengaluru - 12.9121, 77.6446)
  console.log('\nTest 2: Store Discovery via GPS Coordinates (12.9121, 77.6446)');
  try {
    const coordRes = await client.resolveLocation({ latitude: 12.9121, longitude: 77.6446 });
    assert(coordRes.platforms.zepto.serviceable, 'Zepto resolves coordinates to nearest store');
    assert(coordRes.platforms.instamart.serviceable, 'Instamart resolves coordinates to nearest pod');
    assert(coordRes.platforms.blinkit.serviceable, 'Blinkit resolves coordinates to nearest dark store');
    assert(coordRes.platforms.bigbasket.serviceable, 'BigBasket resolves coordinates to nearest hub');
    assert(coordRes.platforms.jiomart.serviceable, 'JioMart resolves coordinates to nearest store');
  } catch (err) {
    assert(false, `Test 2 failed with error: ${err.message}`);
  }

  // Test 3: Address String Discovery ("HSR Layout, Bengaluru")
  console.log('\nTest 3: Store Discovery via Formatted Address ("HSR Layout, Bengaluru")');
  try {
    const addrRes = await client.resolveLocation({ address: 'HSR Layout, Bengaluru' });
    assert(addrRes.platforms.zepto.serviceable, 'Zepto serviceable for HSR Layout');
    assert(addrRes.platforms.instamart.serviceable, 'Instamart serviceable for HSR Layout');
    assert(addrRes.platforms.blinkit.serviceable, 'Blinkit serviceable for HSR Layout');
    assert(addrRes.platforms.bigbasket.serviceable, 'BigBasket serviceable for HSR Layout');
    assert(addrRes.platforms.jiomart.serviceable, 'JioMart serviceable for HSR Layout');
  } catch (err) {
    assert(false, `Test 3 failed with error: ${err.message}`);
  }

  // Test 4: Specific Product Search with Location Context ("Amul Butter" at HSR Layout)
  console.log('\nTest 4: Specific Product Search ("Amul Butter") scoped to HSR Layout (560102)');
  try {
    const searchRes = await client.searchByLocation({
      query: 'Amul Butter',
      pincode: '560102',
      limit: 5
    });

    assert(searchRes.platforms.zepto.items.length > 0, 'Zepto returns Amul Butter items for store');
    assert(searchRes.platforms.instamart.items.length > 0, 'Instamart returns Amul Butter items for pod');
    assert(searchRes.platforms.blinkit.items.length > 0, 'Blinkit returns Amul Butter items for store');
    assert(searchRes.platforms.bigbasket.items.length > 0, 'BigBasket returns Amul Butter items for hub');
    assert(searchRes.platforms.jiomart.items.length > 0, 'JioMart returns Amul Butter items for store');

    // Inspect first item structure to verify every required detail is present
    const sampleItem = searchRes.platforms.zepto.items[0];
    assert(sampleItem.name && sampleItem.name.toLowerCase().includes('amul'), 'Product has name/title');
    assert(sampleItem.brand && sampleItem.brand.toLowerCase() === 'amul', 'Product has brand');
    assert(sampleItem.price.storePrice > 0, 'Product has store price (INR)');
    assert(sampleItem.price.mrp >= sampleItem.price.storePrice, 'Product has valid MRP');
    assert(typeof sampleItem.stock.inStock === 'boolean', 'Product has inStock boolean');
    assert(sampleItem.packsize, 'Product has pack size specification');
    assert(sampleItem.delivery.storeName, 'Product has delivery store name');
    assert(sampleItem.delivery.etaMinutes, 'Product has delivery ETA');
    assert(sampleItem.id, 'Product has unique ID for detail lookups');

    console.log('\n    -> Sample Live Product Details (Zepto Store Context):');
    console.log(`       ID:       ${sampleItem.id}`);
    console.log(`       Name:     ${sampleItem.name}`);
    console.log(`       Brand:    ${sampleItem.brand}`);
    console.log(`       Packsize: ${sampleItem.packsize}`);
    console.log(`       Price:    ₹${sampleItem.price.storePrice} (MRP: ₹${sampleItem.price.mrp}, Disc: ${sampleItem.price.discountPercentage}%)`);
    console.log(`       Stock:    ${sampleItem.stock.inStock ? 'IN STOCK' : 'OUT OF STOCK'} (Qty: ${sampleItem.stock.availableQuantity})`);
    console.log(`       Store:    ${sampleItem.delivery.storeName} (ETA: ${sampleItem.delivery.etaMinutes} mins)`);
  } catch (err) {
    assert(false, `Test 4 failed with error: ${err.message}`);
  }

  // Test 5: Cross-Platform Comparison Table for "Milk"
  console.log('\nTest 5: Cross-Platform Price & Availability Comparison for "Milk"');
  try {
    const milkRes = await client.searchByLocation({
      query: 'milk',
      pincode: '560102',
      limit: 5
    });

    assert(milkRes.comparison.length >= 5, 'Comparison matrix contains items across platforms');
    console.log('    -> Cross-Platform Price Comparison (Sorted by Best Price):');
    console.log('    -----------------------------------------------------------------------------------------------------');
    console.log('    | Platform   | Product Name                           | Packsize | Store Price | MRP   | ETA     | Status  |');
    console.log('    -----------------------------------------------------------------------------------------------------');
    for (const item of milkRes.comparison.slice(0, 5)) {
      const plat = item.platform.padEnd(10, ' ');
      const name = (item.name.length > 38 ? item.name.substring(0, 35) + '...' : item.name).padEnd(38, ' ');
      const pack = (item.packsize || 'N/A').padEnd(8, ' ');
      const price = `₹${item.price.storePrice}`.padEnd(11, ' ');
      const mrp = `₹${item.price.mrp}`.padEnd(5, ' ');
      const eta = `${item.delivery.etaMinutes}m`.padEnd(7, ' ');
      const stock = (item.stock.inStock ? 'In Stock' : 'Sold Out').padEnd(7, ' ');
      console.log(`    | ${plat} | ${name} | ${pack} | ${price} | ${mrp} | ${eta} | ${stock} |`);
    }
    console.log('    -----------------------------------------------------------------------------------------------------');
  } catch (err) {
    assert(false, `Test 5 failed with error: ${err.message}`);
  }

  // Test 6: Unserviceable / Remote Location Handling
  console.log('\nTest 6: Unserviceable Location Handling (Out-of-range Coordinates: 0.0, 0.0)');
  try {
    const unserviceableRes = await client.resolveLocation({ latitude: 0.0, longitude: 0.0 });
    assert(!unserviceableRes.platforms.zepto.serviceable, 'Zepto marks 0.0, 0.0 as unserviceable');
    assert(!unserviceableRes.platforms.instamart.serviceable, 'Instamart marks 0.0, 0.0 as unserviceable');
    assert(!unserviceableRes.platforms.blinkit.serviceable, 'Blinkit marks 0.0, 0.0 as unserviceable');
    assert(!unserviceableRes.platforms.bigbasket.serviceable, 'BigBasket marks 0.0, 0.0 as unserviceable');
  } catch (err) {
    assert(false, `Test 6 failed with error: ${err.message}`);
  }

  console.log('\n================================================================');
  console.log(`Test Execution Finished: ${passed} Passed, ${failed} Failed`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
