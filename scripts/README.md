# Navigation Seed Script

To populate the navigation menu with the "Textures", "Models", and "HDRIs" data as requested, please run the following command:

```bash
node scripts/seed-navigation.js
```

If you encounter any errors about `prisma.navigationItem` being undefined, please try running:

```bash
npx prisma generate
```

and then run the seed script again.

If the changes do not appear on the frontend immediately, you may need to restart your development server.
