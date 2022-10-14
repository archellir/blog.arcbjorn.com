import { FunctionalComponent } from "preact";
import { RSSIcon } from "../components/RSSIcon.tsx";

export const Header: FunctionalComponent = () => {
  return (
    <div class="flex justify-between gap-4 flex-wrap p-12">
      <a href="/" class="cursor-pointer font-bold text-xl font-plex-mono">
        arcbjorn
      </a>
      <div class="flex gap-4">
        <h1 class="text-lg font-plex-sans">thoughtbook</h1>
        <a href="/rss">
          <RSSIcon />
        </a>
      </div>
    </div>
  );
};
