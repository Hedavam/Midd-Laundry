/* implements api/loads which will get all the loads regardless of machine and room that are yet to finish */
import { createRouter } from "next-connect";
import { onError } from "../../../lib/middleware";
import Loads from "../../../../models/Loads";

const router = createRouter();

router.get(async (req, res) => {
  const pendingLoads = await Loads.query().where(
    "End",
    ">",
    new Date().toISOString(),
  );
  res.status(200).json(pendingLoads);
});

// Notice the `onError` middleware for aspect-oriented error handler. That middleware
// will be invoked if the handler code throws an exception.
export default router.handler({ onError });
