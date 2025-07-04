
// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import axios from "axios";

// const Box = styled.div`
//   background: white;
//   border-radius: 20px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
//   padding: 1.5rem;
//   color: #003366;
// `;

// const Title = styled.h3`
//   margin-bottom: 1rem;
//   font-size: 1.2rem;
//   color: #003366;
// `;

// const Input = styled.input`
//   padding: 0.6rem 1rem;
//   margin-bottom: 1rem;
//   width: 100%;
//   border-radius: 10px;
//   border: 1px solid #ccc;
//   font-size: 1rem;
//   box-sizing: border-box;
// `;

// const Button = styled.button`
//   padding: 0.6rem 1.2rem;
//   width: 100%;
//   background-color: #0077cc;
//   color: white;
//   border: none;
//   border-radius: 10px;
//   font-weight: 600;
//   cursor: pointer;
//   transition: background 0.2s ease;
//   margin-bottom: 1.2rem;

//   &:hover {
//     background-color: #005fa3;
//   }
// `;

// const Status = styled.div`
//   padding: 1rem;
//   border-radius: 12px;
//   background-color: ${(props) => (props.exceeded ? "#ffe8e8" : "#eaffea")};
//   color: ${(props) => (props.exceeded ? "#cc0000" : "#2e7d32")};
//   border: 1px solid ${(props) => (props.exceeded ? "#ffb3b3" : "#b2f0b2")};
//   margin-bottom: 1rem;
// `;

// const StatusRow = styled.p`
//   margin: 0.4rem 0;
//   font-size: 1rem;

//   strong {
//     font-weight: 600;
//   }
// `;

// export default function BudgetWarning({ BudgetrefreshKey }) {
//   const [budget, setBudget] = useState(localStorage.getItem("monthlyBudget") || "");
//   const [inputValue, setInputValue] = useState(localStorage.getItem("monthlyBudget") || "");
//   const [monthlySpent, setMonthlySpent] = useState(0);

//   const [lastPaid, setLastPaid] = useState(localStorage.getItem("lastPaidDate") || "");
//   const [payWarning, setPayWarning] = useState(false);

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

//     fetchExpenses();

//     const newBudget = localStorage.getItem("monthlyBudget") || "";
//     setBudget(newBudget);
//     setInputValue(newBudget);

//     const storedPaidDate = localStorage.getItem("lastPaidDate");
//     setLastPaid(storedPaidDate);

//     if (storedPaidDate) {
//       const daysElapsed = Math.floor(
//         (new Date() - new Date(storedPaidDate)) / (1000 * 60 * 60 * 24)
//       );
//       setPayWarning(daysElapsed >= 7);
//     }
//   }, [BudgetrefreshKey]);

//   const handleSaveBudget = () => {
//     localStorage.setItem("monthlyBudget", inputValue);
//     setBudget(inputValue);
//   };

//   const handleSavePaidDate = () => {
//     localStorage.setItem("lastPaidDate", lastPaid);
//     const daysElapsed = Math.floor(
//       (new Date() - new Date(lastPaid)) / (1000 * 60 * 60 * 24)
//     );
//     setPayWarning(daysElapsed >= 7);
//   };

//   const budgetExceeded = budget && monthlySpent > parseFloat(budget);

//   return (
//     <Box>
//       <Title>Budget Monitor</Title>
//       <Input
//         type="number"
//         placeholder="Set monthly budget"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//       />
//       <Button onClick={handleSaveBudget}>Save Budget</Button>

//       {budget && (
//         <Status exceeded={budgetExceeded}>
//           <StatusRow><strong>Budget:</strong> ₹{budget}</StatusRow>
//           <StatusRow><strong>Spent:</strong> ₹{monthlySpent.toFixed(2)}</StatusRow>
//           <StatusRow><strong>Remaining:</strong> ₹{(budget - monthlySpent).toFixed(2)}</StatusRow>
//           {budgetExceeded && <StatusRow>⚠️ You have exceeded your budget!</StatusRow>}
//         </Status>
//       )}

//       <Title>Last PaidBack</Title>
//       <Input
//         type="datetime-local"
//         value={lastPaid}
//         onChange={(e) => setLastPaid(e.target.value)}
//       />
//       <Button onClick={handleSavePaidDate}>Update PaidBack Time</Button>

//       {lastPaid && (
//         <Status exceeded={payWarning}>
//           <StatusRow><strong>Last Paid:</strong> {new Date(lastPaid).toLocaleString()}</StatusRow>
//           {payWarning && <StatusRow>⚠️ It’s been over 7 days. Time to ask for pay!</StatusRow>}
//         </Status>
//       )}
//     </Box>
//   );
// }
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";

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
  margin-bottom: 1rem;
`;

const StatusRow = styled.p`
  margin: 0.4rem 0;
  font-size: 1rem;

  strong {
    font-weight: 600;
  }
`;

export default function BudgetWarning({ BudgetrefreshKey }) {
  const [budget, setBudget] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [lastPaid, setLastPaid] = useState(localStorage.getItem("lastPaidDate") || "");
  const [payWarning, setPayWarning] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("notificationEmail") || "");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBudgetAndExpenses = async () => {
      try {
        // 1. Fetch budget from backend
        const budgetRes = await axios.get("http://localhost:8080/api/user/budget", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBudget(budgetRes.data);
        setInputValue(budgetRes.data);

        // 2. Fetch expenses
        const res = await axios.get("http://localhost:8080/api/expenses/all", {
          headers: { Authorization: `Bearer ${token}` },
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
        console.error("Failed to fetch data", err);
      }
    };

    fetchBudgetAndExpenses();

    // Check last paid date
    const storedPaidDate = localStorage.getItem("lastPaidDate");
    setLastPaid(storedPaidDate);

    if (storedPaidDate) {
      const daysElapsed = Math.floor(
        (new Date() - new Date(storedPaidDate)) / (1000 * 60 * 60 * 24)
      );
      setPayWarning(daysElapsed >= 7);
    }
  }, [BudgetrefreshKey]);

  const handleSaveBudget = async () => {
    try {
      await axios.post("http://localhost:8080/api/user/budget-warning", {
        exceededAmount: 0,
        newBudget: parseFloat(inputValue),
        email: email
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBudget(inputValue);
      localStorage.setItem("monthlyBudget", inputValue);
      localStorage.setItem("notificationEmail", email);
      toast.success("Budget and email saved successfully!");
    } catch (err) {
      console.error("Failed to update budget", err);
      toast.error("Failed to update budget");
    }
  };

  const handleSavePaidDate = () => {
    localStorage.setItem("lastPaidDate", lastPaid);
    const daysElapsed = Math.floor(
      (new Date() - new Date(lastPaid)) / (1000 * 60 * 60 * 24)
    );
    setPayWarning(daysElapsed >= 7);
  };

  const budgetExceeded = budget && monthlySpent > parseFloat(budget);

  useEffect(() => {
    const triggerBudgetWarning = async () => {
      if (budgetExceeded) {
        try {
          await axios.post("http://localhost:8080/api/user/budget-warning", {
            exceededAmount: monthlySpent - parseFloat(budget),
            newBudget: null,
            email: email
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.error("Failed to send budget warning", err);
        }
      }
    };

    triggerBudgetWarning();
  }, [budgetExceeded, monthlySpent, budget, token, email]);

  return (
    <Box>
      <Title>Budget Monitor</Title>
      <Input
        type="number"
        placeholder="Set monthly budget"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Title>Notification Email</Title>
      <Input
        type="email"
        placeholder="Enter email for alerts"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleSaveBudget}>Save Budget & Email</Button>

      {budget && (
        <Status exceeded={budgetExceeded}>
          <StatusRow><strong>Budget:</strong> ₹{budget}</StatusRow>
          <StatusRow><strong>Spent:</strong> ₹{monthlySpent.toFixed(2)}</StatusRow>
          <StatusRow><strong>Remaining:</strong> ₹{(budget - monthlySpent).toFixed(2)}</StatusRow>
          {budgetExceeded && <StatusRow>⚠️ You have exceeded your budget!</StatusRow>}
        </Status>
      )}

      <Title>Last PaidBack</Title>
      <Input
        type="datetime-local"
        value={lastPaid}
        onChange={(e) => setLastPaid(e.target.value)}
      />
      <Button onClick={handleSavePaidDate}>Update PaidBack Time</Button>

      {lastPaid && (
        <Status exceeded={payWarning}>
          <StatusRow><strong>Last Paid:</strong> {new Date(lastPaid).toLocaleString()}</StatusRow>
          {payWarning && <StatusRow>⚠️ It’s been over 7 days. Time to ask for pay!</StatusRow>}
        </Status>
      )}
    </Box>
  );
}
