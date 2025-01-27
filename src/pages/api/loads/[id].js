/* will implement the /api/loads/[machineId] route */

/* NOTE: Might not need this in case user messes up load info
    if so, just finish and start new load. 
    BUT, still needed to finish load (update its end time so it's no longer past current time) */

import { createRouter } from "next-connect";
import { onError } from "../../../lib/middleware";
import Loads from "../../../../models/Loads";

const router = createRouter();

/* PUT method -> will update a load's info in case user finished load before duration + buffer or they mess up info set up! */
router.put(async (req, res) => {
  const { id, ...updatedLoad } = req.body;
  // req.query.id is a string, and so needs to be converted to an integer before comparison
  if (id !== parseInt(req.query.id, 10)) {
    // req.query.id is what we feeding from the api route!
    // Verify id in the url, e.g, /api/loads/1, matches the id the request body; hmm, in front-end we won't rlly have notion of loads???
    res.status(400).end(`URL and object does not match`);
    return;
  }
  // Update Database
  const load = await Loads.query()
    .where("id", id)
    .andWhere("MachineId", req.body.MachineId) // the body is the object we're feeding in, so we extract machineId
    .andWhere("End", ">", new Date().toISOString())
    .first();

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
