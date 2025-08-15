import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatWindow from "../components/ChatWindow";

describe("ChatWindow", () => {
  it("affiche la fenêtre de chat", () => {
    const { getByText } = render(<ChatWindow />);
    expect(getByText(/Conversations/i)).toBeInTheDocument();
    expect(getByText(/Suggestions/i)).toBeInTheDocument();
  });
});
