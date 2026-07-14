import { Providers } from "@/providers/providers";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";


type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};


export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div lang={locale}>
        <Providers>
            {children}
            <Toaster
              position="bottom-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
              }}
            />
     
        </Providers>
      </div>
    </NextIntlClientProvider>
  );
}