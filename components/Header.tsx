export default function Header() {
  return (
    <div class="flex items-center justify-between md:justify-evenly gap-4 flex-wrap p-12">
      <a href="/" class="cursor-pointer font-bold text-xl font-plex-mono">
        arcbjorn
      </a>
      <div class="lg:hidden" />
      <h1 class="text-lg font-plex-sans">thoughtbook</h1>
    </div>
  );
}
