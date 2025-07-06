// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ExpenseTable from "../components/ExpenseTable";
import AddExpenseForm from "../components/AddExpenseForm";
import TagManager from "../components/TagManager";
import ChartAndFilter from "../components/ChartsAndFilters";
import BudgetWarning from "../components/BudgetWarning";
import apiHandler from "../services/apiHandler"; 

const DashboardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr 1fr;
  background-color: #e3feff;
  gap: 1rem;
  /* padding: 1rem; */
  width: 100%;
`;

const Section = styled.div`
  background-color: white;
  border-radius: 20px;
  box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  overflow-y: auto;
  margin: 0.5rem;
`;

const Title = styled.h1`
  grid-column: span 2;
  text-align: center;
  font-family: "Pacifico", cursive;
  font-size: 2.5rem;
  color: darkblue;
  margin-bottom: 1rem;
`;

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [tags, setTags] = useState([]);
  const [BudgetrefreshKey, setBudgetRefreshKey] = useState(0);

  const fetchExpenses = async () => {
    try {
      const res = await apiHandler.get("/api/expenses/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await apiHandler.get("/api/tags/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTags(res.data);
    } catch (err) {
      console.error("Failed to fetch tags", err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);
  useEffect(() => {
    fetchExpenses();
  }, [BudgetrefreshKey]); // 👈 runs every time you update the key

  const handleExpenseChange = () => {
    fetchExpenses();
    setBudgetRefreshKey((prev) => prev + 1);
  };

  return (
    <DashboardWrapper>
      <Title>VExpense</Title>

      <Section>
        <ExpenseTable
          expenses={expenses}
          refreshKey={BudgetrefreshKey}
          onDelete={() => setBudgetRefreshKey((prev) => prev + 1)}
        />
      </Section>

      <Section>
        <AddExpenseForm
          onAdd={() => {
            handleExpenseChange();
            fetchTags();
          }}
          onTagChange={fetchTags} // 🧠 Important!
          tags={tags}
        />

        <TagManager onTagChange={fetchTags} />
      </Section>

      <Section>
        <ChartAndFilter refreshKey={BudgetrefreshKey} />
      </Section>

      <Section>
        <BudgetWarning BudgetrefreshKey={BudgetrefreshKey} />
      </Section>
    </DashboardWrapper>
  );
}

export default Dashboard;
