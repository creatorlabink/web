import { useCountdown } from './useCountdown';

export const EARLY_ADOPTER_PRICE = '$11.97';
export const REGULAR_PRICE = '$257.65/year';

export function useOfferState() {
  const countdown = useCountdown();
  return {
    ...countdown,
    earlyOfferActive: !countdown.expired,
    currentPriceLabel: countdown.expired ? REGULAR_PRICE : EARLY_ADOPTER_PRICE,
  };
}
