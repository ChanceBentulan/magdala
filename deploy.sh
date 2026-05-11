set -e

echo "Pulling latest code from Github..."
git pull origin main

echo "Installing dependencies..."
pnpm install

echo "Running database migrations..."
pnpm db:migrate

echo "Building next.js app..."
pnpm build

echo "Restarting application..."
pm2 restart magdala


echo ""
echo "Deployment complete!"
echo "Live at: http://54.79.94.138"
echo ""
echo "check status:"
echo "pm2 status"
echo "pm2 logs magdala"
