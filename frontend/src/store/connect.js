import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { LOCALES } from '@/utils/constant';
// import { AddEthereumChainParameter } from "@web3-react/types";

const { persistAtom } = recoilPersist({
  key: `walletInfo`,
});

function parseLocale(maybeSupportedLocale) {
  if (typeof maybeSupportedLocale !== 'string') return undefined;
  const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase();
  return LOCALES.find(
    (locale) =>
      locale.toLowerCase() === lowerMaybeSupportedLocale ||
      locale.split('-')[0] === lowerMaybeSupportedLocale
  );
}

export function navigatorLocale() {
  if (typeof window !== 'undefined') {
    if (!navigator.language) return undefined;
    const [language, region] = navigator.language.split('-');
    if (region) {
      return (
        parseLocale(`${language}-${region.toUpperCase()}`) ??
        parseLocale(language)
      );
    }
    return parseLocale(language);
  }
}
export const walletInfo = atom({
  key: `walletInfo`,
  default: {
    chainInfo: {
      netName: '',
      chainId: '',
      rpcUrl: '',
      scanUrl: '',
    },
    networkId: 0,
    network: {
      chainId: 0,
      chainName: '',
      nativeCurrency: {
        name: '',
        symbol: '',
        decimals: 18,
      },
      rpcUrls: [],
    },
    userLocale: navigatorLocale(),
  },
  effects_UNSTABLE: [persistAtom],
});
