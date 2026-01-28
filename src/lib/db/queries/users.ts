import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { firstOrUndefined } from "./utils";


export async function createUser(name: string) {
  try {
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
  } catch (error: any) {
    console.error(`Error creating user ${name}:`);
    throw error;
  }
}

export async function getUser(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  return firstOrUndefined(result);
}

export async function resetUsersTable() {
  await db.delete(users);
}

export async function getUsersList() {
  return await db.select().from(users);
}


// export async function createUser(name: string) {
//   try {
//     const [result] = await db.insert(users).values( { name: name }).returning();
//     return result;
//   } catch (error: any) {
//     console.error(`Error creating user ${name}:`);
//     // console.error("Error details:", error);
//     if (error.cause) {
//     //   console.error("Cause:", error.cause);
//     }
//     if (error.code) {
//     //   console.error("Code:", error.code);
//     }
//     throw error;
//   }
// }
