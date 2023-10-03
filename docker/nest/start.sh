until pg_isready -h postgres -p 5432 -U $POSTGRES_USER
do
  echo "Waiting for postgres...."
  sleep 2;
done

pnpm --filter @ft/backend prisma migrate deploy
pnpm --filter @ft/backend prisma generate

pnpm --filter @ft/backend run build
pnpm --filter @ft/backend run start

tail -f /dev/null