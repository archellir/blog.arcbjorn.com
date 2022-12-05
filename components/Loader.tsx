import { FunctionalComponent } from "preact";

const Loader: FunctionalComponent = () => {
  return (
    <div class="self-center pt-4 pb-12">
      <div class="dot-wave">
        <div class="dot-wave__dot"></div>
        <div class="dot-wave__dot"></div>
        <div class="dot-wave__dot"></div>
        <div class="dot-wave__dot"></div>
      </div>
    </div>
  );
};

export default Loader;
