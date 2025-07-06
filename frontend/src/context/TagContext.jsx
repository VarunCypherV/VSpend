
// TagContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import apiHandler from "../services/apiHandler"; 

const TagContext = createContext();

export const useTags = () => useContext(TagContext);

export const TagProvider = ({ children }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchTagsAndEnsureOthers();
  }, []);

  const fetchTagsAndEnsureOthers = async () => {
    try {
      const token = localStorage.getItem("token");

      // Step 1: Fetch existing tags
      const response = await apiHandler.get("/api/tags/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let fetchedTags = Array.isArray(response.data) ? response.data : [];

      // Step 2: Check if "others" tag exists
      const hasOthers = fetchedTags.some(
        (tag) => tag.name.toLowerCase() === "others"
      );

      if (!hasOthers) {
        // Step 3: Create "others" tag
        await apiHandler.post(
          "/api/tags/add",
          { name: "others", color: "#999999" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Step 4: Re-fetch tags to include "others"
        const updated = await apiHandler.get("/api/tags/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        fetchedTags = Array.isArray(updated.data) ? updated.data : [];
      }

      setTags(fetchedTags);
    } catch (err) {
      console.error("Failed to fetch or ensure 'others' tag", err);
    }
  };

  const addTag = async (tag) => {
    try {
      const token = localStorage.getItem("token");
      await apiHandler.post("/api/tags/add", tag, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTagsAndEnsureOthers();
    } catch (err) {
      console.error("Add tag failed", err);
    }
  };

  const deleteTag = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await apiHandler.delete(`/api/tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTagsAndEnsureOthers();
    } catch (err) {
      console.error("Delete tag failed", err);
    }
  };

  return (
    <TagContext.Provider value={{ tags, addTag, deleteTag }}>
      {children}
    </TagContext.Provider>
  );
};
