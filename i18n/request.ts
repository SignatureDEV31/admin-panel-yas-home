import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

const namespaces = [
  "dashboard",
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Charger le fichier principal

  // Charger les namespaces
  const namespaceMessages = Object.assign(
    {},
    ...(await Promise.all(
      namespaces.map(async (namespace) => {
        const messages = await import(`../messages/${locale}/${namespace}.json`);
        return messages.default;
      }),
    )),
  );

  // Fusionner les deux
  const messages = {
    ...namespaceMessages,
  };

  return {
    locale,
    messages,
  };
});
