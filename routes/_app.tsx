import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";

export default function App({ Component }: AppProps) {
  return (
    <div class="container flex flex-col mx-auto h-full animate-appear">
      <Head>
        <link rel="stylesheet" href="/app.css" />
      </Head>

      <Header />

      <Component />

      <Footer />
    </div>
  );
}
