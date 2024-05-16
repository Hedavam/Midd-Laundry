/* implements api/loads which will get all the loads regardless of machine and room that are yet to finish */
import { createRouter } from "next-connect";
import { onError } from "../../../lib/middleware";
import Machines from "../../../../models/Machines";
import Rooms from "../../../../models/Rooms";

const router = createRouter();

/* set up logic to send emails with SendGrid */
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: {
      name: "MiddLaundry",
      email: "negativezeroisanumber@gmail.com",
    },
    subject,
    html: text,
  };

  try {
    await sgMail.send(msg);
    // console.log("Email Sent");
    return { success: true };
  } catch (error) {
    // console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

router.get(async (req, res) => {
  /* only get machines who have loads that ended, then grab those machine's loads that have yet to end, then sort by desc. and grap top
     This way we can get the load that most recently ended for each machine and proceed with notifications  */
  let latestLoads = await Machines.query()
    .whereExists(
      Machines.relatedQuery("loads").where(
        "End",
        "<=",
        new Date().toISOString(),
      ),
    )
    .withGraphFetched("loads")
    .modifyGraph("loads", (builder) => {
      builder
        .where("End", "<=", new Date().toISOString())
        .orderBy("End", "desc");
    });

  latestLoads = latestLoads.map((machine) => ({
    ...machine,
    loads: [machine.loads[0]],
  }));

  const roomIds = latestLoads.map((machine) => machine.RoomId);
  const rooms = await Rooms.query().findByIds(roomIds);

  /* tried for of instead of forEach, a bit cleaner imo - nvm AirBnB hates for of but i think its nice */
  latestLoads.forEach((machine) => {
    const room = rooms.find((roomObj) => roomObj.id === machine.RoomId);
    const subject = "Your laundry is done!";
    const output = `<h2>Your laundry is ready to be picked up at ${room.Name} in machine: ${machine.MachineNum}!</h2>`; // TODO: would be cool to specify the room as well
    machine.loads.forEach((load) => {
      sendEmail(load.Email, subject, output);
    });
  });

  res.status(200).json(latestLoads);
});

// Notice the `onError` middleware for aspect-oriented error handler. That middleware
// will be invoked if the handler code throws an exception.
export default router.handler({ onError });
