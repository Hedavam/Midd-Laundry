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
import rooms from "../../data/test/rooms.json";
import machines from "../../data/test/machines.json";
import loads from "../../data/test/loads.json";

// /* routes */
import roomsEndpoint from "../pages/api/rooms";
import machinesLoadEndpoint from "../pages/api/rooms/[id]/loads";
import allLoadsEndpoint from "../pages/api/rooms/[id]/allLoads";

import machineEndpoint from "../pages/api/machines/[id]";

import newLoadEndpoint from "../pages/api/machines/[id]/loads";

import updateLoadEndpoint from "../pages/api/loads/[id]";

import pendingLoadsEndpoint from "../pages/api/loads";

/* TODO: Try diff room, machine, and machine that doesn't exist */

/* Enabling Testing for Database */
describe.skip("End-to-end testing", () => {
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

  test("GET /api/rooms/[id] should return all machines in a room", async () => {
    await testApiHandler({
      rejectOnHandlerError: true, // Make sure to catch any errors
      pagesHandler: machinesLoadEndpoint, // NextJS API function to test
      params: { id: 1 }, // Testing dynamic routes requires params or patcher
      test: async ({ fetch }) => {
        // Test endpoint with mock fetch
        const res = await fetch();
        const resMachines = machines.filter((machine) => machine.RoomId === 1);
        await expect(res.json()).resolves.toMatchObject(resMachines);
      },
    });
  });

  test("GET /api/rooms/[id]/loads should return all the machines with their latest load in a given room", async () => {
    await testApiHandler({
      rejectOnHandlerError: true, // Make sure to catch any errors
      pagesHandler: machinesLoadEndpoint, // NextJS API function to test
      params: { id: 1 }, // Testing dynamic routes requires params or patcher
      test: async ({ fetch }) => {
        // Test endpoint with mock fetch
        const res = await fetch();

        /* Add IDs in */
        const machinesWithId = machines.map((machine, index) => ({
          ...machine,
          id: index + 1,
        }));
        const loadsWithId = loads.map((load, index) => ({
          ...load,
          id: index + 1,
        }));

        /* Filter to get [] of machines in given room, for each machine obj, map it to new obj w/ machine info + loads [],
            by iterating through machines and grabbing loads 
            whose MachineId matches machine id from outer "loop" 
            and has End time > current time */
        const resMachineWithLoad = machinesWithId
          .filter((machine) => machine.RoomId === 1)
          .map((machine) => {
            const machineLoad = loadsWithId.filter(
              (load) =>
                load.MachineId === machine.id &&
                load.End > new Date().toISOString(),
            );

            return {
              // explicit return
              ...machine,
              loads: machineLoad,
            };
          });

        await expect(res.json()).resolves.toMatchObject(resMachineWithLoad);
      },
    });
  });

  test("GET /api/rooms/[id]/allLoads should return all the machines with all their loads in a given room", async () => {
    await testApiHandler({
      rejectOnHandlerError: true, // Make sure to catch any errors
      pagesHandler: allLoadsEndpoint, // NextJS API function to test
      params: { id: 1 }, // Testing dynamic routes requires params or patcher
      test: async ({ fetch }) => {
        // Test endpoint with mock fetch
        const res = await fetch();

        /* Add IDs in */
        const machinesWithId = machines.map((machine, index) => ({
          ...machine,
          id: index + 1,
        }));
        const loadsWithId = loads.map((load, index) => ({
          ...load,
          id: index + 1,
        }));

        /* Filter to get [] of machines in given room, for each machine obj, map it to new obj w/ loads [],
            by iterating through machines and grabbing loads 
            whose MachineId matches machine id from outer "loop" */
        const resMachineWithLoad = machinesWithId
          .filter((machine) => machine.RoomId === 1)
          .map((machine) =>
            loadsWithId.filter((load) => load.MachineId === machine.id),
          );

        await expect(res.json()).resolves.toMatchObject(
          resMachineWithLoad.flat(),
        );
      },
    });
  });

  //   /* TODO: Add additional tests for a machine whose latest load's end time < current time
  //     Basically, for a machine's that's free */

  test("GET /api/loads should return all pending loads regardless of room or machine", async () => {
    await testApiHandler({
      rejectOnHandlerError: true, // Make sure to catch any errors
      pagesHandler: pendingLoadsEndpoint, // NextJS API function to test
      params: { id: 1 }, // Testing dynamic routes requires params or patcher
      test: async ({ fetch }) => {
        // Test endpoint with mock fetch
        const res = await fetch();
        const resLoads = loads.filter(
          (load) => load.End > new Date().toISOString(),
        );
        await expect(res.json()).resolves.toMatchObject(resLoads);
      },
    });
  });

  test("PUT /api/machines/[id] should update a specific machine's status", async () => {
    const updatedMachine = {
      /* Machine at index 0 has id 1 */ id: 1,
      ...machines[0] /* Article at index 0 has id 1 */,
      OutOfOrder: false,
    };
    await testApiHandler({
      rejectOnHandlerError: true,
      pagesHandler: machineEndpoint,
      params: { id: updatedMachine.id },
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

  test("POST /api/machines/[id]/loads should create a new load", async () => {
    const newLoad = {
      MachineId: 4,
      Duration: 60,
      Start: "2024-04-30T14:30:00.000Z",
      End: "2024-04-30T15:30:00.000Z",
      PhoneNum: "555888111",
      Email: "thanks@peace.com",
    };

    await testApiHandler({
      rejectOnHandlerError: true,
      pagesHandler: newLoadEndpoint,
      params: {
        id: newLoad.MachineId,
      } /* machine 4, is in room 3 */,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: {
            "content-type": "application/json", // Must use correct content type
          },
          body: JSON.stringify(newLoad),
        });
        const resLoad = await res.json();
        expect(resLoad).toMatchObject({
          ...newLoad,
          id: expect.any(Number),
        });
        expect(loads.includes(resLoad.id)).toBe(false); // id should be unique
      },
    });
  });

  test("PUT /api/loads/[id] should edit a machine's latest load", async () => {
    const updatedLoad = {
      id: 4,
      ...loads[3],
      Duration: 35,
    }; /* Load at index 3 has id 4 */
    await testApiHandler({
      rejectOnHandlerError: true,
      pagesHandler: updateLoadEndpoint,
      params: { id: updatedLoad.id },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(updatedLoad),
        });
        await expect(res.json()).resolves.toMatchObject(updatedLoad);
      },
    });
  });
});
