# Manish Kumar — Portfolio

A responsive, single-page engineering portfolio built with React, TypeScript, and Vite. Portfolio copy and structured career/skill content live in `src/content.ts`; page composition is in `src/App.tsx` and styling in `src/styles.css`.

## Run locally

- `npm install`
- `npm run dev`
- `npm run build` for the production build
- `npm run preview` to serve the built site locally

## Interview preparation kit

The `/preparation-kit` page loads questions and answers from the Quarkus API, which stores them in Cloudflare D1 through the Worker in `../backend/cloudflare-worker/`. Use `/admin` to create, edit, and delete records. Follow `../backend/cloudflare-worker/README.md` to configure the D1 Worker and local Quarkus connection.

## Quarkus API

The Java 25 backend is in `../backend/`. It uses Quarkus 3.40 and calls the D1 Worker for question storage. Set `PREPARATION_D1_WORKER_URL` and `PREPARATION_D1_WORKER_TOKEN` before starting Quarkus; the token belongs only in the backend environment, not in frontend configuration.

Install a Java 25 JDK on your machine first, then select it with `JAVA_HOME` as shown below.

```sh
cd backend
export JAVA_HOME="$(/usr/libexec/java_home -v 25)"
export PATH="$JAVA_HOME/bin:$PATH"
export PREP_ADMIN_TOKEN="choose-a-long-secret"
mvn -Dmaven.repo.local="$PWD/.m2/repository" quarkus:dev
```

The public read endpoints are `GET /api/preparation/questions` (optional `topic` and `difficulty` filters) and `GET /api/preparation/questions/topics`. Admin create/update/delete requests use `X-Admin-Token` and are served at `POST /api/preparation/questions`, `PUT /api/preparation/questions/{id}`, and `DELETE /api/preparation/questions/{id}`. Local dev uses `local-admin-token` unless you set `PREP_ADMIN_TOKEN`; production requires `PREP_ADMIN_TOKEN` to be set. Configure `CORS_ORIGINS` for the frontend origin.

Start the frontend separately with `npm run dev`. Set `VITE_API_URL` if the backend is not at `http://localhost:8080` (for example, in `myProfile/.env.local`).

## Before deployment

1. The supplied résumé is published at `public/resume.pdf`; portfolio links open it in a new browser tab, where visitors can view or download it. Replace this file to update the résumé.
2. Replace `https://YOUR-DOMAIN.example/` in `index.html` and `public/robots.txt` and `public/sitemap.xml` with the final canonical HTTPS domain.
3. Deploy the `dist/` output to a static host (for example, Cloudflare Pages, Netlify, or Vercel) and configure the custom domain and HTTPS there. Set the build command to `npm run build` and the output directory to `dist`. The included `public/_redirects` file provides SPA fallback for hosts that support this format; configure the equivalent rewrite on other hosts so `/preparation-kit` loads directly.
4. The contact form validates its fields in the browser and opens a prefilled email draft. It does not store or transmit submissions. Add a trusted form service or backend if direct submission is needed.

## Updating portfolio content

Edit structured skills and experience in `src/content.ts`; projects, education, contact details, and narrative copy are in `src/App.tsx`. Review the employer case study copy before publication for confidentiality and accuracy.
