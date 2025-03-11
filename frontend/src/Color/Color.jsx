import { useState, useEffect } from 'react';
import './Color.css';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';
const Color = () => {
  const { profile, fetchNameWallet } = useProfile();
  // const [timeLeft, setTimeLeft] = useState(30);
  // const [selectedNumber, setSelectedNumber] = useState(null);

  const [selectedNumber, setSelectedNumber] = useState(() => sessionStorage.getItem("selectedNumber") || null);
  const [betAmount, setBetAmount] = useState(() => sessionStorage.getItem("betAmount") || 0);
  const [roundId, setRoundId] = useState(`R${Date.now().toString()}`);
  // const [roundId, setRoundId] = useState();

  // const [betAmount, setBetAmount] = useState(0);
  const [timerDuration, setTimerDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [showBetModal, setShowBetModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState({ status: '', message: '' });
  const localuser = localStorage.getItem("user");
  const [walletBalance, setWalletBalance] = useState(profile.walletBalance);
  const [history, setHistory] = useState([]);
  const [period, setPeriod] = useState(1);
  const [isBettingOpen, setIsBettingOpen] = useState(true);
  // const [roundId, setRoundId] = useState(() => `R${Date.now().toString()}`);
  useEffect(() => {
    sessionStorage.setItem("selectedNumber", selectedNumber);
    sessionStorage.setItem("betAmount", betAmount);

  }, [selectedNumber, betAmount]);

  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem("roundId", `R${Date.now().toString()}`);
    }, 40000);
    return () => clearInterval(timer);
  }, [roundId]);

  const [colorResult, setColorResult] = useState("");
  const [historyById, setHistoryByd] = useState([])
  useEffect(() => {
    fetchNameWallet();
  }, [profile]);
  // console.log(walletBalance, "walletBalance")
  // useEffect(() => {
  //   fetchGameHistory()
  //   const timer = setInterval(() => {
  //     setTimeLeft(prev => {
  //       if (prev <= 1) {
  //         handleGameEnd();
  //         const newRoundId = `R${Date.now().toString()}`;
  //         setRoundId(newRoundId);
  //         localStorage.setItem("roundId", newRoundId);  
  //         return 30;

  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, []);

  useEffect(() => {
    fetchGameHistory();
    setTimeLeft(timerDuration); // Ensure reset happens immediately

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleGameEnd();
          const newRoundId = `R${Date.now().toString()}`;
          setRoundId(newRoundId);
          localStorage.setItem("roundId", newRoundId);
          return timerDuration; // Restart timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerDuration, roundId]); // Ensure timer restarts when switching



  // const toggleTimer = () => {
  //   // console.log("click")
  //   setTimerDuration(prev => (prev === 30 ? 60 : 30));
  //   setTimeLeft(prev => (prev === 30 ? 60 : 30));
  //   const newRoundId = `R${Date.now().toString()}`;
  //   setRoundId(newRoundId);
  //   localStorage.setItem("roundId", newRoundId)
  // };

  const toggleTimer = () => {
    setTimerDuration(prev => {
      const newDuration = prev === 30 ? 60 : 30;
      setTimeLeft(newDuration); // Reset timeLeft immediately
      const newRoundId = `R${Date.now().toString()}`;
      setRoundId(newRoundId);
      localStorage.setItem("roundId", newRoundId)
      return newDuration;
    });
  };

  // console.log(timerDuration)
  // console.log(timeLeft, "left")

  const fetchRandomNumber = async () => {
    try {
      // console.log(roundId, "roundId")
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/color/get-random-color-by-id/${roundId}`);
      // if(!data) setColorResult(Math.floor(Math.random() * 10))
      localStorage.setItem("colorResult", data.randomNumber);
      setColorResult(data.randomNumber);

      // console.log(data, "data")
    } catch (error) {
      console.error("Error fetching random number", error);
    }
  }
  // useEffect(() => {

  //   fetchRandomNumber();
  // }, [])
  const fetchGameHistory = async () => {
    try {

      // console.log(profile.userId)
      const user = JSON.parse(localStorage.getItem("user"));
      // console.log(user.id);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/color/history/${user.id}`);
      setHistoryByd(data);
      // console.log(data, "history")
    } catch (error) {
      console.error("Error fetching game history", error);
    }
  };
  // console.log(historyById)
  const numbers = Array.from({ length: 10 }, (_, i) => ({
    number: i,
    color: i === 0 || i === 5 ? 'violet' : i % 2 === 0 ? 'red' : 'green'
  }));



  // const generateResult = () => {
  //   const colors = ['green', 'violet', 'red'];
  //   const number = Math.floor(Math.random() * 10);
  //   const result = colors[Math.floor(Math.random() * colors.length)];
  //   localStorage.setItem("result", result);
  //   // setGetColor(result)
  //   setHistory(prevHistory => [{
  //     period: period,
  //     price: Math.floor(Math.random() * 50000) + 30000,
  //     number: number,
  //     result: colorResult
  //   }, ...prevHistory.slice(0, 5)]);

  //   setPeriod(prev => (parseInt(prev) + 1).toString());
  // };

  const handleNumberSelect = (number) => {
    if (!isBettingOpen) return;
    setSelectedNumber(number);
    // setBetAmount(0); // Reset bet amount when selecting a new number
    setShowBetModal(true);
  };

  // console.log(numbers)

  const handleBetAmountSelect = (amount) => {
    setBetAmount(amount);
  };
  // console.log(selectedNumber, betAmount)
  const handleGameEnd = async () => {
    fetchRandomNumber()
    if (!selectedNumber) return

    const isWin = localStorage.getItem("selectedNumber") === localStorage.getItem("colorResult");
    // console.log(localStorage.getItem("colorResult"), "color")
    if (localStorage.getItem("betAmount") > 0) {
      // console.log("ok")
      try {
        const { data } = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/color/process-result/${roundId}`,
          {
            winAmt: isWin ? localStorage.getItem("betAmount") * 1.98 : 0,
            winningNumber: localStorage.getItem("colorResult"),
            isWin: isWin ? "Win" : "Lost",
            userId: JSON.parse(localStorage.getItem("user")).id,
            resultColor: localStorage.getItem("colorResult"),


          }
        );
        setShowResultModal(true);
        // console.log(data, "data")
        if (data.success) {

          if (isWin) {
            setWalletBalance((prev) => prev + betAmount * 1.98);
            setResult({ status: 'won', message: `You won ₹${(localStorage.getItem("betAmount") * 1.98).toFixed(2)}! Winning number: ${localStorage.getItem("colorResult")}` });
          } else {
            setWalletBalance((prev) => prev + betAmount * 0.05);
            setResult({ status: 'lost', message: `You lost ₹${localStorage.getItem("betAmount")}! Winning number: ${localStorage.getItem("colorResult")}` });
          }
          setTimeout(() => {
            localStorage.removeItem("selectedNumber");
            localStorage.removeItem("betAmount");
            localStorage.removeItem("roundId")
            localStorage.removeItem("result")
            localStorage.removeItem("colorResult")
          }, 1000);

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
      // const newRoundId = `R${Date.now().toString()}`; // Generate roundId if needed
      // setRoundId(newRoundId);
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/color/place-bet`, {
        amount: betAmount,
        user: profile.userId,
        selectedNumber,
        balance: profile.walletBalance,
        newRoundId: roundId,
        referalId: profile.referalId
      });
      if (data.success) {
        setWalletBalance((prev) => prev - betAmount);
        // setWalletBalance(prev => prev - betAmount);
        setShowBetModal(false);
        setIsBettingOpen(true);
        localStorage.setItem("selectedNumber", selectedNumber)
        localStorage.setItem("betAmount", betAmount)
        // localStorage.setItem("roundId", newRoundId)
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
  // console.log(timeLeft, "timeLeft")
  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Color Prediction</h1>
        <div className="balance">Balance: ₹{profile.walletBalance}</div>
        <button
          className="toggle-btn"
          onClick={toggleTimer}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6200ea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#4500b5')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#6200ea')}
        >
          Toggle Timer ({timerDuration > 30 ? '1 min' : '30 sec'})
        </button>
      </div>
      <div className="main-content">
        <div className="game-section">
          <div className="game-card">
            <div className="text-lg font-semibold flex justify-between period-header">
              <span>🏆 Period {" "} {roundId}</span>
            </div>
            <div className="timer">
              <div className="timer-label">Time Remaining</div>
              <div className="timer-value">
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                {(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <div className="color-buttons">
              <button disabled={!isBettingOpen || timeLeft <= 10} className={`color-btn green-btn ${!isBettingOpen || timeLeft <= 10 && 'disabled'}`} onClick={() => handleNumberSelect('green')}>Green</button>
              <button disabled={!isBettingOpen || timeLeft <= 10} className={`color-btn violet-btn ${!isBettingOpen || timeLeft <= 10 && 'disabled cursor-not-allowed'}`} onClick={() => handleNumberSelect('violet')}>Violet</button>
              <button disabled={!isBettingOpen || timeLeft <= 10} className={`color-btn red-btn ${!isBettingOpen || timeLeft <= 10 && 'disabled'}`} onClick={() => handleNumberSelect('red')}>Red</button>
            </div>

            <div className="number-grid">
              {numbers.map(({ number, color }) => (
                <button
                  key={number}
                  className={`number-btn ${color}-number ${!isBettingOpen || timeLeft <= 10 && 'disabled'} shining-effect`}
                  disabled={!isBettingOpen || timeLeft <= 10}
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
            <div style={{ maxHeight: '70vh', overflowY: 'auto', scrollbarColor: '#00b4d8 #90e0ef', scrollbarWidth: 'none' }}>
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
                        <div>{record.predictedColor}</div>
                      )}</td>
                      <td>{record.resultColor ? (
                        <div className="result-dot" style={{ backgroundColor: record.resultColor }}>
                          {record.resultColor >= 0 && record.resultColor <= 10 ? record.resultColor : ''}
                        </div>
                      ) : (
                        <div>{record.resultColor}</div>
                      )}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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