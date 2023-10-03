# curl the backend to make sure it's up

while ! curl "$SERVER_BACKEND_URL" &> /dev/null; do
  echo "Waiting for backend to be ready..."
  sleep 1
done

# build backend and ignore scripts build command
pnpm --filter @ft/frontend run build
pnpm --filter @ft/frontend run start