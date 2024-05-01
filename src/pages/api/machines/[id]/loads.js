/* implements api/machines/[id]/loads route */

import { createRouter } from "next-connect";
import { onError } from "../../../../lib/middleware";
import Loads from "../../../../../models/Loads";

const router = createRouter();

/* POST method -> will make a new load */
router.post(async (req, res) => {
  const load = await Loads.query().insertAndFetch(req.body); // https://medium.com/@aidana1529/understanding-the-difference-between-req-params-req-body-and-req-query-e9cf01fc3150
  res.status(200).json(load);
});

// Notice the `onError` middleware for aspect-oriented error handler. That middleware
// will be invoked if the handler code throws an exception.
export default router.handler({ onError });
