/* will implement the /api/loads/[machineId] route */

/* front-end has no notion of loadId!
    also, we never want a specific load by Id 
        -> always a machine's latest one, we only need machineId here. Hence, it's specified in the route */

import { createRouter } from "next-connect";
import { onError } from "../../../lib/middleware";
import Loads from "../../../../models/Loads";

const router = createRouter();

router.put(async (req, res) => {
  const { id, ...updatedLoad } = req.body;
  // req.query.id is a string, and so needs to be converted to an integer before comparison
  if (id !== parseInt(req.query.loadId, 10)) {
    // Verify id in the url, e.g, /api/loads/1, matches the id the request body; hmm, in front-end we won't rlly have notion of loads???
    res.status(400).end(`URL and object does not match`);
    return;
  }
  // Update Database
  const load = await Loads.query()
    .where("MachineId", req.query.machineId)
    .findOne("End", ">", new Date().toISOString());

  if (load) {
    const latestLoad = await load.$query().updateAndFetch(updatedLoad);
    res.status(200).json(latestLoad);
  } else {
    res.status(200).json({});
  }
});

// Notice the `onError` middleware for aspect-oriented error handler. That middleware
// will be invoked if the handler code throws an exception.
export default router.handler({ onError });
