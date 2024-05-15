import {
  render,
  fireEvent,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import mockRouter from "next-router-mock";
import fetchMock from "fetch-mock-jest";
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
import Rooms from "../pages/rooms";
import Room from "../pages/[room]";
import UserForm from "../components/UserForm";

// Mock the router
jest.mock("next/router", () => ({
  ...mockRouter,
  useParser: createDynamicRouteParser(["[room]", "rooms"]),
}));

// Setup function to render Room component
function renderRoomComponent() {
  render(<Room currentRoom="forest" setCurrentRoom={jest.fn()} />);
}

describe("Front-end Tests", () => {
  describe("Rooms", () => {
    test("Display rooms", async () => {
      render(
        <Rooms
          rooms={[
            { id: 1, Name: "atwater" },
            { id: 2, Name: "coffrin" },
            { id: 3, Name: "forest" },
            { id: 4, Name: "hadley" },
          ]}
          setCurrentRoom={jest.fn()}
          favoriteRoom={null}
          setFavoriteRoom={jest.fn()}
        />,
      );

      const room1 = await screen.getByRole("button", { name: /atwater/i });
      expect(room1).toBeInTheDocument();
    });

    test("Clicking room routes to room", async () => {
      const setCurrentRoom = jest.fn((room) => {
        if (room) {
          mockRouter.push(`/[room]`, `/${room}`);
        } else {
          mockRouter.push("/rooms");
        }
      });

      render(
        <Rooms
          rooms={[{ id: 1, Name: "forest" }]}
          setCurrentRoom={setCurrentRoom}
          favoriteRoom={null}
          setFavoriteRoom={jest.fn()}
        />,
      );

      const roomButton = await screen.getByRole("button", { name: /forest/i });
      expect(roomButton).toBeInTheDocument();

      fireEvent.click(roomButton);

      expect(mockRouter.pathname).toBe("/[room]");
    });
  });

  describe("Room Display", () => {
    test("Clicking back routes to rooms", async () => {
      const setCurrentRoom = jest.fn((room) => {
        if (room) {
          mockRouter.push(`/[room]`, `/${room}}`);
        } else {
          mockRouter.push(`/rooms`);
        }
      });

      render(<Room currentRoom="forest" setCurrentRoom={setCurrentRoom} />);

      const backButton = await screen.getByRole("button", {
        name: /back to rooms/i,
      });
      expect(backButton).toBeInTheDocument();
      fireEvent.click(backButton);

      expect(setCurrentRoom).toHaveBeenCalledTimes(1);
      expect(mockRouter.pathname).toBe("/rooms");
    });

    describe("Room displays washers and dryers", () => {
      beforeEach(() => {
        fetchMock.get("/api/rooms/1/loads", {
          machines: [
            { RoomId: 1, MachineNum: 1, Type: "washer", outOfOrder: false },
            { RoomId: 1, MachineNum: 2, Type: "washer", outOfOrder: false },
            { RoomId: 1, MachineNum: 3, Type: "washer", outOfOrder: false },
            { RoomId: 1, MachineNum: 4, Type: "washer", outOfOrder: false },
            { RoomId: 1, MachineNum: 1, Type: "dryer", outOfOrder: false },
            { RoomId: 1, MachineNum: 2, Type: "dryer", outOfOrder: false },
            { RoomId: 1, MachineNum: 3, Type: "dryer", outOfOrder: false },
            { RoomId: 1, MachineNum: 4, Type: "dryer", outOfOrder: false },
          ],
        });

        fetchMock.get("/api/rooms/1/allLoads", [
          {
            MachineId: 1,
            Duration: 45,
            Start: "2023-04-01T10:00:00Z",
            End: "2023-04-01T10:45:00Z",
            PhoneNum: "123-456-7890",
            Email: null,
          },
          {
            MachineId: 1,
            Duration: 45,
            Start: "2023-04-01T09:00:00Z",
            End: "2023-04-01T09:45:00Z",
            PhoneNum: null,
            Email: "test@test.com",
          },
        ]);
      });

      afterEach(() => {
        fetchMock.reset();
      });

      test.only("validates machine counts", async () => {
        const setCurrentRoom = fetchMock.mockResolvedValueOnce();
        const mockCurrentRoom = {
          id: 1,
          Name: "Forest",
        };

        render(
          <Room
            currentRoom={mockCurrentRoom}
            setCurrentRoom={setCurrentRoom}
          />,
        );
        screen.debug();

        await waitFor(() => {
          const washers = screen.getByRole("heading", { name: /washers/i });
          const washerNums = screen.within(washers).getAllByTestId("washer");
          expect(washerNums).toHaveLength(4);

          const dryers = screen.getByRole("heading", { name: /dryers/i });
          const dryerNums = screen.within(dryers).getAllByTestId("dryer");
          expect(dryerNums).toBeInTheDocument();

          const calendar = screen.getByRole("heading", {
            name: /most\/least busy times/i,
          });
          expect(calendar).toBeInTheDocument();
        });
      });
    });

    test("Clicking machine displays UserForm", async () => {
      renderRoomComponent();

      const washers = screen.getByTestId("washer");
      const machine = within(washers).getByText(/1/i);
      fireEvent.click(machine);
      screen.debug();

      const machineForm = screen.getByRole("textbox", {
        name: /machine/i,
      });
      const phoneNumberForm = screen.getByRole("textbox", {
        name: /phone number/i,
      });
      const emailForm = screen.getByRole("textbox", {
        name: /email/i,
      });
      const durationForm = screen.getByRole("spinbutton", {
        name: /duration \(minutes\)/i,
      });
      const cancelButton = screen.getByRole("button", {
        name: /cancel/i,
      });
      const markOutOfOrderButton = screen.getByRole("button", {
        name: /mark out of order/i,
      });
      const submitButton = screen.getByRole("button", {
        name: /submit/i,
      });

      expect(machineForm).toBeInTheDocument();
      expect(phoneNumberForm).toBeInTheDocument();
      expect(emailForm).toBeInTheDocument();
      expect(durationForm).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      expect(markOutOfOrderButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });

    test("Clicking cancel closes UserForm", async () => {
      renderRoomComponent();

      const washers = screen.getByTestId("washer");
      const machine = within(washers).getByText(/1/i);
      fireEvent.click(machine);

      const cancelButton = screen.getByRole("button", {
        name: /cancel/i,
      });
      fireEvent.click(cancelButton);

      const machineForm = screen.queryByRole("textbox", {
        name: /machine/i,
      });
      expect(machineForm).not.toBeInTheDocument();
    });

    test.skip("Clicking mark out of order button marks machine out of order", async () => {
      render(<Room currentRoom="forest" setCurrentRoom={jest.fn()} />);

      const washers = screen.getByTestId("washer");
      const machine = within(washers).getByText(/1/i);
      fireEvent.click(machine);

      const markOutOfOrderButton = screen.getByRole("button", {
        name: /mark out of order/i,
      });
      fireEvent.click(markOutOfOrderButton);

      const outOfOrderText = screen.getByText(/out of order/i);
      expect(outOfOrderText).toBeInTheDocument();
    });

    test("Submitting UserForm closes UserForm", async () => {
      renderRoomComponent();

      const washers = screen.getByTestId("washer");
      const machine = within(washers).getByText(/1/i);
      fireEvent.click(machine);

      const machineForm = screen.getByRole("textbox", {
        name: /machine/i,
      });
      const phoneNumberForm = screen.getByRole("textbox", {
        name: /phone number/i,
      });
      const emailForm = screen.getByRole("textbox", {
        name: /email/i,
      });
      const durationForm = screen.getByRole("spinbutton", {
        name: /duration \(minutes\)/i,
      });

      fireEvent.change(phoneNumberForm, { target: { value: "1234567890" } });
      fireEvent.change(emailForm, { target: { value: "JohnDoe@email.com" } });
      fireEvent.change(durationForm, { target: { value: 30 } });

      expect(machineForm).not.toHaveValue("");
      expect(phoneNumberForm).not.toHaveValue("");
      expect(emailForm).not.toHaveValue("");
      expect(durationForm).not.toHaveValue("");

      const submitButton = screen.getByRole("button", {
        name: /submit/i,
      });
      fireEvent.click(submitButton);

      expect(machineForm).not.toBeInTheDocument();
    });
  });

  describe.skip("UserForm", () => {
    test("Submit button is disabled when form is empty", async () => {
      render(
        <UserForm
          machineId={1}
          machineNum={1}
          machineType="washer"
          outOfOrder={false}
          inUse={false}
          onClose={jest.fn()}
          onSubmit={jest.fn()}
        />,
      );

      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    test("Submitting form updates machine status", () => {
      const mockOnSubmit = jest.fn();

      render(
        <UserForm
          machineId={1}
          machineNum={1}
          machineType="washer"
          outOfOrder={false}
          inUse={false}
          onClose={() => {}}
          onSubmit={mockOnSubmit}
        />,
      );

      fireEvent.change(screen.getByLabelText(/Phone Number/i), {
        target: { value: "1234567890" },
      });

      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: { value: "test@example.com" },
      });

      fireEvent.change(screen.getByLabelText(/Duration \(minutes\)/i), {
        target: { value: "30" },
      });

      fireEvent.click(screen.getByRole("button", { name: /submit/i }));

      expect(mockOnSubmit).toHaveBeenCalledWith({
        machineId: 1,
        machineNum: 1,
        machineType: "washer",
        phoneNumber: "1234567890",
        email: "test@example.com",
        duration: "30",
        outOfOrder: false,
      });
    });
  });
});
