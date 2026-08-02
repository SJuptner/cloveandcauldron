# Ship ritual

When the user says **"ship it"**, run this full sequence without pausing for confirmation — the phrase itself is standing authorization to push, merge, and deploy:

1. `git add -A` and commit everything on the `development` branch (write a real commit message describing the changes, not a placeholder).
2. `git push origin development`.
3. Merge `development` into `main` (checkout `main`, merge `development`, no `--no-ff` needed unless conflicts require it).
4. `pnpm build` — this is a local pre-flight sanity check. If it fails, stop and report the error instead of pushing/deploying.
5. `git push origin main`.

Deployment is automatic: this repo is linked to Vercel (project `clove-and-cauldron`, org `sarahjuptner-6865`) via GitHub git integration on the `SJuptner/cloveandcauldron` repo. No `vercel` CLI invocation is needed as part of the ritual — confirmed working via git push alone:

- Push to `development` → Vercel builds and deploys a **preview URL**.
- Push to `main` → Vercel builds and deploys to **production** (cloveandcauldron.co).

So step 2 (push to `development`) already fires a preview deploy, and step 5 (push to `main`) fires the production deploy.

After pushing to `main`, report the commit hash and that the production deploy at cloveandcauldron.co has been triggered.
