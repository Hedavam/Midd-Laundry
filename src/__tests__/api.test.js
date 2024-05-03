/**
 * @jest-environment node
 *
 * Use Node environment for server-side tests to avoid loading browser libraries.
 * This needs to be the top comment in the file
 */
/* eslint-disable no-return-assign, no-param-reassign */

import { testApiHandler } from "next-test-api-route-handler";
import knex from "../../knex/knex";

/* seed data for testing */
import rooms from "../../data/rooms.json";
// import machines from "../../data/machines.json";
// import loads from "../../data/loads.json";

// /* routes */
import roomsEndpoint from "../pages/api/rooms";
// import machinesEndpoint from "../pages/api/rooms/[id]/loads";

// import machineEndpoint from "../pages/api/machines/[id]";

// import loadsEndpoint from "../pages/api/machines/[id]/loads";
// import loadEndpoint from "../pages/api/loads/[machineId]";

/* TODO: Try diff room, machine, and machine that doesn't exist */

/* Enabling Testing for Database */
describe("End-to-end testing", () => {
  beforeAll(
    () =>
      // Ensure test database is initialized before an tests
      knex.migrate.rollback().then(() => knex.migrate.latest()),
    20000 /* increase time, so our hook doesn't time out */,
  );

  afterAll(() =>
    // Ensure database connection is cleaned up after all tests
    knex.destroy(),
  );

  beforeEach(async () => {
    // Reset contents of the test database
    await knex.seed.run({ specific: "retrieve-rooms.js" });
    await knex.seed.run({ specific: "retrieve-machines.js" });
    await knex.seed.run({ specific: "retrieve-loads.js" });
  });

  /* Tests structured top-down */

  test("GET /api/rooms should return all rooms", async () => {
    await testApiHandler({
      rejectOnHandlerError: true, // Make sure to catch any errors
      pagesHandler: roomsEndpoint, // NextJS API function to test
      test: async ({ fetch }) => {
        // Test endpoint with mock fetch
        const res = await fetch();
        await expect(res.json()).resolves.toMatchObject(rooms);
      },
    });
  });

  //   test("GET /api/rooms/[id] should return all machines in a room", async () => {
  //     await testApiHandler({
  //       rejectOnHandlerError: true, // Make sure to catch any errors
  //       pagesHandler: machinesEndpoint, // NextJS API function to test
  //       params: { id: 1 }, // Testing dynamic routes requires params or patcher
  //       test: async ({ fetch }) => {
  //         // Test endpoint with mock fetch
  //         const res = await fetch();
  //         const resMachines = machines.filter((machine) => machine.id === 1);
  //         await expect(res.json()).resolves.toMatchObject(resMachines);
  //       },
  //     });
  //   });

  //   test("GET /api/machines/[id] should return a specific machine and its latest load", async () => {
  //     await testApiHandler({
  //       rejectOnHandlerError: true, // Make sure to catch any errors
  //       pagesHandler: machineEndpoint, // NextJS API function to test
  //       params: { machineId: 4 }, // Testing dynamic routes requires params or patcher
  //       test: async ({ fetch }) => {
  //         // Test endpoint with mock fetch
  //         const res = await fetch();
  //         /* add in ids to our seed data, find the machine specified in params, then that machine's load w/ End > current time; combine the two */
  //         const resMachine = machines
  //           .map((machine, index) => ({ ...machine, id: index + 1 }))
  //           .find((machine) => machine.id === 4); // TODO: unhardcode this, make it so machine.id === params.machineId (smth like this)
  //         const resLoad = loads
  //           .map((load, index) => ({ ...load, id: index + 1 }))
  //           .find(
  //             (load) =>
  //               load.MachineId === 4 && load.End > new Date().toISOString(),
  //           );
  //         const resMachineWithLoad = { ...resMachine, loads: resLoad };
  //         await expect(res.json()).resolves.toMatchObject(resMachineWithLoad);
  //       },
  //     });
  //   });

  //   /* TODO: Add additional tests for a machine whose latest load's end time < current time
  //     Basically, for a machine's that's free */

  //   test("PUT /api/machines/[id] should update a specific machine's status", async () => {
  //     const updatedMachine = {
  //       id: 1,
  //       ...machines[0],
  //       Status: 1,
  //     }; /* Machine at index 0 has id 1 */
  //     await testApiHandler({
  //       rejectOnHandlerError: true,
  //       pagesHandler: machineEndpoint,
  //       params: { roomId: 1, machineId: updatedMachine.id },
  //       test: async ({ fetch }) => {
  //         const res = await fetch({
  //           method: "PUT",
  //           headers: {
  //             "content-type": "application/json",
  //           },
  //           body: JSON.stringify(updatedMachine),
  //         });
  //         await expect(res.json()).resolves.toMatchObject(updatedMachine);
  //       },
  //     });
  //   });

  //   test("POST /api/machines/[id]/loads should create a new load", async () => {
  //     const newLoad = {
  //       MachineId: 4,
  //       Duration: 60,
  //       Start: "2024-04-30T14:30:00.000Z",
  //       End: "2024-04-30T15:30:00.000Z",
  //       PhoneNum: "555888111",
  //       Email: "thanks@peace.com",
  //     };

  //     await testApiHandler({
  //       rejectOnHandlerError: true,
  //       pagesHandler: loadsEndpoint,
  //       params: {
  //         roomId: 3,
  //         machineId: newLoad.MachineId,
  //       } /* machine 4, is in room 3 */,
  //       test: async ({ fetch }) => {
  //         const res = await fetch({
  //           method: "POST",
  //           headers: {
  //             "content-type": "application/json", // Must use correct content type
  //           },
  //           body: JSON.stringify(newLoad),
  //         });
  //         const resLoad = await res.json();
  //         expect(resLoad).toMatchObject({
  //           ...newLoad,
  //           id: expect.any(Number),
  //         });
  //         expect(loads.includes(resLoad.id)).toBe(false); // id should be unique
  //       },
  //     });
  //   });

  //   test("PUT /api/loads/[machineId] should edit a machine's latest load", async () => {
  //     const updatedLoad = {
  //       id: 4,
  //       ...loads[3],
  //       Duration: 35,
  //     }; /* Machine at index 3 has id 4 */
  //     await testApiHandler({
  //       rejectOnHandlerError: true,
  //       pagesHandler: loadEndpoint,
  //       params: { roomId: 1, machineId: 4, loadId: updatedLoad.id },
  //       test: async ({ fetch }) => {
  //         const res = await fetch({
  //           method: "PUT",
  //           headers: {
  //             "content-type": "application/json",
  //           },
  //           body: JSON.stringify(updatedLoad),
  //         });
  //         await expect(res.json()).resolves.toMatchObject(updatedLoad);
  //       },
  //     });
  //   });
});
