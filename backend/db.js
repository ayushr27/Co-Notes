import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
const global = globalThis;

if(process.env.NODE_ENV !== 'production'){
    if(!global.prisma){
        const devPool = new Pool({ connectionString: process.env.DATABASE_URL });
        const devAdapter = new PrismaPg(devPool);
        global.prisma = new PrismaClient({ adapter: devAdapter });
    }
}

export default global.prisma || prisma;