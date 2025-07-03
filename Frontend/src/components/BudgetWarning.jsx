// // src/components/BudgetWarning.jsx
// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import axios from "axios";

// const Box = styled.div`
//   background: white;
//   border-radius: 20px;
//   box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.1);
//   padding: 20px;
//   color: #003366;
// `;

// const Input = styled.input`
//   padding: 8px;
//   margin-bottom: 10px;
//   width: 100%;
//   border-radius: 8px;
//   border: 1px solid #ccc;
// `;

// const Button = styled.button`
//   padding: 8px;
//   width: 100%;
//   background-color: #0077cc;
//   color: white;
//   border: none;
//   border-radius: 8px;
//   margin-bottom: 15px;
//   cursor: pointer;

//   &:hover {
//     background-color: #005fa3;
//   }
// `;

// const Status = styled.div`
//   padding: 10px;
//   border-radius: 10px;
//   background-color: ${(props) => (props.exceeded ? "#ffe0e0" : "#e0ffe0")};
//   color: ${(props) => (props.exceeded ? "red" : "green")};
// `;

// export default function BudgetWarning({ BudgetrefreshKey }) {
//   const [budget, setBudget] = useState(localStorage.getItem("monthlyBudget") || "");
//   const [inputValue, setInputValue] = useState(localStorage.getItem("monthlyBudget") || "");
//   const [monthlySpent, setMonthlySpent] = useState(0);

//   useEffect(() => {
//     const fetchExpenses = async () => {
//       try {
//         const res = await axios.get("http://localhost:8080/api/expenses/all", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });

//         const currentMonth = new Date().getMonth();
//         const currentYear = new Date().getFullYear();

//         const total = res.data
//           .filter((exp) => {
//             const expDate = new Date(exp.date);
//             return (
//               expDate.getMonth() === currentMonth &&
//               expDate.getFullYear() === currentYear
//             );
//           })
//           .reduce((sum, exp) => sum + exp.amount, 0);

//         setMonthlySpent(total);
//       } catch (err) {
//         console.error("Failed to fetch expenses", err);
//       }
//     };

//     // Refresh both monthlySpent and budget
//     fetchExpenses();
//     const newBudget = localStorage.getItem("monthlyBudget") || "";
//     setBudget(newBudget);
//     setInputValue(newBudget);
//   }, [BudgetrefreshKey]);

//   const handleSave = () => {
//     localStorage.setItem("monthlyBudget", inputValue);
//     setBudget(inputValue);
//   };

//   const budgetExceeded = budget && monthlySpent > parseFloat(budget);

//   return (
//     <Box>
//       <h3>Budget Monitor</h3>
//       <Input
//         type="number"
//         placeholder="Set monthly budget"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//       />
//       <Button onClick={handleSave}>Save Budget</Button>

//       {budget && (
//         <Status exceeded={budgetExceeded}>
//           <p><strong>Budget:</strong> ₹{budget}</p>
//           <p><strong>Spent:</strong> ₹{monthlySpent.toFixed(2)}</p>
//           <p><strong>Remaining:</strong> ₹{(budget - monthlySpent).toFixed(2)}</p>
//           {budgetExceeded && <p>⚠️ You have exceeded your budget!</p>}
//         </Status>
//       )}
//     </Box>
//   );
// }

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Box = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  color: #003366;
`;

const Title = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #003366;
`;

const Input = styled.input`
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  width: 100%;
  background-color: #0077cc;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-bottom: 1.2rem;

  &:hover {
    background-color: #005fa3;
  }
`;

const Status = styled.div`
  padding: 1rem;
  border-radius: 12px;
  background-color: ${(props) => (props.exceeded ? "#ffe8e8" : "#eaffea")};
  color: ${(props) => (props.exceeded ? "#cc0000" : "#2e7d32")};
  border: 1px solid ${(props) => (props.exceeded ? "#ffb3b3" : "#b2f0b2")};
`;

const StatusRow = styled.p`
  margin: 0.4rem 0;
  font-size: 1rem;

  strong {
    font-weight: 600;
  }
`;

export default function BudgetWarning({ BudgetrefreshKey }) {
  const [budget, setBudget] = useState(localStorage.getItem("monthlyBudget") || "");
  const [inputValue, setInputValue] = useState(localStorage.getItem("monthlyBudget") || "");
  const [monthlySpent, setMonthlySpent] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/expenses/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const total = res.data
          .filter((exp) => {
            const expDate = new Date(exp.date);
            return (
              expDate.getMonth() === currentMonth &&
              expDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, exp) => sum + exp.amount, 0);

        setMonthlySpent(total);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
    };

    fetchExpenses();
    const newBudget = localStorage.getItem("monthlyBudget") || "";
    setBudget(newBudget);
    setInputValue(newBudget);
  }, [BudgetrefreshKey]);

  const handleSave = () => {
    localStorage.setItem("monthlyBudget", inputValue);
    setBudget(inputValue);
  };

  const budgetExceeded = budget && monthlySpent > parseFloat(budget);

  return (
    <Box>
      <Title>Budget Monitor</Title>
      <Input
        type="number"
        placeholder="Set monthly budget"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button onClick={handleSave}>Save Budget</Button>

      {budget && (
        <Status exceeded={budgetExceeded}>
          <StatusRow><strong>Budget:</strong> ₹{budget}</StatusRow>
          <StatusRow><strong>Spent:</strong> ₹{monthlySpent.toFixed(2)}</StatusRow>
          <StatusRow><strong>Remaining:</strong> ₹{(budget - monthlySpent).toFixed(2)}</StatusRow>
          {budgetExceeded && <StatusRow>⚠️ You have exceeded your budget!</StatusRow>}
        </Status>
      )}
    </Box>
  );
}
