import auth from "./services/googleAuth/googleAuth.js";
import addEventToCallendar from "./operations/addEventToCallendar.js";

const main = async () => {
  const authorization=await auth();
  await addEventToCallendar(authorization);
}

main()