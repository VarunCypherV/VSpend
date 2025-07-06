import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useTags } from "../context/TagContext";
import { toast } from "react-toastify";
import apiHandler from "../services/apiHandler"; 

const Container = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  box-sizing: border-box;
  margin-top: 1rem;
`;

const Title = styled.h3`
  color: #003366;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1rem;
`;

const TagItem = styled.div`
  background-color: ${(props) => props.color || "#999"};
  color: white;
  border: 2px solid ${(props) => props.color || "#999"};
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: capitalize;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  margin-left: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    color: #ffdddd;
  }
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
`;

const AddBtn = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;
const ColorPickerWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const HiddenColorInput = styled.input`
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const IconOverlay = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ color }) => color || "#ccc"};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const TagManager = ({ onTagChange }) => {
  const { tags, addTag, deleteTag } = useTags();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ff0000");

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;

      const ensureOthersTag = async () => {
        const exists = tags.some((tag) => tag.name?.toLowerCase() === "others");

        if (!exists) {
          try {
            const token = localStorage.getItem("token");
            await apiHandler.post(
              "/api/tags/add",
              { name: "others", color: "#999999" },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`"others" tag created`);
            onTagChange();
          } catch (err) {
            if (err.response?.status === 409) return;
            console.error("Error creating 'others' tag:", err);
            toast.error("Failed to create 'others' tag");
          }
        }
      };

      ensureOthersTag();
    }
  }, [tags, onTagChange]);

  const handleAddTag = async () => {
    if (!name.trim()) return;

    const isDuplicate = tags.some(
      (tag) => tag.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Tag already exists!");
      return;
    }

    await addTag({ name, color });
    toast.success("Tag added successfully!");
    setName("");
    setColor("#ff0000");
    onTagChange();
  };

  const handleDelete = async (id, name) => {
    if (name.toLowerCase() === "others") {
      toast.warn("Cannot delete the 'others' tag!");
      return;
    }
    await deleteTag(id);
    onTagChange();
  };

  return (
    <Container>
      <Title>Manage Tags</Title>

      <TagList>
        {(tags || []).map((tag) => (
          <TagItem key={tag.id} color={tag.color}>
            {tag.name}
            {tag.name.toLowerCase() !== "others" && (
              <RemoveBtn onClick={() => handleDelete(tag.id, tag.name)}>
                ×
              </RemoveBtn>
            )}
          </TagItem>
        ))}
      </TagList>

      <InputRow>
        <Input
          type="text"
          placeholder="Tag name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ColorPickerWrapper>
          <HiddenColorInput
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <IconOverlay color={color}>🎨</IconOverlay>
        </ColorPickerWrapper>

        <AddBtn onClick={handleAddTag}>Add</AddBtn>
      </InputRow>
    </Container>
  );
};

export default TagManager;
