import { useStore } from "@tanstack/react-store";
import { premiumStore } from "./purchasesStore";

export function usePremium() {
  return useStore(premiumStore);
}
