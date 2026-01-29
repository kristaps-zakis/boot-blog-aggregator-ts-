import { setUser, readConfig } from "../config";
// import { createUser, getUser, resetUsersTable, getUsersList } from "../lib/db/queries/users";
import { createUser, getUser, getUsers } from "../lib/db/queries/users";


export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const existingUser = await getUser(userName);
  if (!existingUser) {
    throw new Error(`User ${userName} not found`);
  }

  setUser(existingUser.name);
  console.log("User switched successfully!");

}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length != 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const user = await createUser(userName);
  if (!user) {
    throw new Error(`User ${userName} not found`);
  }

  setUser(user.name);
  console.log("User created successfully!");
}

// export async function handlerCreateUser(cmdName: string, ...args: string[]) {
//   if (args.length !== 1) {
//     throw new Error(`usage: ${cmdName} <name>`);
//   }

//   const userName = args[0];
//   const user = await createUser(userName);

//   setUser(user.name);
//   console.log(`User ${user.name} created successfully!`);
// }

// export async function handlerResetUsersTable(cmdName: string, ...args: string[]) {
//   await resetUsersTable();
//   console.log("Users table reset successfully!");
// }

// export async function handlerGetUsersList(cmdName: string, ...args: string[]) {
//   const users = await getUsersList();

//   const currentUserName = readConfig().currentUserName;
//   console.log(`Current user: ${currentUserName}`);
//   // console.log(`Users list:`);
//   users.forEach((user) => {
//     console.log(`* ${user.name} ${user.name === currentUserName ? "(current)" : ""}`);
//   });
// }

export async function handlerListUsers(_: string) {
  const users = await getUsers();
  const config = readConfig();

  for (let user of users) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
}