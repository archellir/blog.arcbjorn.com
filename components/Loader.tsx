import { FunctionalComponent } from "preact";

const Loader: FunctionalComponent = () => {
  return (
    <div class="dot-wave">
      <div class="dot-wave__dot"></div>
      <div class="dot-wave__dot"></div>
      <div class="dot-wave__dot"></div>
      <div class="dot-wave__dot"></div>
    </div>
  );
};

export default Loader;
