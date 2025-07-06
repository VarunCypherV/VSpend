
import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import apiHandler from "../services/apiHandler"; 

const Card = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px;
  background-color: #0077cc;
  color: white;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #eee;
  color: black;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const Title = styled.h3`
  color: #003366;
  text-align: center;
  font-family: "Cursive", sans-serif;
`;

export default function ExpenseTable({ expenses, onDelete }) {
  const [hoverShown, setHoverShown] = useState(false);

  const handleRightClick = async (e, expenseId) => {
    e.preventDefault();
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (confirmDelete) {
      try {
        await fetch(`/api/expenses/${expenseId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Expense deleted successfully!");
        if (onDelete) onDelete(); // trigger refresh
      } catch (err) {
        toast.error("Failed to delete expense.");
      }
    }
  };

  const handleHover = () => {
    if (!hoverShown) {
      toast.info("💡 Right click an expense to delete it.");
      setHoverShown(true);
    }
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <Card>
      <Title>Expense List</Title>
      <Table>
        <thead>
          <tr>
            <Th>Date</Th>
            <Th>Title</Th>
            <Th>Amount</Th>
            <Th>Tags</Th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses.map((exp, index) => (
            <Tr
              key={index}
              onContextMenu={(e) => handleRightClick(e, exp.id)}
              onMouseEnter={handleHover}
            >
              <Td>{exp.date}</Td>
              <Td>{exp.title}</Td>
              <Td>₹{exp.amount}</Td>
              <Td>
                {exp.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    style={{
                      backgroundColor: tag.color,
                      color: "white",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      marginRight: "8px",
                      fontSize: "0.85rem",
                      border: `2px solid ${tag.color}`,
                      fontWeight: "500",
                      textTransform: "capitalize",
                      cursor: "default",
                      display: "inline-block",
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
