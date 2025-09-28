import { FunctionalComponent } from "preact";

const Introduction: FunctionalComponent = () => {
  return (
    <div class="self-center text-center p-8 max-w-screen-lg text-sm sm:text-base lg:border-x border-t border-dashed border-gray-400">
      <div class="p-1">
        My name is Oleg{" "}
        <span class="text-green-400">[al'eg]</span>. Online handle is @<a
          target="_blank"
          href="https://arcbjorn.com"
          class="wavy-link"
        >
          arcbjorn
        </a>.
      </div>
      <div class="p-1">
        Here I share my explorations of system design, algorithms, math,
        networks, databases, operational systems, blockchain, programming
        languages & patterns, web related tech.
      </div>
    </div>
  );
};

export default Introduction;
