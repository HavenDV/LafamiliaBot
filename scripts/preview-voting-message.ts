import { getVotingMessageTemplate } from "../src/app/lib/telegram/voting-message";

async function main() {
  console.log(await getVotingMessageTemplate());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
