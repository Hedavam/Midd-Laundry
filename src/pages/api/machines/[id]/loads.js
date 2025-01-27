/* implements api/machines/[id]/loads route */

import { createRouter } from "next-connect";
import { onError } from "../../../../lib/middleware";
import Loads from "../../../../../models/Loads";
import Machines from "../../../../../models/Machines";

const router = createRouter();

/* GET method -> will fetch a specific machine and its latest load in a specific room */
router.get(async (req, res) => {
  const machineWithLoads = await Machines.query()
    .findById(req.query.id)
    .withGraphFetched("loads")
    .modifyGraph("loads", (builder) => {
      // Only select load that will finish in the future -> ensuring we get the last load */
      builder.findOne("End", ">", new Date().toISOString());
    });
  // /* convert loads to object rather than array, since each machine will only have one load that hasn't finished */
  // machineWithLoads.loads = machineWithLoads.loads[0] || null;
  res.status(200).json(machineWithLoads);
});

/* POST method -> will make a new load */
router.post(async (req, res) => {
  const load = await Loads.query().insertAndFetch(req.body); // https://medium.com/@aidana1529/understanding-the-difference-between-req-params-req-body-and-req-query-e9cf01fc3150
  res.status(200).json(load);
});

// Notice the `onError` middleware for aspect-oriented error handler. That middleware
// will be invoked if the handler code throws an exception.
export default router.handler({ onError });
