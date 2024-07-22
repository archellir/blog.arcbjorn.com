FROM denoland/deno:1.38.3

WORKDIR /app

COPY . .
RUN deno cache main.ts

EXPOSE 8000

CMD ["run", "-A", "main.ts"]