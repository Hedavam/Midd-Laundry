// import { render } from "@testing-library/react";
// import Rooms from "../pages/rooms";
// import { knex } from "../..knex.js";

// describe("End-to-end testing", () => {
//   beforeAll(() =>
//     // Ensure test database is initialized before an tests
//     knex.migrate.rollback().then(() => knex.migrate.latest()),
//   );

//   afterAll(() =>
//     // Ensure database connection is cleaned up after all tests
//     knex.destroy(),
//   );

//   beforeEach(() =>
//     // Reset contents of the test database
//     knex.seed.run(),
//   );

//   test("Render index.js component", () => {
//     // render(<Rooms />);
//   });

//   test("GET api/rooms should return all rooms", async () => {
//     await testApiHandler({
//       rejectOnHandlerError: true, // Make sure to catch any errors
//       pagesHandler: sectionsEndpoint, // NextJS API function to test
//       test: async ({ fetch }) => {
//         // Test endpoint with mock fetch
//         const res = await fetch();
//         await expect(res.json()).resolves.toStrictEqual(["Forest", "Coffrin", "Atwater"]);
//       },
//     });
//   });

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
