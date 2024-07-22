import { FunctionalComponent } from "preact";
import { PageProps } from "$fresh/server.ts";

const App: FunctionalComponent<PageProps> = ({ Component }) => {
  return (
    <div class="container mx-auto h-full animate-appear">
      <Component />
    </div>
  );
};

export default App;
