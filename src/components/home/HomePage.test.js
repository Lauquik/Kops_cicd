import { render, waitFor } from "@testing-library/react";
import React from "react";
import HomePage from "./HomePage";

test("fetches data from /api/items when HomePage is rendered", async () => {
  const mockFetch = jest.fn(() => Promise.resolve({ json: () => [] }));
  global.fetch = mockFetch;

  render(<HomePage />);

  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalledWith("/api/items");
  });
});
