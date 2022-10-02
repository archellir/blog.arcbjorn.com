FROM denoland/deno:1.24.1
# FROM lukechannings/deno:latest

# The port that your application listens to.
EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.
USER deno

COPY . .

# ENV DENO_DEPLOYMENT_ID=unique-id

# Cache dependencies
RUN deno cache main.ts --import-map=import_map.json

CMD ["run", "--allow-all", "main.ts"]