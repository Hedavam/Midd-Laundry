/* implements api/rooms/1/machines/1 route */

import { createRouter } from "next-connect";
import { onError } from "../../../../../../lib/middleware";
import Machines from "../../../../../../../models/Machines";

const router = createRouter();

/* GET method -> will fetch a specific machine in a specific room */
router.get(async (req, res) => {
  const machine = await Machines.query().findById(req.query.machineId);
  res.status(200).json(machine);
});

/* PUT method -> will update a specific machine's status */
router.put(async (req, res) => {
  const { id, ...updatedMachine } = req.body;
  // req.query.id is a string, and so needs to be converted to an integer before comparison
  if (id !== parseInt(req.query.machineId, 10)) {
    /* Verify id in the url, e.g, /api/articles/10, matches the id the request body, so we know we're updating the right thing */
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
