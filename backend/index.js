const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const adminRoutes = require('./controller/adminController');
const app = express();
app.use(cors());
app.use(express.json());
const colorPredictionRoutes = require('./routes/colorRoutes');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api', authRoutes);
// app.use('/api', userRoutes);
app.use('/api/color', colorPredictionRoutes);
app.use('/api',adminRoutes)

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
