import RainbowKitAndChakraProvider from "./RainbowKitAndChakraProvider";
import { Inter } from "next/font/google";

import Layout from "@/components/Layout";
import { EventsProvider } from "@/context/Events";
import { ReadFunctionsProvider } from "@/context/ReadFunctions";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tree Tracker",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RainbowKitAndChakraProvider>
          <EventsProvider>
            <ReadFunctionsProvider>
              <Layout>{children}</Layout>
            </ReadFunctionsProvider>
          </EventsProvider>
        </RainbowKitAndChakraProvider>
      </body>
    </html>
  );
}
