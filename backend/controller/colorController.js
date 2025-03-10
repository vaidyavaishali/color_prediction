const { colorModels } = require('../models/ColorModel');
const User = require('../models/User');
// Create a new game entry (Place Bet)
exports.placeBet = async (req, res) => {
    console.log("ok1")
    try {
        const { amount, walletBalance, selectedNumber, newRoundId, user } = req.body;

        console.log(req.body, "ok")
       

        const existuser = await User.findOne({ _id: user });
        console.log(existuser, "existuser")
        if (existuser) {
            existuser.wallet -= amount;
            await existuser.save();
        }

        if (amount > existuser.wallet) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const newEntry = new colorModels({
            roundId: newRoundId,
            walletBalance: walletBalance - amount,
            betAmout: amount,
            predictedColor: selectedNumber,
            resultColor: null,
            winAmt: 0,

        });


        await newEntry.save();
        res.status(201).json({ success: true, message: "Bet Placed!", data: newEntry });
    } catch (error) {
        console.error("Error placing bet:", error);
        res.status(500).json({ error: error.message });
    }
};

// Process game result
exports.processResult = async (req, res) => {
    console.log("ok")
    try {
        const { roundId, userId } = req.params;
        const { winningNumber } = req.body;
        console.log(req.body)
        const game = await colorModels.findOne({ roundId: roundId });
        console.log(game)

        const user = await User.findOne({ user: userId });
        
        if (!game) return res.status(404).json({ message: "Game not found" });
        let winAmount = 0;
        let isWinner = false;
        if (winningNumber == game.predictedColor) {
            winAmount = game.betAmout * 1.98;
            isWinner = "Won";
            // game.resultColor = winningNumber
            if (user) {
                user.wallet += winAmount;
                await user.save();
            }
        } else {
            winAmount = 0;
            isWinner = "Lost";
        }

        game.resultColor = winningNumber;
        game.winAmt = winAmount;
        game.isWin = isWinner;
        if (isWinner) {
            game.walletBalance += winAmount;
        }
        // console.log("after update", game)
        await game.save();
        res.status(200).json({ success: true, message: isWinner ? "You won!" : "You lost!", game });
    } catch (error) {
        console.error("Error processing result:", error);
        res.status(500).json({ error: error.message });
    }
};


// Fetch game history
exports.getHistory = async (req, res) => {
    try {
        const history = await colorModels.find().sort({ createdAt: -1 }).limit(2);
        res.json(history);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: error.message });
    }
};


// exports.fetchWalletBalance = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const game = await colorModels.findById(id);
//         if (!game) return res.status(404).json({ message: "Game not found" });
//         res.json({ walletBalance: game.walletBalance });
//     } catch (error) {
//         console.error("Error fetching wallet balance:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

exports.resetAll = async (req, res) => {
    try {
        await colorModels.deleteMany({});
        res.json({ message: 'All matches have been reset' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};