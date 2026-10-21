import { FunctionalComponent } from "preact";

interface IconProps {
  class?: string;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
} as const;

export const ArrowRight: FunctionalComponent<IconProps> = (props) => (
  <svg
    class={props.class}
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    {...stroke}
    aria-hidden="true"
  >
    <path d="M3.5 10h13M11 4.5l5.5 5.5-5.5 5.5" />
  </svg>
);

export const ArrowLeft: FunctionalComponent<IconProps> = (props) => (
  <svg
    class={props.class}
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    {...stroke}
    aria-hidden="true"
  >
    <path d="M16.5 10h-13M9 4.5 3.5 10 9 15.5" />
  </svg>
);

export const ArrowUpRight: FunctionalComponent<IconProps> = (props) => (
  <svg
    class={props.class}
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    {...stroke}
    aria-hidden="true"
  >
    <path d="M6 14 14 6M7.5 6H14v6.5" />
  </svg>
);

// A plus whose vertical bar folds away while its row is busy or open.
export const PlusIcon: FunctionalComponent<IconProps> = (props) => (
  <svg
    class={`plus${props.class ? ` ${props.class}` : ""}`}
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    aria-hidden="true"
  >
    <path d="M3 10h14" />
    <path class="plusBar" d="M10 3v14" />
  </svg>
);

export const SunIcon: FunctionalComponent<IconProps> = (props) => (
  <svg
    class={props.class}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

export const MoonIcon: FunctionalComponent<IconProps> = (props) => (
  <svg
    class={props.class}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);
