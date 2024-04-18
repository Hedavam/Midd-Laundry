import { render } from "@testing-library/react";
import Rooms from "../pages/rooms";

describe("End-to-end testing", () => {
  test("Render index.js component", () => {
    render(<Rooms />);
  });
});
