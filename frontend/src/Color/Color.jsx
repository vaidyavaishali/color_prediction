import { useState, useEffect } from 'react';
import './Color.css';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';
const Color = () => {
  const Api_url = "https://color-prediction-peach.vercel.app"
  // const Api_url = "http://localhost:5000";
  const { profile, fetchNameWallet } = useProfile();
  // const [timeLeft, setTimeLeft] = useState(30);
  // const [selectedNumber, setSelectedNumber] = useState(null);

  const [selectedNumber, setSelectedNumber] = useState(() => sessionStorage.getItem("selectedNumber") || null);
  const [betAmount, setBetAmount] = useState(() => sessionStorage.getItem("betAmount") || 0);
  const [roundId, setRoundId] = useState(`R${new Date().getTime()}`)
  const [timerDuration, setTimerDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [showBetModal, setShowBetModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState({ status: '', message: '' });
  const [walletBalance, setWalletBalance] = useState(profile.walletBalance || 150000);
  // const [history, setHistory] = useState([]);
  // const [period, setPeriod] = useState(1);
  const [isBettingOpen, setIsBettingOpen] = useState(true);
  const [prevRoundId, setPrevRoundId] = useState("")
  const [timer_thirty, setTimertimer_thirty] = useState(true)
  const [isBetPlace, setIsBetPlace] = useState(false)
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {
      localStorage.removeItem("prevRoundId")
      const response = await axios.get(`${Api_url}/api/color/get-lastRoundId`);
      localStorage.setItem("prevRoundId", response.data.roundId)
      setPrevRoundId(response.data.roundId);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  useEffect(() => {
    sessionStorage.setItem("selectedNumber", selectedNumber);
    sessionStorage.setItem("betAmount", betAmount);

  }, [selectedNumber, betAmount]);


  const [colorResult, setColorResult] = useState("");
  const [historyById, setHistoryByd] = useState([])
  useEffect(() => {
    fetchNameWallet();
  }, [profile]);

  useEffect(() => {
    fetchGameHistory();
    setTimeLeft(timerDuration); // Ensure reset happens immediately

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (selectedNumber !== null) {
            handleGameEnd();
          }

          fetchRandomNumber();
          // localStorage.setItem()
          const PreviousRoundId = localStorage.getItem("prevRoundId")
          // const newRoundId = `R${parseInt(PreviousRoundId.slice(1)) + 1}`;
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



  const toggleTimer = (timer) => {
    setTimerDuration(prev => {
      fetchRandomNumber()
      const newDuration = timer;
      setTimeLeft(newDuration); // Reset timeLeft immediately
      const PreviousRoundId = localStorage.getItem("prevRoundId")
      // const newRoundId = `R${parseInt(PreviousRoundId.slice(1)) + 1}`;
      const newRoundId = `R${Date.now().toString()}`;
      setRoundId(newRoundId);
      localStorage.removeItem("prevRoundId")
      localStorage.setItem("roundId", newRoundId);

      return newDuration;
    });
  };

  const fetchRandomNumber = async () => {
    try {
      // console.log(roundId, "roundId")
      const { data } = await axios.get(`${Api_url}/api/color/get-lastRoundId`);
      // if(!data) setColorResult(Math.floor(Math.random() * 10))
      localStorage.setItem("colorResult", data.randomNumber);
      setColorResult(data.randomNumber);

      // console.log(data, "data")
    } catch (error) {
      console.error("Error fetching random number", error);
    }
  }
  useEffect(() => {

    fetchRandomNumber();
  }, [])
  const fetchGameHistory = async () => {
    try {

      // console.log(profile.userId)
      const user = JSON.parse(localStorage.getItem("user"));
      // console.log(user.id);
      const { data } = await axios.get(`${Api_url}/api/color/history/${user.id}`);
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
  // const handleGameEnd = async () => {
  //   console.log(selectedNumber)
  //   if (!selectedNumber) return

  //   const isWin = localStorage.getItem("selectedNumber") === localStorage.getItem("colorResult");
  //   if (localStorage.getItem("betAmount") > 0) {
  //     try {
  //       const { data } = await axios.put(
  //         `${Api_url}/api/color/process-result/${roundId}`,
  //         {
  //           winAmt: isWin ? localStorage.getItem("betAmount") * 1.98 : 0,
  //           winningNumber: localStorage.getItem("colorResult"),
  //           isWin: isWin ? "Win" : "Lost",
  //           userId: JSON.parse(localStorage.getItem("user")).id,
  //           resultColor: localStorage.getItem("colorResult")
  //         }
  //       );
  //       setShowResultModal(true);
  //       // console.log(data, "data")
  //       if (data.success) {

  //         if (isWin) {
  //           setWalletBalance((prev) => prev + betAmount * 1.98);
  //           setResult({ status: 'won', message: `You won ₹${(localStorage.getItem("betAmount") * 1.98).toFixed(2)}! Winning number: ${localStorage.getItem("colorResult")}` });
  //         } else {
  //           setWalletBalance((prev) => prev + betAmount * 0.05);
  //           setResult({ status: 'lost', message: `You lost ₹${localStorage.getItem("betAmount")}! Winning number: ${localStorage.getItem("colorResult")}` });
  //         }
  //         setTimeout(() => {
  //           // localStorage.removeItem("selectedNumber");
  //           // localStorage.removeItem("betAmount");
  //           // localStorage.removeItem("roundId")
  //           // localStorage.removeItem("result")
  //           // localStorage.removeItem("colorResult")
  //         }, 1000);

  //         // fetchGameHistory();
  //         // setSelectedNumber(null);
  //         setBetAmount(0);
  //         setIsBettingOpen(true);
  //         setShowBetModal(false);
  //         setTimeout(() => setShowResultModal(false), 2000);

  //       } else {
  //         setResult({ status: "error", message: data.message });
  //         setShowResultModal(true);
  //       }
  //     } catch (error) {
  //       console.error("Error processing result", error);
  //       setResult({ status: "error", message: "Failed to process result" });
  //       setShowResultModal(true);
  //       setTimeout(() => {
  //         setShowResultModal(false)
  //       }, 200);
  //     }
  //   }
  // };

  const handleGameEnd = async () => {
    if (selectedNumber) {
      const colorResult = localStorage.getItem("colorResult");
      const isWin = selectedNumber === colorResult;
// console.log(colorResult, "colorResult")
      if (localStorage.getItem("betAmount") > 0) {
        try {
          const { data } = await axios.put(
            `${Api_url}/api/color/process-result/${roundId}`,
            {
              winAmt: isWin ? localStorage.getItem("betAmount") * 1.98 : 0,
              winningNumber:colorResult || localStorage.getItem("colorResult"),
              isWin: isWin ? "Win" : "Lost",
              userId: JSON.parse(localStorage.getItem("user")).id,
              resultColor: colorResult || localStorage.getItem("colorResult"),
            }
          );
          console.log("Game result processed:", data);
          if(data.game.isWin == "Won"){
            setResult({ status: 'won', message: `You won ₹${(localStorage.getItem("betAmount") * 1.98).toFixed(2)}! Winning number: ${colorResult || localStorage.getItem("colorResult")}` });

          }else{
            setResult({ status: 'lost', message: `You lost ₹${localStorage.getItem("betAmount")}! Winning number: ${colorResult || localStorage.getItem("colorResult")}` });
          }
          setShowResultModal(true);
          setTimeout(() => {
            setShowResultModal(false);
          }, 1000);
        } catch (error) {
          console.error("Error processing result", error);
        }
      }
    }
    fetchGameHistory()
  };

// console.log(selectedNumber, "selectedNumber")
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
      fetchRandomNumber()
      const { data } = await axios.post(`${Api_url}/api/color/place-bet`, {
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
        localStorage.setItem("roundId", roundId)

        setResult({ status: 'Success', message: `Bet Placed ${betAmount} on ${selectedNumber}` });
        setShowResultModal(true);
        setIsBetPlace(true)
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
        <div className="balance">Balance: ₹{walletBalance}</div>
        {/* {timer_thirty ? */}
        <div style={{ display: "flex", "gap": "20px", "justifyContent": "center" }}>
          <button
            className="toggle-btn"
            // onClick={toggleTimer}
            onClick={() => { setTimertimer_thirty(true); toggleTimer(30) }}
            style={{
              padding: '10px 20px',
              backgroundColor: timer_thirty ? '#6200ea' : "#cccc",
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
            {/* Toggle Timer ({timerDuration > 30 ? '1 min' : '30 sec'}) */}
            30 Sec
          </button>
          <button
            className="toggle-btn"
            // onClick={toggleTimer}
            onClick={() => { setTimertimer_thirty(false); toggleTimer(60) }}
            style={{
              padding: '10px 20px',
              backgroundColor: !timer_thirty ? '#6200ea' : "#cccc",
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
            {/* Toggle Timer ({timerDuration > 30 ? '1 min' : '30 sec'}) */}
            1 Min
          </button>
        </div>

        {/* } */}
      </div>
      <div className="main-content">
        <div className="game-section">
          <div className="game-card">
            <div className="text-lg font-semibold flex justify-between period-header">
              <span>🏆 Period {" "} {roundId || localStorage.getItem('roundId')}</span>
            </div>
            <div className="timer">
              <div className="timer-label">Time Remaining</div>
              <div className="timer-value">
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                {(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <div className="color-buttons">
              <button disabled={
                !isBettingOpen ||
                (timer_thirty && timeLeft <= 10) ||
                (!timer_thirty && timeLeft <= 30)
              } className={`color-btn green-btn  ${(!isBettingOpen || (timer_thirty && timeLeft <= 10) || (!timer_thirty && timeLeft <= 30)) ? 'disabled cursor-not-allowed' : ''}`} onClick={() => handleNumberSelect('green')}>Green</button>

              {/* <button disabled={!isBettingOpen || (timer_thirty && timeLeft <= 10) || (!timer_thirty && timeLeft <= 30)} className={`color-btn violet-btn ${!isBettingOpen || (timer_thirty && timeLeft <= 10) || (!timer_thirty && timeLeft <= 30) && 'disabled cursor-not-allowed'}`} onClick={() => handleNumberSelect('violet')}>Violet</button> */}

              <button
                disabled={
                  !isBettingOpen ||
                  (timer_thirty && timeLeft <= 10) ||
                  (!timer_thirty && timeLeft <= 30)
                }
                className={`color-btn violet-btn ${(!isBettingOpen || (timer_thirty && timeLeft <= 10) || (!timer_thirty && timeLeft <= 30)) ? 'disabled cursor-not-allowed' : ''}`}
                onClick={() => handleNumberSelect('violet')}
              >
                Violet
              </button>

              <button disabled={
                !isBettingOpen ||
                (timer_thirty && timeLeft <= 10) ||
                (!timer_thirty && timeLeft <= 30)
              } className={`color-btn red-btn  ${(!isBettingOpen || (timer_thirty && timeLeft <= 10) || (!timer_thirty && timeLeft <= 30)) ? 'disabled cursor-not-allowed' : ''}`} onClick={() => handleNumberSelect('red')}>Red</button>
            </div>

            <div className="number-grid">
              {numbers.map(({ number, color }) => (
                // <button
                //   key={number}
                //   className={`number-btn ${color}-number${(!isBettingOpen || (timer_thirty && timeLeft <= 10) || (!timer_thirty && timeLeft <= 30)) ? 'disabled'  : ''} shining-effect`}
                //   disabled={
                //     !isBettingOpen ||
                //     (timer_thirty && timeLeft <= 10) ||
                //     (!timer_thirty && timeLeft <= 30)
                //   }
                //   onClick={() => handleNumberSelect(number)}
                // >
                //   {number}
                // </button>

                <button
                  key={number}
                  className={`number-btn ${color}-number ${(!isBettingOpen || (timer_thirty && timeLeft <= 10) || (!timer_thirty && timeLeft <= 30)) && 'disabled'}  ${(!isBettingOpen || (timer_thirty && timeLeft <= 10) || (!timer_thirty && timeLeft <= 30)) ? '' : "shining-effect"} `}
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
