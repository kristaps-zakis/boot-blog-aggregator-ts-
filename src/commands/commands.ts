// import { readConfig } from "src/config";
// import { getUser } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

export type CommandHandler = (
  cmdName: string, 
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand (
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  await handler(cmdName, ...args);
}

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void> | void;


// export function n(handler: UserCommandHandlerr): CommandHandler {
//   return async (cmdName: string, ...args: string[]) => {
//     const config = readConfig();
//     const user = await getUser(config.currentUserName);

//     if (!user) {
//       throw new Error(`User ${config.currentUserName} not found`);
//     }

//     await handler(cmdName, user, ...args);
//   };
// }