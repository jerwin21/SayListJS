"use client";
import React, { useState } from "react";

const Saylist = () => {
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanedMessage = message.replace(/[-']/g, "");
    //take message and clean it.
    let words = cleanedMessage
      .trim()
      .split(/\s+|[,.]+/)
      .filter(Boolean);

    console.log(words);

    try {
      // Call your API endpoint and send the list of words
      const response = await fetch("/api/PlaylistBuilder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: words }), // Sending the list of words as 'message'
      });

      if (response.ok) {
        const result = await response.text(); // or response.json() if your API returns JSON
        console.log(result); // Success handling
        // Update your UI based on success here
      } else {
        // Handle response errors
        console.error("API call failed:", response.statusText);
        // Update your UI based on failure here
      }
    } catch (error) {
      console.error("Failed to call API:", error);
      // Update your UI based on error here
    }
  };

  return (
    <div className="w-full">
      <form className="flex flex-col">
        <textarea
          className="textarea textarea-bordered"
          id="message"
          rows={5}
          placeholder="Type what you'd like to saylist..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <div className="flex justify-between mx-2">
          <div className="text-left">{message.length} / 500</div>
          <div>info button</div>
        </div>
        <div className="flex justify-center">
          <button
            className="btn btn-primary btn-sm w-36"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Saylist;
