# Deploying on the VM

Next runs on `127.0.0.1:3000` under pm2. nginx listens on 80/443 and proxies to
it. Nothing but nginx should be reachable from outside.

## First time

**1. Node 20.9+.** The VM shipped with 18, which Next 16 refuses.

```bash
node -v                       # if this is v18.x, do the next two lines
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**2. Build.**

```bash
cd ~/sinag-website-demo
npm ci
npm run build
```

If the build is `Killed`, the box is out of memory. Check `free -h`; add swap:

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**3. The inbox password.** Without this the inbox shows nothing — by design.

```bash
echo 'INQUIRIES_PASSWORD=<long and hard to guess>' > .env.local
```

`.env.local` is gitignored, so it never leaves the server and is never
overwritten by a pull. Next reads it at startup.

**4. pm2.**

```bash
sudo npm i -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup          # prints a sudo command — run what it prints
```

`pm2 save` records the running set; `pm2 startup` makes it come back after a
reboot. Skipping either means the site dies on the next restart.

**5. nginx.**

```bash
sudo apt-get install -y nginx
sudo cp deploy/nginx-sinag.conf /etc/nginx/sites-available/sinag
sudo ln -sf /etc/nginx/sites-available/sinag /etc/nginx/sites-enabled/sinag
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

The site now answers on port 80. Edit `server_name` in that file once DNS
points at the box, then run certbot for HTTPS (command is in the config).

**6. Firewall**, if ufw is on. Port 3000 stays closed — nginx reaches it over
loopback.

```bash
sudo ufw allow 'Nginx Full'
sudo ufw deny 3000
```

## Every deploy after that

```bash
cd ~/sinag-website-demo
git pull
npm ci
npm run build
pm2 restart sinag
```

`npm ci` is only strictly needed when `package-lock.json` changed, but it is
cheap and skipping it when a dependency moved gives confusing failures.

## Checking it

```bash
pm2 status
pm2 logs sinag --lines 50
curl -sI http://127.0.0.1:3000 | head -1     # Next itself
curl -sI http://localhost | head -1          # through nginx
```

## Why the config looks the way it does

- **nginx serves `public/` directly** (the `.mp4|.png|...` location). Next serves everything under
  `public/` with `max-age=0`, so all three hero videos revalidate on every page load. Off disk with
  a 30-day cache, that traffic never reaches Node. `try_files ... @next` falls back for anything
  not on disk.
- **Compression is nginx's, not Next's.** `next.config.ts` sets `compress: false`. Node gzipping
  every response ties up the single Next process; nginx is faster and parallel.
- **Proxy buffering stays on** (the default). With it off nginx streams from Next and holds that
  connection for as long as a slow client takes to read — and there is exactly one Next process.

## Two things that bite

**`X-Forwarded-For` must be set** (it is, in the supplied config). The inquiry
rate limit keys on it. Without it nginx is the only client Next ever sees, so
one submission locks out every visitor for five minutes.

**Submissions live in `data/inquiries.json` on this box.** They are not in git
and not on Vercel. Back the file up if the inquiries matter:

```bash
cp data/inquiries.json ~/backups/inquiries-$(date +%F).json
```
