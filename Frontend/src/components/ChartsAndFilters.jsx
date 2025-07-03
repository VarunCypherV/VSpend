import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import ExpenseTable from "../components/ExpenseTable";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  box-sizing: border-box;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
`;

const SelectDiv = styled.select`
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  background: ${(props) => (props.secondary ? "#6c757d" : "#007bff")};
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) => (props.secondary ? "#5a6268" : "#0056b3")};
  }

  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const ToggleBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ToggleButton = styled(Button)`
  background: ${(props) => (props.active ? "#003366" : "#f1f1f1")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: ${(props) => (props.active ? "none" : "1px solid #ccc")};

  &:hover {
    background: ${(props) => (props.active ? "#002244" : "#e0e0e0")};
  }
`;
const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

const ChartContainer = styled.div`
  height: 300px;
`;

const NoData = styled.div`
  background: #f9f9f9;
  border: 1px dashed #ccc;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 12px;
  color: #555;
`;

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4CAF50",
  "#9966FF",
  "#FF9F40",
  "#8e44ad",
  "#2ecc71",
];

export default function ChartAndFilter({ refreshKey }) {
  const today = new Date();
  const priorDate = new Date();
  priorDate.setDate(today.getDate() - 30);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const setDate = () => {
    const today = new Date();
    const priorDate = new Date();
    priorDate.setDate(today.getDate() - 30);

    const formatDate = (date) => date.toISOString().split("T")[0];

    setFrom(formatDate(priorDate));
    setTo(formatDate(today));
  };

  const [from, setFrom] = useState(formatDate(priorDate));
  const [to, setTo] = useState(formatDate(today));

  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [tagTotals, setTagTotals] = useState([]);
  const [view, setView] = useState("pie"); // pie | bar | table
  const [barType, setBarType] = useState("monthly"); // monthly | yearly
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchFilteredData();
  }, [from, to, selectedTags, barType, refreshKey]);

  const fetchTags = async () => {
    const res = await axios.get("http://localhost:8080/api/tags/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setAvailableTags(res.data);
  };

  const fetchFilteredData = async () => {
    if (new Date(from) > new Date(to)) {
      alert("From date cannot be later than To date.");
      return;
    }

    const params = new URLSearchParams();
    params.append("from", from);
    params.append("to", to);
    selectedTags.forEach((tag) => params.append("tags", tag));

    try {
      const [expenseRes, pieRes, barRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/expenses/filter?${params}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(`http://localhost:8080/api/expenses/totals?${params}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(
          `http://localhost:8080/api/expenses/barData?view=${barType}&${params}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
      ]);

      setExpenses(expenseRes.data);

      const totals = Object.entries(pieRes.data).map(([name, value]) => ({
        name,
        value,
      }));
      setTagTotals(totals);

      const transformedBar = Object.entries(barRes.data).map(
        ([key, value]) => ({
          [barType === "monthly" ? "month" : "year"]: key,
          ...value,
        })
      );
      setBarData(transformedBar);
    } catch (err) {
      console.error("Error fetching filtered data", err);
    }
  };

  const handleReset = () => {
    setDate();
    setSelectedTags([]);
    setExpenses([]);
    setTagTotals([]);
    setBarData([]);
  };

  return (
    <Container>
      <Filters>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label>From</Label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label>To</Label>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label>Filter by Tags</Label>
        
          <Select
            isMulti
            options={availableTags.map((tag) => ({
              value: tag.name,
              label: tag.name,
            }))}
            value={selectedTags.map((tagName) => ({
              value: tagName,
              label: tagName,
            }))}
            onChange={(selectedOptions) =>
              setSelectedTags(selectedOptions.map((opt) => opt.value))
            }
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "10px",
                padding: "2px 4px",
                borderColor: "#ccc",
                fontSize: "0.95rem",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#007bff",
                color: "white",
                borderRadius: "20px",
                padding: "0 6px",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "white",
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: "white",
                ":hover": {
                  backgroundColor: "#0056b3",
                  color: "white",
                },
              }),
            }}
          />
        </div>

        <div style={{ alignSelf: "flex-end", display: "flex", gap: "0.5rem" }}>
          <Button onClick={handleReset} secondary>
            Reset
          </Button>
        </div>
      </Filters>

      {/* Toggle */}
      <ToggleBar>
        <ToggleButton active={view === "pie"} onClick={() => setView("pie")}>
          Pie Chart
        </ToggleButton>
        <ToggleButton active={view === "bar"} onClick={() => setView("bar")}>
          Bar Chart
        </ToggleButton>
        <ToggleButton
          active={view === "table"}
          onClick={() => setView("table")}
        >
          Expense Table
        </ToggleButton>
      </ToggleBar>

      {/* Pie Chart */}
      {view === "pie" &&
        (tagTotals.length === 0 ? (
          <NoData>No data to display</NoData>
        ) : (
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tagTotals}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {tagTotals.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ))}

      {/* Bar Chart */}
      {view === "bar" && (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <SelectDiv
              value={barType}
              onChange={(e) => setBarType(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </SelectDiv>
          </div>
          {barData.length === 0 ? (
            <NoData>No data to display</NoData>
          ) : (
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={barType === "monthly" ? "month" : "year"} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {availableTags.map((tag, idx) => (
                    <Bar
                      key={tag.name}
                      dataKey={tag.name}
                      fill={COLORS[idx % COLORS.length]}
                      stackId="stack"
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </>
      )}

      {/* Table */}
      {view === "table" &&
        (expenses.length === 0 ? (
          <NoData>No data to display</NoData>
        ) : (
          <ExpenseTable expenses={expenses} />
        ))}
    </Container>
  );
}
