import {
  render,
  fireEvent,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import fetchMock from "fetch-mock";
import mockRouter from "next-router-mock";
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
import Rooms from "../pages/rooms";
import Room from "../pages/[room]";
import UserForm from "../components/UserForm";

// Mock the router
jest.mock("next/router", () => ({
  ...mockRouter,
  useParser: createDynamicRouteParser(["[room]", "rooms"]),
}));

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
          rooms={[{ id: 1, name: "forest" }]}
          setCurrentRoom={setCurrentRoom}
          favoriteRoom={null}
          setFavoriteRoom={jest.fn()}
        />,
      );

      const roomButton = await screen.getByText("forest");
      expect(roomButton).toBeInTheDocument();

      fireEvent.click(roomButton);

      expect(setCurrentRoom).toHaveBeenCalledTimes(1);
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

      const backButton = await screen.getByText("Back to Rooms");
      expect(backButton).toBeInTheDocument();
      fireEvent.click(backButton);

      expect(setCurrentRoom).toHaveBeenCalledTimes(1);
      expect(mockRouter.pathname).toBe("/rooms");
    });

    describe("Room API", () => {
      beforeEach(() => {
        fetchMock.get("/api/rooms/1/loads", [
          {
            id: 1,
            RoomId: 1,
            MachineNum: 1,
            Type: "washer",
            outOfOrder: false,
            loads: [],
          },
          {
            id: 2,
            RoomId: 1,
            MachineNum: 2,
            Type: "washer",
            outOfOrder: false,
            loads: [],
          },
          {
            id: 3,
            RoomId: 1,
            MachineNum: 3,
            Type: "washer",
            outOfOrder: false,
            loads: [],
          },
          {
            id: 4,
            RoomId: 1,
            MachineNum: 4,
            Type: "washer",
            outOfOrder: false,
            loads: [],
          },
          {
            id: 5,
            RoomId: 1,
            MachineNum: 1,
            Type: "dryer",
            outOfOrder: false,
            loads: [],
          },
          {
            id: 6,
            RoomId: 1,
            MachineNum: 2,
            Type: "dryer",
            outOfOrder: false,
            loads: [],
          },
          {
            id: 7,
            RoomId: 1,
            MachineNum: 3,
            Type: "dryer",
            outOfOrder: false,
            loads: [],
          },
          {
            id: 8,
            RoomId: 1,
            MachineNum: 4,
            Type: "dryer",
            outOfOrder: false,
            loads: [],
          },
        ]);

        fetchMock.get("/api/rooms/1/allLoads", [
          {
            id: 1,
            MachineId: 1,
            Duration: 45,
            Start: "2023-04-01T10:00:00Z",
            End: "2023-04-01T10:45:00Z",
            PhoneNum: "123-456-7890",
            Email: null,
          },
          {
            id: 2,
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
        fetchMock.restore();
      });

      test("Validates machine counts", async () => {
        const mockCurrentRoom = { id: 1, Name: "Forest" };
        render(<Room currentRoom={mockCurrentRoom} />);

        await waitFor(() => {
          const washersContainer = screen.getByTestId("washer");
          const washerNums = washersContainer.querySelectorAll(".MuiBox-root");

          expect(washerNums.length).toBe(4);

          const dryersContainer = screen.getByTestId("dryer");
          const dryerNums = dryersContainer.querySelectorAll(".MuiBox-root");
          expect(dryerNums.length).toBe(4);

          const calendar = screen.getByRole("heading", {
            name: /most\/least busy times/i,
          });
          expect(calendar).toBeInTheDocument();
        });
      });

      test("Clicking machine displays UserForm", async () => {
        const mockCurrentRoom = { id: 1, Name: "Forest" };
        render(<Room currentRoom={mockCurrentRoom} />);

        await waitFor(() => {
          const washers = screen.getByTestId("washer");
          const machine = within(washers).getByText(/1/i);
          expect(machine).toBeInTheDocument();

          fireEvent.click(machine);

          const machineForm = screen.getByRole("textbox", { name: /machine/i });
          const phoneNumberForm = screen.getByRole("textbox", {
            name: /phone number/i,
          });
          const emailForm = screen.getByRole("textbox", { name: /email/i });
          const durationForm = screen.getByRole("spinbutton", {
            name: /duration \(minutes\)/i,
          });
          const cancelButton = screen.getByRole("button", { name: /cancel/i });
          const markOutOfOrderButton = screen.getByRole("button", {
            name: /out of order\?/i,
          });
          const loadButton = screen.getByRole("button", {
            name: /start load/i,
          });

          expect(machineForm).toBeInTheDocument();
          expect(phoneNumberForm).toBeInTheDocument();
          expect(emailForm).toBeInTheDocument();
          expect(durationForm).toBeInTheDocument();
          expect(cancelButton).toBeInTheDocument();
          expect(markOutOfOrderButton).toBeInTheDocument();
          expect(loadButton).toBeInTheDocument();
        });
      });

      test.skip("Clicking cancel closes UserForm", async () => {
        const mockCurrentRoom = { id: 1, Name: "Forest" };
        render(<Room currentRoom={mockCurrentRoom} />);

        await waitFor(() => {
          const washers = screen.getByTestId("washer");
          const machine = within(washers).getByText(/1/i);
          expect(machine).toBeInTheDocument();

          fireEvent.click(machine);

          const cancelButton = screen.getByRole("button", { name: /cancel/i });
          fireEvent.click(cancelButton);

          const machineForm = screen.queryByRole("textbox", {
            name: /machine/i,
          });
          expect(machineForm).not.toBeInTheDocument();
        });
      });

      test.skip("Clicking mark out of order button marks machine out of order", async () => {
        const mockCurrentRoom = { id: 1, Name: "Forest" };
        render(<Room currentRoom={mockCurrentRoom} />);

        const washers = screen.getByTestId("washer");
        const machine = within(washers).getByText(/1/i);
        expect(machine).toBeInTheDocument();

        fireEvent.click(machine);

        const markOutOfOrderButton = screen.getByRole("button", {
          name: /mark out of order/i,
        });
        fireEvent.click(markOutOfOrderButton);

        const outOfOrderText = screen.getByText(/out of order/i);
        expect(outOfOrderText).toBeInTheDocument();
      });

      test.skip("Clicking Start Load button closes UserForm", async () => {
        const mockCurrentRoom = { id: 1, Name: "Forest" };
        render(<Room currentRoom={mockCurrentRoom} />);

        await waitFor(() => {
          const washers = screen.getByTestId("washer");
          const machine = within(washers).getByText(/1/i);
          expect(machine).toBeInTheDocument();

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

          fireEvent.change(phoneNumberForm, {
            target: { value: "1234567890" },
          });
          fireEvent.change(emailForm, {
            target: { value: "JohnDoe@email.com" },
          });
          fireEvent.change(durationForm, { target: { value: 30 } });

          expect(machineForm).not.toHaveValue("");
          expect(phoneNumberForm).not.toHaveValue("");
          expect(emailForm).not.toHaveValue("");
          expect(durationForm).not.toHaveValue("");

          const loadButton = screen.getByRole("button", {
            name: /start load/i,
          });
          fireEvent.click(loadButton);

          expect(machineForm).not.toBeInTheDocument();
        });
      });
    });

    describe.skip("UserForm", () => {
      test("Start Load button is disabled when form is empty", async () => {
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

        const loadButton = screen.getByRole("button", { name: /start load/i });
        expect(loadButton).toBeDisabled();
      });

      test("Starting loading updates machine status", () => {
        const mockOnLoad = jest.fn();

        render(
          <UserForm
            id={1}
            RoomId={1}
            machineNum={1}
            Type="washer"
            OutOfOrder={false}
            inUse={false}
            onClose={() => {}}
            onSubmit={mockOnLoad}
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

        fireEvent.click(screen.getByRole("button", { name: /start load/i }));

        expect(mockOnLoad).toHaveBeenCalledWith({
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
});
