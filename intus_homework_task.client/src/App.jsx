import { useEffect, useState } from "react";
import "./App.css";
import ResizableRectangle from "./ResizableRect";

function App() {
  const [rectangle, setRectangle] = useState();
  let abortController;
  useEffect(() => {
    getRectangleData();
  }, []);

  return (
    <div>
      <h1 id="tableLabel">INTUS Windows</h1>
      <p>Drag rectangle by clicking on a corner to resize</p>

      {rectangle ? <ResizableRectangle 
        rectangle={rectangle}
        getRectangle={getRectangleData}
        saveRectangle={saveRectangleData}
      /> : "LOADING:"}
    </div>
  );

  async function getRectangleData() {
    const response = await fetch("Shapes");
    const data = await response.json();
    setRectangle(JSON.parse(data.data));
  }

  async function saveRectangleData(data) {
    if (abortController) {
        abortController.abort();
    }

    abortController = new AbortController();
    const { signal } = abortController;

    try {

        const response = await fetch("Shapes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Cancellation-Token": "unique-token-id",
            },
            body: JSON.stringify(data),
            signal,
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        if (error.name === "AbortError") {
            console.log("Save request canceled");
        } else {
            console.error("Error saving rectangle:", error);
        }
    }
}
}

export default App;
