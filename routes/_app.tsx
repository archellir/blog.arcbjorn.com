import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Header } from "../components/Header.tsx";

export default function App({ Component }: AppProps) {
  return (
    <div class="container mx-auto h-full animate-appear">
      <Head>
        <link rel="stylesheet" href="/app.css" />
      </Head>

      <Header />

      <Component />
    </div>
  );
}
