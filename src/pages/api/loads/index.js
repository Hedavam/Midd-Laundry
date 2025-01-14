/* implements api/loads which will get all the loads regardless of machine and room that are yet to finish */
import { createRouter } from "next-connect";
import { onError } from "../../../lib/middleware";
import Machines from "../../../../models/Machines";
import Rooms from "../../../../models/Rooms";
import Loads from "../../../../models/Loads";

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
  /* only get machines who have loads that have not been notified, then grab that load, and sort by desc. 
     After sending notification, we change Notified flag to true to avoid resending  */
  let latestLoads = await Machines.query()
    .whereExists(
      Machines.relatedQuery("loads")
        .where("End", "<=", new Date().toISOString())
        .andWhere("Notified", false),
    )
    .withGraphFetched("loads")
    .modifyGraph("loads", (builder) => {
      builder
        .where("End", "<=", new Date().toISOString())
        .andWhere("Notified", false)
        .orderBy("End", "desc");
    });

  latestLoads = latestLoads.map((machine) => ({
    ...machine,
    loads: [machine.loads[0]],
  }));

  const roomIds = latestLoads.map((machine) => machine.RoomId);
  const rooms = await Rooms.query().findByIds(roomIds);

  latestLoads.map(async (machine) => {
    const room = rooms.find((roomObj) => roomObj.id === machine.RoomId);
    const subject = "Your laundry is done!";
    const output = `<h2>Your laundry is ready to be picked up at ${room.Name} in machine: ${machine.MachineNum}!</h2>`;

    const emailPromises = machine.loads.map(async (load) => {
      try {
        const result = await sendEmail(load.Email, subject, output);
        if (result.success) {
          // Update Notified field in DB if we send email successfully!
          await Loads.query().findById(load.id).patch({ Notified: true });
          console.log(`Successfully sent email to ${load.Email}`);
        } else {
          console.error(`Failed to send email to ${load.Email}:`, result.error);
        }
      } catch (error) {
        console.error(`Error sending email to ${load.Email}:`, error);
      }
    });

    await Promise.all(emailPromises);
  });

  res.status(200).json(latestLoads);
});

// Notice the `onError` middleware for aspect-oriented error handler. That middleware
// will be invoked if the handler code throws an exception.
export default router.handler({ onError });
