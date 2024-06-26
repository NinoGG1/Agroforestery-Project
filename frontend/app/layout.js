import RainbowKitAndChakraProvider from "./RainbowKitAndChakraProvider";
import { Inter } from "next/font/google";

import Layout from "@/components/Layout";
import { EventsProvider } from "@/context/Events";
import { ReadFunctionsProvider } from "@/context/ReadFunctions";
import { MetadataProvider } from "@/context/Metadata";
import { MergeDataProvider } from "@/context/MergeData";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tree Tracker",
  description: "Track the life of trees from seed to forest on the blockchain.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RainbowKitAndChakraProvider>
          <EventsProvider>
            <ReadFunctionsProvider>
              <MetadataProvider>
                <MergeDataProvider>
                  <Layout>{children}</Layout>
                </MergeDataProvider>
              </MetadataProvider>
            </ReadFunctionsProvider>
          </EventsProvider>
        </RainbowKitAndChakraProvider>
      </body>
    </html>
  );
}
