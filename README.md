# 🧬 Distribution Lab: Probability Analytics Engine

**Distribution Lab** is a high-fidelity, interactive web application designed for visualizing and analyzing discrete probability distributions (Binomial, Poisson) and their continuous approximation (Normal). 

Built with a **FastAPI** backend for mathematical precision and a **React (Vite+Tailwind)** frontend for a premium, neon-styled cinematic UI, this tool allows researchers and students to simulate real-world scenarios like call center traffic, website visits, and industrial accident monitoring.

---

## ✨ Features

- **Live Analytics Engine**: Real-time calculation of Binomial, Poisson, and Normal distributions.
- **Neon Dashboard**: High-fidelity dark mode with glassmorphic UI elements and glowing area charts.
- **Interval Analysis**: Calculate exact probabilities for specific ranges ($P(k_{start} \le X \le k_{end})$).
- **Comparison Visualizer**: Overlay all three models on a single interactive chart to observe approximation errors.
- **Scenario Presets**: Pre-configured templates for common statistical models (Website Traffic, Call Centers, etc.).
- **Mathematical Insights**: Automated validation checks for Poisson and Normal rule-of-thumb approximations.

---

## 🏗️ Technical Architecture

- **Backend**: Python 3.10+ / FastAPI / NumPy / SciPy
- **Frontend**: React (Vite) / Tailwind CSS / Recharts / Framer Motion
- **Core Logic**: Reusable Python modules for statistical calculations located in `/core`.

---

## 🚀 Quick Start

### 1. Backend Setup
Ensure you have Python installed. Navigate to the root directory and install dependencies:
```bash
pip install fastapi uvicorn numpy scipy
```
Start the API server:
```bash
python server.py
```
*The server will run on [http://localhost:8000](http://localhost:8000)*

### 2. Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```
Start the development server:
```bash
npm run dev
```
*The application will be available at [http://localhost:5173](http://localhost:5173)*

---

## 🛠️ Project Structure

```text
├── core/               # Mathematical implementations (Binomial, Poisson, Normal)
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── Home.jsx    # Cinematic Landing Page
│   │   ├── Analysis.jsx# Main Analytics Dashboard
│   │   └── index.css   # Neon Design System
├── server.py           # FastAPI REST API
└── README.md           # Documentation
```

---

## 🧠 Statistics 101: Rule of Thumb
The "Logic Analysis" tab automatically verifies if approximations are valid:
- **Poisson Approximation**: Valid if $n > 50$ and $p < 0.1$.
- **Normal Approximation**: Valid if $np > 15$ and $n(1-p) > 15$.

---

Created for high-precision statistical visualization. 🚀
