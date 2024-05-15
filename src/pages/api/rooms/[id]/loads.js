/* implements api/rooms/[id]/loads route */

import { createRouter } from "next-connect";
import { onError } from "../../../../lib/middleware";
import Machines from "../../../../../models/Machines";

const router = createRouter();

/* GET method -> will fetch all machines and their latest loads in a specific room */
router.get(async (req, res) => {
  const machineWithLoads = await Machines.query()
    .where("RoomId", req.query.id)
    .withGraphFetched("loads")
    .modifyGraph("loads", (builder) => {
      // Only select load that will finish in the future -> ensuring we get the last load */
      builder.findOne("End", ">", new Date().toISOString());
    });
  /* convert loads to object rather than array, since each machine will only have one load that hasn't finished */
  // machineWithLoads.loads = machineWithLoads.loads[0] || null;
  res.status(200).json(machineWithLoads);
});

// Notice the `onError` middleware for aspect-oriented error handler. That middleware
// will be invoked if the handler code throws an exception.
export default router.handler({ onError });
