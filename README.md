 Snake & Ladder – Multiplayer Web App 🎲
A real-time multiplayer Snake and Ladder game built using the MERN Stack with Socket.IO for live interaction. Players can join rooms, roll dice, move pieces, and compete with others online — all in real time!

🚀 Features


🎮 Real-time Gameplay using WebSockets (Socket.IO)


👥 Multiplayer Rooms – Invite or join friends


💬 In-game Chat Support


🏆 Daily Rewards & Streak System


💰 Coin-based Rewards for winning


🧩 Responsive Design for all devices


🔐 JWT Authentication for secure login


🧑‍🎓 Custom Avatars


☁️ Deployed on render + vercel



🛠️ Tech Stack
Frontend


React.js


Tailwind CSS


Socket.IO client


Backend


Node.js


Express.js


MongoDB (Mongoose)


Socket.IO server


JWT Authentication


Deployment


⚙️ Installation


Clone the Repository
git clone https://github.com/sajjadpp/snake-and-ladder-online-multi.git
cd snake-ladder-multi-online



Install Dependencies
cd client && npm install
cd ../server && npm install



Environment Variables
Create a .env file in /server:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000



Start the App
# Backend
cd server
npm run dev

# Frontend
cd client
npm start



Visit:
👉 http://localhost:5173



💡 How It Works


Players sign in using their accounts.


The server assigns rooms and handles real-time dice rolls through Socket.IO.


The board updates live across all connected clients.


Players can chat during the match.


After each game, winners receive coins, and daily rewards can be claimed.



🧠 Learning Highlights


Implemented Socket.IO signaling for multiplayer gameplay.


Built custom game logic for dice rolls and ladder/snake handling.


Used MongoDB aggregation for reward cycles and leaderboard stats.


Managed JWT tokens with React context and Axios interceptors.


Deployed a secure MERN app with Render + Vercel.


✨ Future Enhancements


🎤 Add Voice Chat between players


📱 Mobile-friendly PWA version


🧮 Global Leaderboard


🪙 In-game Shop (buy avatars or dice skins)



🧑‍💻 Author
Sajjad P
📍 Kannur, India
💻 MERN Stack Developer
🌐 [LinkedIn Profile or Portfolio link if you have one]

📜 License
This project is licensed under the MIT License – feel free to use and modify.

Would you like me to make a version that includes your daily reward logic section (like /api/rewards/claim and streak details) in the README too?
