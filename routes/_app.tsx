import { FunctionalComponent } from "preact";
import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

const App: FunctionalComponent<AppProps> = ({ Component }) => {
  return (
    <div class="container mx-auto h-full animate-appear">
      <Component />
    </div>
  );
};

export default App;
