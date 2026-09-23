/**
 * Seeds the newsroom with the two posts that used to be hardcoded on /latest.
 *
 * They were real site content before the page started reading from storage, so
 * a fresh deployment needs them put back. Safe to re-run: it skips a post whose
 * slug is already there.
 *
 * The bylines carry the current company name, but the headlines and bodies
 * still say SINAG: these record what happened in 2021, under the name the
 * company held then. Renaming them would claim GEM Global received an award it
 * did not yet exist to receive.
 *
 *   node scripts/seed-news.mjs <base-url> <newsroom-password>
 *
 * e.g. node scripts/seed-news.mjs http://localhost:3000 "$NEWSROOM_PASSWORD"
 */
import { createHash } from "node:crypto";

const [, , base = "http://localhost:3000", password] = process.argv;

if (!password) {
  console.error("usage: node scripts/seed-news.mjs <base-url> <newsroom-password>");
  process.exit(1);
}

const cookie = `sinag_newsroom=${createHash("sha256").update(password).digest("hex")}`;

const posts = [
  {
    title:
      "Sinag awarded by PIDC as one of Top 10 Most Promising Renewable Energy Solutions Provider in 2021",
    date: "2021-06-03",
    author: "GEM Global",
    excerpt:
      "A milestone that reinforced the company\u2019s positioning as an emerging player in clean, reliable, and scalable renewable energy solutions.",
    published: true,
    blocks: [
      {
        id: "pidc-1",
        type: "text",
        text: "Sinag Global Energy Corp. was recognised by PIDC as one of the Top 10 Most Promising Renewable Energy Solutions Providers in 2021.",
      },
      {
        id: "pidc-2",
        type: "text",
        text: "The recognition reinforced the company\u2019s positioning as an emerging player in clean, reliable, and scalable renewable energy solutions.",
      },
    ],
  },
  {
    title:
      "SINAG represented by COO Mr. Danilo Enriquez joins panel at Green and Renewable Innovations for Circular Economy",
    date: "2021-06-03",
    author: "GEM Global",
    excerpt:
      "The event highlighted practical routes to cleaner growth and underscored Sinag\u2019s role in conversations around innovation, renewables, and circular energy systems.",
    published: true,
    blocks: [
      {
        id: "panel-1",
        type: "text",
        text: "SINAG, represented by COO Mr. Danilo Enriquez, joined a panel at Green and Renewable Innovations for Circular Economy.",
      },
      {
        id: "panel-2",
        type: "text",
        text: "The event highlighted practical routes to cleaner growth and underscored Sinag\u2019s role in conversations around innovation, renewables, and circular energy systems.",
      },
    ],
  },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

for (const post of posts) {
  const slug = slugify(post.title);

  const existing = await fetch(`${base}/latest/${slug}`, { redirect: "manual" });
  if (existing.status === 200) {
    console.log(`skip   ${slug} (already published)`);
    continue;
  }

  const response = await fetch(`${base}/api/news`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    // The body of a failure here is usually a whole HTML page. Say what went
    // wrong instead of printing it.
    const reason =
      response.status === 404
        ? `${base} has no /api/news — that deployment does not have the newsroom yet. Deploy the current code first.`
        : response.status === 401
          ? `wrong password, or NEWSROOM_PASSWORD is not set on that deployment.`
          : `HTTP ${response.status}.`;
    console.error(`FAILED ${slug}
       ${reason}`);
    process.exitCode = 1;
    break;
  }

  console.log(`seeded ${(await response.json()).post.slug}`);
}
