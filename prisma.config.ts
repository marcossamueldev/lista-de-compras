import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Essa linha abaixo faz o Prisma ler o seu .env real!
    url: process.env.DATABASE_URL, 
  },
});