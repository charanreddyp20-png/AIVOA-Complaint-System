# AIVOA – AI-Powered Complaint Resolution Platform

AIVOA is a web-based complaint management system that allows users to submit complaints, receive a preliminary AI-style analysis, track complaint status, and enables administrators to manage submitted complaints.

## 🚀 Live Demo

https://aivoa-complaint-system-1-vgyw.onrender.com

## 📌 Features

### 👤 User Features
- Submit complaints through an easy-to-use interface
- Select complaint categories
- Enter name and email details
- Describe complaints with a character limit
- Analyse complaints and receive a preliminary priority assessment
- Track submitted complaints using an email address
- View complaint status and progress

### 🛠️ Admin Features
- Admin dashboard for managing complaints
- View total complaints
- View submitted complaints
- View complaints under review
- View complaints in progress
- View resolved complaints
- Update complaint status
- Delete complaints

### 🤖 Complaint Analysis
The system analyses complaint descriptions and assigns a preliminary priority:

- **High** – urgent keywords such as danger, emergency, threat, harassment, or violence
- **Medium** – issues involving problems, delays, poor service, or similar concerns
- **Low** – general complaints that do not match the higher-priority conditions

## 🏗️ Project Structure

```text
AIVOA-Complaint-System/
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   └── package.json
│
└── README.md
