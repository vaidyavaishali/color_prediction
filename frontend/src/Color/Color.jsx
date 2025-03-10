import { useState, useEffect } from 'react';
import './Color.css';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';
const Color = () => {
  const { profile, fetchNameWallet } = useProfile()
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [betAmount, setBetAmount] = useState(0);
  const [showBetModal, setShowBetModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState({ status: '', message: '' });
  const [walletBalance, setWalletBalance] = useState(profile.walletBalance);
  const [history, setHistory] = useState([]);
  const [period, setPeriod] = useState(1);
  const [isBettingOpen, setIsBettingOpen] = useState(true);
  const [roundId, setRoundId] = useState(() => `R${Date.now().toString()}`);
  const [getColor, setGetColor] = useState("")
  const [historyById, setHistoryByd] = useState([])
useEffect(() => {
  fetchNameWallet();
}, [walletBalance]) 
  useEffect(() => {
    // fetchWalletBalance();
    fetchGameHistory()
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleGameEnd();
          return 30;
        }
        return prev - 1;
      });
    }, 500);
    return () => clearInterval(timer);
  }, []);


  const fetchGameHistory = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/color/history`);
      setHistoryByd(data);
      console.log(data, "history")
    } catch (error) {
      console.error("Error fetching game history", error);
    }
  };

  console.log(historyById)
  const numbers = Array.from({ length: 10 }, (_, i) => ({
    number: i,
    color: i === 0 || i === 5 ? 'violet' : i % 2 === 0 ? 'red' : 'green'
  }));

  const generateResult = () => {
    const colors = ['green', 'violet', 'red'];
    const number = Math.floor(Math.random() * 10);
    const result = colors[Math.floor(Math.random() * colors.length)];
    localStorage.setItem("result", result);
    setGetColor(result)
    setHistory(prevHistory => [{
      period: period,
      price: Math.floor(Math.random() * 50000) + 30000,
      number: number,
      result: result
    }, ...prevHistory.slice(0, 5)]);

    setPeriod(prev => (parseInt(prev) + 1).toString());
  };
  // console.log(history)

  const handleNumberSelect = (number) => {
    if (!isBettingOpen) return;
    setSelectedNumber(number);
    // setBetAmount(0); // Reset bet amount when selecting a new number
    setShowBetModal(true);
  };

  console.log(numbers)
  // const handleGameEnd = async () => {
  //   generateResult();
  //   const winningNumber = Math.floor(Math.random() * 10);
  //   const isWin = selectedNumber === winningNumber;
  //   if (selectedNumber !== null && betAmount > 0) {
  //     if (isWin) {
  //       const winAmount = betAmount * 1.98;
  //       try {
  //         const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/color/process-result/${roundId}`, {
  //           winAmount: winAmount,
  //           winningNumber,
  //           isWin: "Win"
  //           // walletBalance
  //           // predictedColor
  //         });

  //         if (data.success) {
  //           // setIsBettingOpen(false);
  //           // setShowBetModal(false);
  //           setWalletBalance(prev => prev + winAmount);
  //           setResult({ status: 'won', message: `You won ₹${winAmount.toFixed(2)}! Winning number: ${winningNumber}` });
  //           setSelectedNumber(null);
  //           setBetAmount(0);
  //           setIsBettingOpen(true);
  //           setShowBetModal(false);
  //           setTimeout(() => setShowResultModal(false), 2000);

  //         } else {
  //           setResult({ status: "error", message: data.message });
  //           setShowResultModal(true);
  //         }
  //       } catch (error) {
  //         console.error("Error placing bet", error);
  //         setResult({ status: "error", message: "Failed to place bet" });
  //         setShowResultModal(true);
  //       }
  //     } else {

  //       try {
  //         const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/color/place-bet`, {
  //           betAmount: betAmount,
  //           // winningNumber,
  //           isWin: "Lost"
  //           // walletBalance
  //           // predictedColor
  //         });

  //         if (data.success) {
  //           // setIsBettingOpen(false);
  //           // setShowBetModal(false);
  //           setWalletBalance(prev => prev + winAmount);
  //           setResult({ status: 'lost', message: `You lost ₹${betAmount.toFixed(2)}! Winning number: ${winningNumber}` });
  //           // setSelectedNumber(null);
  //           // setBetAmount(0);
  //           // setIsBettingOpen(true);
  //           // setShowBetModal(false);
  //           // setTimeout(() => setShowResultModal(false), 2000);

  //         } else {
  //           setResult({ status: "error", message: data.message });
  //           setShowResultModal(true);
  //         }
  //       } catch (error) {
  //         console.error("Error placing bet", error);
  //         setResult({ status: "error", message: "Failed to place bet" });
  //         setShowResultModal(true);
  //       }
  //     }
  //     setShowResultModal(true);
  //   }
  // };

  const handleBetAmountSelect = (amount) => {
    setBetAmount(amount);
  };
  // console.log(selectedNumber, betAmount)
  const handleGameEnd = async () => {
    generateResult();
    const getAmt = localStorage.getItem("betAmount")
    const winningNumber = Math.floor(Math.random() * 10);
    const isWin = localStorage.getItem("selectedNumber") === winningNumber;
    if (localStorage.getItem("betAmount") > 0) {
      console.log("ok")
      try {

        const { data } = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/color/process-result/${localStorage.getItem("roundId")}`,
          {
            winAmt: isWin ? localStorage.getItem("betAmount") * 1.98 : 0,
            winningNumber: localStorage.getItem("result"),
            isWin: isWin ? "Win" : "Lost",
            userId: profile.userId,

          }
        );
        setShowResultModal(true);
        console.log(data, "data")
        if (data.success) {

          if (isWin) {
            setWalletBalance(prev => prev + betAmount * 1.98);
            setResult({ status: 'won', message: `You won ₹${(localStorage.getItem("betAmount") * 1.98).toFixed(2)}! Winning number: ${winningNumber}` });
          } else {
            setResult({ status: 'lost', message: `You lost ₹${localStorage.getItem("betAmount")}! Winning number: ${winningNumber}` });
          }
          setTimeout(() => {
            localStorage.removeItem("selectedNumber");
            localStorage.removeItem("betAmount");
            localStorage.removeItem("roundId")
            localStorage.removeItem("result")
          }, 200);

          fetchGameHistory();
          setSelectedNumber(null);
          setBetAmount(0);
          setIsBettingOpen(true);
          setShowBetModal(false);
          setTimeout(() => setShowResultModal(false), 2000);

        } else {
          setResult({ status: "error", message: data.message });
          setShowResultModal(true);
        }
      } catch (error) {
        console.error("Error processing result", error);
        setResult({ status: "error", message: "Failed to process result" });
        setShowResultModal(true);
      }
    }
  };

  const placeBet = async () => {
    if (betAmount <= 0) {
      setResult({ status: 'error', message: 'Please select a bet amount!' });
      setShowResultModal(true);
      return;
    }
    if (betAmount > profile.walletBalance) {
      setResult({ status: 'error', message: 'Insufficient balance!' });
      setShowResultModal(true);
      return;
    }
    try {
      const newRoundId = `R${Date.now().toString()}`; // Generate roundId if needed
      setRoundId(newRoundId);
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/color/place-bet`, {
        amount: betAmount,
        user: profile.userId,
        selectedNumber,
       balance: profile.walletBalance,
        newRoundId
      });
      if (data.success) {
        setWalletBalance((prev) => prev - betAmount);
        setWalletBalance(prev => prev - betAmount);
        setShowBetModal(false);
        setIsBettingOpen(true);
        localStorage.setItem("selectedNumber", selectedNumber)
        localStorage.setItem("betAmount", betAmount)
        localStorage.setItem("roundId", newRoundId)
        setResult({ status: 'Success', message: `Bet Placed ${betAmount} on ${selectedNumber}` });
        setShowResultModal(true);
        setTimeout(() => setShowResultModal(false), 2000);
      } else {
        setResult({ status: "error", message: data.message });
        setShowResultModal(true);
      }
    } catch (error) {
      console.error("Error placing bet", error);
      setResult({ status: "error", message: "Failed to place bet" });
      setShowResultModal(true);
    }

  };
  // console.log(walletBalance)
  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Color Prediction</h1>
        <div className="balance">Balance: ₹{profile.walletBalance}</div>
      </div>

      <div className="main-content">
        <div className="game-section">
          <div className="game-card">
            <div className="text-lg font-semibold flex justify-between period-header">
              <span>🏆 Period</span>
            </div>
            <div className="timer">
              <div className="timer-label">Time Remaining</div>
              <div className="timer-value">
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                {(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <div className="color-buttons">
              <button className={`color-btn green-btn ${!isBettingOpen && 'disabled'}`} onClick={() => handleNumberSelect('green')}>Green</button>
              <button className={`color-btn violet-btn ${!isBettingOpen && 'disabled'}`} onClick={() => handleNumberSelect('violet')}>Violet</button>
              <button className={`color-btn red-btn ${!isBettingOpen && 'disabled'}`} onClick={() => handleNumberSelect('red')}>Red</button>
            </div>

            <div className="number-grid">
              {numbers.map(({ number, color }) => (
                <button
                  key={number}
                  className={`number-btn ${color}-number ${!isBettingOpen && 'disabled'} shining-effect`}
                  onClick={() => handleNumberSelect(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="history-section">
          <h2 className="history-title">Game History</h2>
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Price</th>
                  <th>Number</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {historyById && historyById.map((record, index) => (
                  <tr key={record.roundId || index}>
                    <td>{index + 1}</td>
                    <td>₹{record.betAmout}</td>
                    <td>{record.predictedColor ? (
                      <div className="result-dot" style={{ backgroundColor: record.predictedColor }}>
                        {record.predictedColor >= 0 && record.predictedColor <= 10 ? record.predictedColor : ''}
                      </div>
                    ) : (
                      <div > {record.predictedColor}</div>
                    )}</td>


                    <td><div className="result-dot" style={{ backgroundColor: record.resultColor }}></div></td>
                    {/* <td><div > {record.isWin}</div></td> */}
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showBetModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Place Your Bet</h3>
              <button className="close-btn" onClick={() => setShowBetModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="bet-options">
                <h4>Quick Amounts</h4>
                <div className="amount-buttons">
                  {[10, 50, 100, 500].map(amount => (
                    <button
                      key={amount}
                      className={`amount-btn ${betAmount === amount ? 'selected' : ''}`}
                      onClick={() => handleBetAmountSelect(amount)}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>
              <div className="multiplier-options">
                <h4>Multipliers</h4>
                <div className="multiplier-buttons">
                  {[2, 5, 10].map(multiplier => (
                    <button
                      key={multiplier}
                      className="multiplier-btn"
                      onClick={() => betAmount > 0 && handleBetAmountSelect(betAmount * multiplier)}
                    >
                      x{multiplier}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bet-confirm">
                <p>Selected Amount: ₹{betAmount}</p>
                <button className="place-bet-btn" onClick={placeBet}>Place Your Bet</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResultModal && (
        <div className="modal">
          <div className="result-modal-content">
            <div className="result-emoji">
              {result.status === 'won' ? '🎉' : result.status === 'lost' ? '😢' : '⚠️'}
            </div>
            <h2 className={`result-message ${result.status}`}>{result.message}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Color;