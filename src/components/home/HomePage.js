import React, { useState, useEffect } from "react";
import ItemList from "../itemList/ItemList";

function HomePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/items") // Make a GET request to your API endpoint
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  return (
    <section>
      <ItemList items={items} />
    </section>
  );
}

export default HomePage;
