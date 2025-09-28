# arcbjorn's thoughts

### Usage (Fresh 2)

Development:

```
deno task dev
```

Build and run production server:

```
deno task build
deno task start
```

If you see a Tailwind oxide warning or Vite crashes in dev, allow oxide's
install scripts once (required by Tailwind v4):

```
deno task oxide
```

You can temporarily disable Tailwind in dev via:

```
NO_TAILWIND=1 deno task dev
```

Update Fresh and deps:

```
deno task update
```
