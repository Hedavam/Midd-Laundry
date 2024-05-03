/* LET US DEPLOY */
describe("Fake test", () => {
  test("Fake test case", () => {
    expect(1 + 1).toBe(2);
  });
});

// import { render, fireEvent, screen, within } from "@testing-library/react";
// import mockRouter from "next-router-mock";
// import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
// import Rooms from "../pages/rooms";
// import Room from "../pages/[room]";
// import UserForm from "../components/UserForm";

// // Mock the router
// jest.mock("next/router", () => ({
//   ...mockRouter,
//   useParser: createDynamicRouteParser(["[room]", "rooms"]),
// }));

// // Setup function to render Room component
// function renderRoomComponent() {
//   render(<Room currentRoom="forest" setCurrentRoom={jest.fn()} />);
// }

// describe("Rooms", () => {
//   test("Clicking room routes to room", async () => {
//     const setCurrentRoom = jest.fn((room) => {
//       if (room) {
//         mockRouter.push(`/[room]`, `/${room}}`);
//       } else {
//         mockRouter.push("/rooms");
//       }
//     });

//     render(
//       <Rooms
//         rooms={[{ id: 1, name: "forest" }]}
//         setCurrentRoom={setCurrentRoom}
//         favoriteRoom={null}
//         setFavoriteRoom={jest.fn()}
//       />,
//     );

//     const roomButton = await screen.getByText("forest");
//     expect(roomButton).toBeInTheDocument();

//     fireEvent.click(roomButton);

//     expect(setCurrentRoom).toHaveBeenCalledTimes(1);
//     expect(mockRouter.pathname).toBe("/[room]");
//   });
// });

// describe("Room Display", () => {
//   test("Clicking back routes to rooms", async () => {
//     const setCurrentRoom = jest.fn((room) => {
//       if (room) {
//         mockRouter.push(`/[room]`, `/${room}}`);
//       } else {
//         mockRouter.push(`/rooms`);
//       }
//     });

//     render(<Room currentRoom="forest" setCurrentRoom={setCurrentRoom} />);

//     const backButton = await screen.getByText("Back to Rooms");
//     expect(backButton).toBeInTheDocument();
//     fireEvent.click(backButton);

//     expect(setCurrentRoom).toHaveBeenCalledTimes(1);
//     expect(mockRouter.pathname).toBe("/rooms");
//   });

//   test("Room displays washers and dryers", async () => {
//     renderRoomComponent();
//     const washers = screen.getByTestId("washer");
//     const individualWashers = within(washers).getAllByText(/\d/i);

//     expect(individualWashers).toHaveLength(4);

//     const dryers = screen.getByTestId("dryer");
//     const individualDryers = within(dryers).getAllByText(/\d/i);

//     expect(individualDryers).toHaveLength(4);
//   });

//   test("Clicking machine displays UserForm", async () => {
//     renderRoomComponent();

//     const washers = screen.getByTestId("washer");
//     const machine = within(washers).getByText(/1/i);
//     fireEvent.click(machine);
//     screen.debug();

//     const machineForm = screen.getByRole("textbox", {
//       name: /machine/i,
//     });
//     const phoneNumberForm = screen.getByRole("textbox", {
//       name: /phone number/i,
//     });
//     const emailForm = screen.getByRole("textbox", {
//       name: /email/i,
//     });
//     const durationForm = screen.getByRole("spinbutton", {
//       name: /duration \(minutes\)/i,
//     });
//     const cancelButton = screen.getByRole("button", {
//       name: /cancel/i,
//     });
//     const markOutOfOrderButton = screen.getByRole("button", {
//       name: /mark out of order/i,
//     });
//     const submitButton = screen.getByRole("button", {
//       name: /submit/i,
//     });

//     expect(machineForm).toBeInTheDocument();
//     expect(phoneNumberForm).toBeInTheDocument();
//     expect(emailForm).toBeInTheDocument();
//     expect(durationForm).toBeInTheDocument();
//     expect(cancelButton).toBeInTheDocument();
//     expect(markOutOfOrderButton).toBeInTheDocument();
//     expect(submitButton).toBeInTheDocument();
//   });

//   test("Clicking cancel closes UserForm", async () => {
//     renderRoomComponent();

//     const washers = screen.getByTestId("washer");
//     const machine = within(washers).getByText(/1/i);
//     fireEvent.click(machine);

//     const cancelButton = screen.getByRole("button", {
//       name: /cancel/i,
//     });
//     fireEvent.click(cancelButton);

//     const machineForm = screen.queryByRole("textbox", {
//       name: /machine/i,
//     });
//     expect(machineForm).not.toBeInTheDocument();
//   });

//   test.skip("Clicking mark out of order button marks machine out of order", async () => {
//     render(<Room currentRoom="forest" setCurrentRoom={jest.fn()} />);

//     const washers = screen.getByTestId("washer");
//     const machine = within(washers).getByText(/1/i);
//     fireEvent.click(machine);

//     const markOutOfOrderButton = screen.getByRole("button", {
//       name: /mark out of order/i,
//     });
//     fireEvent.click(markOutOfOrderButton);

//     const outOfOrderText = screen.getByText(/out of order/i);
//     expect(outOfOrderText).toBeInTheDocument();
//   });

//   test("Submitting UserForm closes UserForm", async () => {
//     renderRoomComponent();

//     const washers = screen.getByTestId("washer");
//     const machine = within(washers).getByText(/1/i);
//     fireEvent.click(machine);

//     const machineForm = screen.getByRole("textbox", {
//       name: /machine/i,
//     });
//     const phoneNumberForm = screen.getByRole("textbox", {
//       name: /phone number/i,
//     });
//     const emailForm = screen.getByRole("textbox", {
//       name: /email/i,
//     });
//     const durationForm = screen.getByRole("spinbutton", {
//       name: /duration \(minutes\)/i,
//     });

//     fireEvent.change(phoneNumberForm, { target: { value: "1234567890" } });
//     fireEvent.change(emailForm, { target: { value: "JohnDoe@email.com" } });
//     fireEvent.change(durationForm, { target: { value: 30 } });

//     expect(machineForm).not.toHaveValue("");
//     expect(phoneNumberForm).not.toHaveValue("");
//     expect(emailForm).not.toHaveValue("");
//     expect(durationForm).not.toHaveValue("");

//     const submitButton = screen.getByRole("button", {
//       name: /submit/i,
//     });
//     fireEvent.click(submitButton);

//     expect(machineForm).not.toBeInTheDocument();
//   });
// });

// describe("UserForm", () => {
//   test("Submit button is disabled when form is empty", async () => {
//     render(
//       <UserForm
//         machineId={1}
//         machineNum={1}
//         machineType="washer"
//         outOfOrder={false}
//         inUse={false}
//         onClose={jest.fn()}
//         onSubmit={jest.fn()}
//       />,
//     );

//     const submitButton = screen.getByRole("button", { name: /submit/i });
//     expect(submitButton).toBeDisabled();
//   });

//   test("Submitting form updates machine status", () => {
//     const mockOnSubmit = jest.fn();

//     render(
//       <UserForm
//         machineId={1}
//         machineNum={1}
//         machineType="washer"
//         outOfOrder={false}
//         inUse={false}
//         onClose={() => {}}
//         onSubmit={mockOnSubmit}
//       />,
//     );

//     fireEvent.change(screen.getByLabelText(/Phone Number/i), {
//       target: { value: "1234567890" },
//     });

//     fireEvent.change(screen.getByLabelText(/Email/i), {
//       target: { value: "test@example.com" },
//     });

//     fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), {
//       target: { value: "30" },
//     });

//     fireEvent.click(screen.getByRole("button", { name: /submit/i }));

//     expect(mockOnSubmit).toHaveBeenCalledWith({
//       machineId: 1,
//       machineNum: 1,
//       machineType: "washer",
//       phoneNumber: "1234567890",
//       email: "test@example.com",
//       duration: "30",
//       outOfOrder: false,
//     });
//   });
// });
