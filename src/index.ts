import { 
    CommandsRegistry,
    registerCommand, 
    runCommand } from "./commands/commands";    
// import { handlerLogin, handlerCreateUser, handlerResetUsersTable, handlerGetUsersList } from "./commands/users";
import {
    handlerListUsers,
    handlerLogin,
    handlerRegister,
  } from "./commands/users";
// import { handlerFetchFeed } from "./commands/aggregate";
// import { handlerAddFeed, handlerGetFeeds, handlerFollowFeed, handlerFollowing } from "./commands/feeds";
// import { middlewareLoggedIn } from "./middleware";



import { handlerReset } from "./commands/reset";
import { handlerAgg } from "./commands/aggregate";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { handlerFollow, handlerListFeedFollows, handlerUnfollow } from "./commands/feed-follows";
import { handlerBrowse } from "./commands/posts";
import { middlewareLoggedIn } from "./middleware";

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log("usage: cli <command> [args...]");
        process.exit(1);
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);
    const commandsRegistry: CommandsRegistry = {};

    // registerCommand(commandsRegistry, "register", handlerCreateUser);
    // registerCommand(commandsRegistry, "login", handlerLogin);
    // registerCommand(commandsRegistry, "reset", handlerResetUsersTable);
    // registerCommand(commandsRegistry, "users", handlerGetUsersList);
    // registerCommand(commandsRegistry, "agg", handlerFetchFeed);
    // registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    // registerCommand(commandsRegistry, "feeds", handlerGetFeeds);
    // registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollowFeed));
    // registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerFollowing));

    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);
    registerCommand(commandsRegistry, "reset", handlerReset);
    registerCommand(commandsRegistry, "users", handlerListUsers);
    registerCommand(commandsRegistry, "agg", handlerAgg);

    registerCommand(
        commandsRegistry,
        "addfeed",
        middlewareLoggedIn(handlerAddFeed),
      );
      registerCommand(commandsRegistry, "feeds", handlerListFeeds);
      registerCommand(
        commandsRegistry,
        "follow",
        middlewareLoggedIn(handlerFollow),
      );
      registerCommand(
        commandsRegistry,
        "following",
        middlewareLoggedIn(handlerListFeedFollows),
      );

    registerCommand(
      commandsRegistry,
      "unfollow",
      middlewareLoggedIn(handlerUnfollow),
    );

    registerCommand(
      commandsRegistry,
      "browse",
      middlewareLoggedIn(handlerBrowse),
    );


    try {
        await runCommand(commandsRegistry, cmdName, ...cmdArgs);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command ${cmdName}: ${err.message}`);
        } else {
            console.error(`Error running command ${cmdName}: ${err}`);
        }

        process.exit(1);
    }

    process.exit(0)
}

main();
