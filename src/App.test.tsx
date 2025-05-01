import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the main heading", () => {
    render(<App />);
    const headingElement = screen.getByText(/Starter Extension/i);
    expect(headingElement).toBeInTheDocument();
  });

  it('renders the Hello component with "World"', () => {
    render(<App />);
    // Assuming the Hello component renders "Hello World" when given "World" as a person prop
    const helloElement = screen.getByText("Hello World");
    expect(helloElement).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it("contains a button with specific text", () => {
    render(<App />);
    const buttonElement = screen.getByRole("button", { name: /Click Me/i });
    expect(buttonElement).toBeInTheDocument();
  });
});
