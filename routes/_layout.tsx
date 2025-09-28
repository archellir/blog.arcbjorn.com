import { define } from "../fresh.ts";

import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

export default define.layout(({ Component }) => {
  return (
    <div class="flex flex-col h-full">
      <Header />
      <Component />
      <Footer classes="mt-auto" />
    </div>
  );
});
