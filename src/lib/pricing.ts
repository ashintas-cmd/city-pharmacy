import type { Offer, Pricing, Product, StoreSettings } from "@/types";

export function isOfferLive(offer?: Offer | null, now = new Date()) {
  if (!offer?.active) return false;
  const start = new Date(offer.startDate).getTime();
  const end = new Date(offer.endDate).getTime();
  const t = now.getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return false;
  return t >= start && t <= end;
}

export function getUnitPricing(product: Product, offer?: Offer | null) {
  const offerLive = isOfferLive(offer) && Boolean(product.offerEligible);
  const percent = Math.max(0, Math.min(90, offer?.percent ?? 0));
  const unitPrice = offerLive ? Math.round((product.price * (100 - percent)) / 100) : product.price;
  return {
    unitPrice,
    offerApplied: offerLive,
    offerPercent: offerLive ? percent : 0,
    offerSavings: Math.max(0, product.price - unitPrice),
    mrpSavings: Math.max(0, product.mrp - unitPrice),
  };
}

export function priceCart(
  lines: { product: Product; qty: number }[],
  offer: Offer | null | undefined,
  settings: StoreSettings,
): Pricing {
  let mrpTotal = 0;
  let subtotal = 0;
  let itemCount = 0;

  for (const { product, qty } of lines) {
    const { unitPrice } = getUnitPricing(product, offer);
    mrpTotal += product.mrp * qty;
    subtotal += unitPrice * qty;
    itemCount += qty;
  }

  const offerDiscount = Math.max(0, lines.reduce((sum, { product, qty }) => {
    const { offerApplied, offerSavings } = getUnitPricing(product, offer);
    return sum + (offerApplied ? offerSavings * qty : 0);
  }, 0));

  const deliveryFee =
    subtotal === 0 || subtotal >= settings.freeDeliveryAbove ? 0 : settings.deliveryFee;
  const total = subtotal + deliveryFee;
  const savings = Math.max(0, mrpTotal - subtotal);
  const productSavings = Math.max(0, mrpTotal - subtotal - offerDiscount);
  const freeDeliveryGap = Math.max(0, settings.freeDeliveryAbove - subtotal);

  return {
    mrpTotal,
    subtotal,
    offerDiscount,
    productSavings,
    deliveryFee,
    total,
    savings,
    itemCount,
    freeDeliveryGap,
  };
}
