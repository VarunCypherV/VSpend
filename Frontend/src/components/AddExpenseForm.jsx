
import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled.h3`
  color: #003366;
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s ease;

  &:hover {
    background: #0056b3;
  }
`;

const TagBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 0.75rem;
`;

const TagItem = styled.div`
  background-color: ${(props) => props.color || "#aaa"};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;

  span {
    margin-left: 8px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      color: #ffdddd;
    }
  }
`;

export default function AddExpenseForm({ onAdd, onTagChange, tags: propTags }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    tags: [],
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTagAdd = (e) => {
    const tagName = e.target.value;
    if (!tagName) return;

    const selectedTag = propTags.find((t) => t.name === tagName);
    if (selectedTag && !formData.tags.some((tag) => tag.name === tagName)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, selectedTag],
      }));
    }

    e.target.value = "";
  };

  const handleTagRemove = (name) => {
    if (name.toLowerCase() === "others") return;
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.name !== name),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.amount || !formData.date) {
      alert("Please fill in all required fields.");
      return;
    }

    let selectedTags = [...formData.tags];

    // Use "others" tag if none selected
    if (selectedTags.length === 0) {
      const othersTag = propTags.find(
        (tag) => tag.name?.toLowerCase() === "others"
      );

      if (!othersTag) {
        alert("‘Others’ tag not found. Please reload the page.");
        return;
      }

      selectedTags.push(othersTag);
    }

    try {
      const payload = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        date: formData.date,
        tags: selectedTags.map((tag) => tag.name),
      };

      await axios.post("http://localhost:8080/api/expenses/add", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      onAdd();

      setFormData({
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        tags: [],
      });
    } catch (err) {
      console.error("Expense add failed", err);
      alert("Failed to add expense.");
    }
  };

  return (
    <Container>
      <Title>Add Expense</Title>

      <Input
        type="text"
        name="title"
        placeholder="Expense title"
        value={formData.title}
        onChange={handleInputChange}
      />

      <Input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleInputChange}
      />

      <Input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleInputChange}
      />

      <Select onChange={handleTagAdd}>
        <option value="">Select Tag</option>
        {/* {propTags.map((tag) => ( */}
        {(propTags || []).map((tag) => (

          <option key={tag.id || tag.name} value={tag.name}>
            {tag.name}
          </option>
        ))}
      </Select>

      <TagBox>
        {/* {formData.tags.map((tag) => ( */}
        {(formData.tags || []).map((tag) => (
          <TagItem key={tag.id || tag.name} color={tag.color}>
            {tag.name}
            {tag.name.toLowerCase() !== "others" && (
              <span onClick={() => handleTagRemove(tag.name)}>×</span>
            )}
          </TagItem>
        ))}
      </TagBox>

      <Button onClick={handleSubmit}>Add Expense</Button>
    </Container>
  );
}
