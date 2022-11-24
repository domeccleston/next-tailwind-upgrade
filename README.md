# Add Tailwind to a Next.js project

If you use Tailwind with Next.js, you're probably used to following
the steps in [this guide](https://tailwindcss.com/docs/guides/nextjs#app-directory) to install the required dependencies, add a tailwind.config.js with the right files to purge, initialize Tailwind, and add the required @tailwind directives to your globals.css file.

This automates that process for you.

Compatible with Next.js 12 and 13. Supports NPM, Yarn, and PNPM.

## Usage

`npm install next-tailwind-upgrade`
`node ./node_modules/next-tailwind-upgrade/index.js`

This doesn't work with `npx` currently. I don't know why