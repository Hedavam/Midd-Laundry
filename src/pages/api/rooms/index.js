/* implements api/rooms route */

import { createRouter } from "next-connect";
import { onError } from "../../../lib/middleware";
import Rooms from "../../../../models/Rooms";

const router = createRouter();

/* GET method -> will fetch all rooms */
router.get(async (req, res) => {
  const rooms = await Rooms.query();
  res.status(200).json(rooms);
});

// Notice the `onError` middleware for aspect-oriented error handler. That middleware
// will be invoked if the handler code throws an exception.
export default router.handler({ onError });
