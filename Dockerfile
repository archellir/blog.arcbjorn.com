# Build the site, then run it with the same Deno the lockfile was made with.
FROM denoland/deno:2.8.3 AS build
WORKDIR /app
COPY deno.json deno.lock ./
RUN deno install --allow-scripts=npm:@tailwindcss/oxide@4.1.13
COPY . .
RUN deno task build

FROM denoland/deno:2.8.3
WORKDIR /app
COPY --from=build /app /app
EXPOSE 8000
CMD ["task", "start"]
