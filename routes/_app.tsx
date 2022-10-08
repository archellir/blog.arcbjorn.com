import { FunctionalComponent } from "preact";
import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Header } from "../components/Header.tsx";

const App: FunctionalComponent<AppProps> = ({ Component }) => {
  return (
    <div class="container flex flex-col mx-auto h-full animate-appear">
      <Head>
        <link rel="stylesheet" href="/app.css" />
      </Head>

      <Header />

      <Component />
    </div>
  );
};

export default App;
