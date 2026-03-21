This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Biome not working

1. Install biome on mac
   brew install biome
2. Install biome on global node_modules
   npm install -g @biomejs/biome
3. Add the below line to vscode settings
   "biome.lsp.bin": "node_modules/@biomejs/cli-darwin-arm64/biome"

# Install nvm

1. curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
2. nvm -v
3. nvm i 25
4. node -v

# Project starter kit

1. bunx create-next-app@latest
2. bunx --bun shadcn@latest init --preset a1EE9GQS
3. bun add @heroui/react framer-motion @hookform/resolvers @hyperse/hero-tel-input @emotion/react @emotion/styled @mui/material @mui/x-data-grid-pro @mui/x-date-pickers-pro @prisma/client @prisma/adapter-pg @protobi/exceljs @react-input/mask @tanstack/react-query axios cookies-next dayjs date-fns dotenv filesize filepond filepond-plugin-file-validate-size filepond-plugin-file-validate-type filepond-plugin-image-preview filepond-plugin-image-validate-size next-themes react-filepond file-type got html-react-parser ioredis mime prisma puppeteer pg react-icons react-hook-form slash zod zustand
4. bun add -D @hookform/devtools
5. bun add jsbarcode (per project additions)
6. bunx prisma init
7. bunx prisma db pull (if db already exists) If not, use
8. bunx prisma generate
9. add prisma.ts file to lib
10. bunx --bun shadcn@latest add alert-dialog alert button breadcrumb button-group calendar card checkbox combobox dialog dropdown-menu input-group input item popover radio-group scroll-area select separator --path src/components/ui/shadcn
    To overwrite existing components, use overwite directive
    - bunx --bun shadcn@latest add alert-dialog --overwrite
11. Add hero.ts file with the below code to /src

`````js
import { heroui } from "@heroui/react";
export default heroui();

11. Add the code below to globals.css

````css
   /* Hero UI */
   @plugin './hero.ts';
   @source '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}';

12. Add lucide-animated icons
   ```bash
    bunx --bun shadcn@latest add "https://lucide-animated.com/r/refresh-cw.json" "https://lucide-animated.com/r/arrow-left.json" "https://lucide-animated.com/r/bookmark-plus.json" "https://lucide-animated.com/r/eye.json" "https://lucide-animated.com/r/eye-off.json" "https://lucide-animated.com/r/plus.json" "https://lucide-animated.com/r/sliders-horizontal.json" "https://lucide-animated.com/r/delete.json" "https://lucide-animated.com/r/boxes.json"  --path src/components/ui/lucide-animated

13. Add reui components (Some like date selector error out so use manual copy paste code in such cases)
   bunx --bun shadcn@latest add @reui/number-field --path src/components/ui/reui

14.
   bunx --bun shadcn@latest add @magicui/animated-theme-toggler --path src/components/ui/magicui

15.
   bunx --bun shadcn@latest add "https://launchuicomponents.com/r/pricing" --path src/components/ui/launchui


bunx --bun shadcn@latest add "https://lucide-animated.com/r/refresh-cw.json" --path src/components/ui/lucide-animated
bunx --bun shadcn@latest add @heroicons-animated/tag --path src/components/ui/heroicons-animated
bunx --bun shadcn@latest add badge --path src/components/ui/shadcn
# kill port

lsof -ti:5432
kill -9 $(lsof -ti:5432)

# Install postgres macos

1. brew update
2. brew install postgresql
3. brew list
4. brew services start postgresql@18

rm /opt/homebrew/var/postgresql@16/postmaster.pid

psql -d foresee -U mmuliro -h localhost -p 5432

# Add custom prisma migration

npx prisma migrate dev --name add_tsvector_column --create-only

# Access Mac postgresDB from parallels windows navicat

1. edit pg_hba.conf
2. get mac ip address from terminal
> ipconfig getifaddr en0
3. add line below to file (edit ip if necessary)
> host all all 192.168.100.84/32 trust
`````
