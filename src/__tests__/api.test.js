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
import machines from "../../data/machines.json";
// import loads from "../../data/loads.json";

/* routes */
import roomsEndpoint from "../pages/api/rooms";

import machinesEndpoint from "../pages/api/rooms/[roomId]/machines";
import machineEndpoint from "../pages/api/rooms/[roomId]/machines/[machineId]";

// import loadsEndpoint from "../pages/api/rooms/[roomId]/machines/[machineId]/loads";
// import loadEndpoint from "../pages/api/rooms/[roomId]/machines/[machineId]/loads/[loadId]";

/* Enabling Testing for Database */
describe("End-to-end testing", () => {
  beforeAll(() =>
    // Ensure test database is initialized before an tests
    knex.migrate.rollback().then(() => knex.migrate.latest()),
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

  test("GET /api/rooms/[roomId]/machines should return all machines in a room", async () => {
    await testApiHandler({
      rejectOnHandlerError: true, // Make sure to catch any errors
      pagesHandler: machinesEndpoint, // NextJS API function to test
      params: { roomId: 1 }, // Testing dynamic routes requires params or patcher
      test: async ({ fetch }) => {
        // Test endpoint with mock fetch
        const res = await fetch();
        const machinesWithRoomId1 = machines.filter(
          (machine) => machine.RoomId === 1,
        );
        await expect(res.json()).resolves.toMatchObject(machinesWithRoomId1);
      },
    });
  });

  test("GET /api/rooms/[roomId]/machines/[machineId] should return status of a specific machine", async () => {
    await testApiHandler({
      rejectOnHandlerError: true, // Make sure to catch any errors
      pagesHandler: machineEndpoint, // NextJS API function to test
      params: { roomId: 1, machineId: 1 }, // Testing dynamic routes requires params or patcher
      test: async ({ fetch }) => {
        // Test endpoint with mock fetch
        const res = await fetch();
        const machineWithId1 = machines.find((machine) => machine.id === 1);
        await expect(res.json()).resolves.toMatchObject(machineWithId1);
      },
    });
  });
  /* TODO: Try diff room, machine, and machine that doesn't exist */

  test("PUT /api/rooms/[roomId]/machines/[machineId] should update a specific machine's status", async () => {
    const updatedMachine = {
      ...machines[0],
      Status: 1,
    }; /* Machine at index 0 has id 1 */
    await testApiHandler({
      rejectOnHandlerError: true,
      pagesHandler: machineEndpoint,
      params: { roomId: 1, machineId: updatedMachine.id },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(updatedMachine),
        });
        await expect(res.json()).resolves.toMatchObject(updatedMachine);
      },
    });
  });

  // test("POST /api/rooms/[roomId]/machines/[machineId]/loads should create a new load", async () => {
  //   const newLoad = {
  //     MachineId: 3,
  //     Duration: 60,
  //     Start: "2024-04-30T14:30:00Z",
  //     End: "2024-04-30T15:30:00Z",
  //     PhoneNum: "555888111",
  //     Email: "thanks@peace.com"
  //   };

  //   await testApiHandler({
  //     rejectOnHandlerError: true,
  //     pagesHandler: loadsEndpoint,
  //     params: { roomId: 3, machineId: newLoad.MachineId},
  //     test: async ({ fetch }) => {
  //       const res = await fetch({
  //         method: "POST",
  //         headers: {
  //           "content-type": "application/json", // Must use correct content type
  //         },
  //         body: JSON.stringify(newLoad),
  //       });
  //       const resLoad = await res.json();
  //       expect(resLoad).toMatchObject({
  //         ...newLoad,
  //         id: expect.any(Number),
  //       });
  //       expect(
  //         loads.includes(resLoad.id),
  //       ).toBe(false); // id should be unique
  //     },
  //   });
  // });
});

//   test("GET api/machines should return all machines", async () => {
//     await testApiHandler({
//       rejectOnHandlerError: true,
//       pagesHandler: articlesEndpoint,
//       test: async ({ fetch }) => {
//         const res = await fetch();
//         await expect(res.json()).resolves.toMatchObject(data);
//       },
//     });
//   });

//   test("GET api/machines?room should return all machines in the room", async () => {
//     await testApiHandler({
//       rejectOnHandlerError: true,
//       pagesHandler: articlesEndpoint,
//       url: "/api/articles?section=C",
//       test: async ({ fetch }) => {
//         const res = await fetch();
//         await expect(res.json()).resolves.toMatchObject(
//           data.filter((machine) => machine.room === res.query.room),
//         );
//       },
//     });
//   });

//   test("GET api/machines/[id] should get a machine with the id", async () => {
//     await testApiHandler({
//       rejectOnHandlerError: true,
//       pagesHandler: articleEndpoint,
//       params: { id: 2 }, // Testing dynamic routes requires params or patcher
//       test: async ({ fetch }) => {
//         const res = await fetch();
//         // Inserted id start at 1, so id of 2 corresponds to data[1]
//         await expect(res.json()).resolves.toMatchObject(data[1]);
//       },
//     });
//   });

//   test("PUT api/machines/[id] should update machine load with request body", async () => {
//     const newArticle = { id: 1, ...data[0], title: "New title" }; // Article at index 0 has id 1
//     await testApiHandler({
//       rejectOnHandlerError: true,
//       pagesHandler: machinesEndpoint,
//       params: { id: newMachine.id },
//       test: async ({ fetch }) => {
//         const res = await fetch({
//           method: "PUT",
//           headers: {
//             "content-type": "application/json",
//           },
//           body: JSON.stringify(newMachine),
//         });
//         await expect(res.json()).resolves.toMatchObject(newMachine);
//       },
//     });
//   });

// });
