<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working rules for this repo

Sink and Hermes also work on this repo, so:

- Netlify publishes the live site automatically from GitHub `main`. Never deploy by hand.
- Always start from the latest `main`.
- Work on a branch and open a pull request. Sink merges; never merge yourself.
- Copy is locked: never ship wording Sink hasn't approved. List any new wording for review.
- The site stays stateless: no accounts, cookies or stored entries.
- Check work against the Humane Tech Checklist before calling it done.
