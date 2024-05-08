/* implements api/machines/[id]/allLoads route */

import { createRouter } from "next-connect";
import { onError } from "../../../../lib/middleware";
import Machines from "../../../../../models/Machines";

const router = createRouter();

/* GET method -> will fetch all machines and all their loads in a specific room */
router.get(async (req, res) => {
  const machineWithLoads = await Machines.query()
    .where("RoomId", req.query.id)
    .withGraphFetched("loads");

  /* .flat() turns array of arrays into single array */
  const loadsOnly = machineWithLoads.map((machine) => machine.loads).flat();

  res.status(200).json(loadsOnly);
});

// Notice the `onError` middleware for aspect-oriented error handler. That middleware
// will be invoked if the handler code throws an exception.
export default router.handler({ onError });
