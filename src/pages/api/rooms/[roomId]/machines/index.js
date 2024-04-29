/* implements api/rooms/1/machines route */

import { createRouter } from "next-connect";
import { onError } from "../../../../../lib/middleware";
import Machines from "../../../../../../models/Machines";

const router = createRouter();

/* GET method -> will fetch all machines in a specific room */
router.get(async (req, res) => {
  const { roomId } = req.query;
  const machines = await Machines.query().where("RoomId", roomId);
  res.status(200).json(machines);
});

// Notice the `onError` middleware for aspect-oriented error handler. That middleware
// will be invoked if the handler code throws an exception.
export default router.handler({ onError });
