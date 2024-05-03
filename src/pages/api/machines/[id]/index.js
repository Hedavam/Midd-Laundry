/* implements api/machines/[id] route */

import { createRouter } from "next-connect";
import { onError } from "../../../../lib/middleware";
import Machines from "../../../../../models/Machines";

const router = createRouter();

/* Might have to get rid of this */
// /* GET method -> will fetch a specific machine and its latest load in a specific room */
// router.get(async (req, res) => {
//   const machineWithLoads = await Machines.query()
//     .findById(req.query.machineId)
//     .withGraphFetched("loads")
//     .modifyGraph("loads", (builder) => {
//       // Only select load that will finish in the future -> ensuring we get the last load */
//       builder.findOne("End", ">", new Date().toISOString());
//     });
//   /* convert loads to object rather than array, since each machine will only have one load that hasn't finished */
//   machineWithLoads.loads = machineWithLoads.loads[0] || null;
//   res.status(200).json(machineWithLoads);
// });

/* PUT method -> should update a specific machine's Status */
router.put(async (req, res) => {
  const { id, ...updatedMachine } = req.body;
  // req.query.id is a string, and so needs to be converted to an integer before comparison
  if (id !== parseInt(req.query.id, 10)) {
    /* Verify id in the url, e.g, /api/machines/1, matches the id the request body, so we know we're updating the right thing */
    res.status(400).end(`URL and object does not match`);
    return;
  }
  // Update the database ...
  const machine = await Machines.query().updateAndFetchById(id, updatedMachine);
  res.status(200).json(machine);
});

// Notice the `onError` middleware for aspect-oriented error handler. That middleware
// will be invoked if the handler code throws an exception.
export default router.handler({ onError });
