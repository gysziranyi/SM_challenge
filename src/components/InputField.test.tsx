import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { InputField } from "./InputField";

describe("InputField component", () => {
  it("renders with label and input", () => {
    render(<InputField id="postcode" label="Irányítószám" />);
    expect(screen.getByLabelText("Irányítószám")).toBeInTheDocument();
  });

  it("calls handleChange on input change", () => {
    const handleChangeMock = jest.fn();
    render(
      <InputField
        id="postcode"
        label="Irányítószám"
        handleChange={handleChangeMock}
      />
    );

    const input = screen.getByLabelText("Irányítószám") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "1111" } });

    expect(handleChangeMock).toHaveBeenCalledTimes(1);
    expect(input.value).toBe("1111");
  });

  it("uses pattern info if entered", () => {
    render(<InputField id="test" pattern="\d+" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("pattern", "\\d+");
  });
});
