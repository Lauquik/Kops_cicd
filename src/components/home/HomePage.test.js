import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";
import {BrowserRouter as Router} from 'react-router-dom';

const countItems = () => {
  const items = screen.getAllByRole('link', { name: /item/i });
  return items.length;
};

// Sample test to verify the number of items
it('should display the correct number of items', () => {

  // Render the component
  render(
    <Router>
      <HomePage />
    </Router>
  );
  const numberOfItems = countItems();
  console.log(numberOfItems);
  // Call the function to count items


  // Assert the expected number of items
  expect(numberOfItems).toBe(10); // Modify the number if needed based on the actual number of items in the document
});