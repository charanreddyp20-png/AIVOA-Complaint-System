from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime


# ========================================
# APP
# ========================================

app = FastAPI(
    title="AIVOA Complaint Management System",
    version="1.0.0"
)


# ========================================
# CORS
# ========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================================
# DATA MODELS
# ========================================

class ComplaintCreate(BaseModel):
    name: str
    email: str
    category: str
    description: str


class ComplaintUpdate(BaseModel):
    status: str


# ========================================
# TEMPORARY DATABASE
# ========================================

complaints = [
    {
        "id": 1,
        "name": "Sample User",
        "email": "user@example.com",
        "category": "Education",
        "description": "Sample complaint for testing.",
        "status": "Submitted",
        "date": "29/07/2026"
    }
]


# ========================================
# HOME
# ========================================

@app.get("/")
def home():
    return {
        "message": "AIVOA Complaint Management System"
    }


# ========================================
# HEALTH CHECK
# ========================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ========================================
# GET ALL COMPLAINTS
# ========================================

@app.get("/complaints")
def get_complaints():
    return complaints


# ========================================
# GET SINGLE COMPLAINT
# ========================================

@app.get("/complaints/{complaint_id}")
def get_complaint(complaint_id: int):

    for complaint in complaints:

        if complaint["id"] == complaint_id:
            return complaint

    raise HTTPException(
        status_code=404,
        detail="Complaint not found"
    )


# ========================================
# AI COMPLAINT ANALYSIS
# ========================================

@app.post("/complaints/analyze")
def analyze_complaint(data: ComplaintCreate):

    text = data.description.lower()

    # ------------------------------------
    # Priority detection
    # ------------------------------------

    urgent_words = [
        "emergency",
        "danger",
        "urgent",
        "accident",
        "fire",
        "life threatening",
        "immediately",
        "unsafe"
    ]

    high_words = [
        "broken",
        "not working",
        "serious",
        "major",
        "problem",
        "damage",
        "failed"
    ]

    if any(word in text for word in urgent_words):

        priority = "High"

    elif any(word in text for word in high_words):

        priority = "Medium"

    else:

        priority = "Low"


    # ------------------------------------
    # Category recommendations
    # ------------------------------------

    recommendations = {

        "Education":
            "The complaint should be reviewed by the appropriate education authority or institution.",

        "Government Services":
            "The complaint should be forwarded to the relevant government department for review.",

        "Public Services":
            "The complaint should be forwarded to the relevant public service department for review.",

        "Healthcare":
            "The complaint should be reviewed by the appropriate healthcare authority.",

        "Transport":
            "The complaint should be forwarded to the relevant transport department.",

        "Public Safety":
            "The complaint should be reviewed by the appropriate public safety authority.",

        "Electricity":
            "The complaint should be reviewed by the electricity service provider.",

        "Water Supply":
            "The complaint should be forwarded to the relevant water supply department.",

        "Roads":
            "The complaint should be forwarded to the appropriate roads or municipal department.",

        "Other":
            "The complaint should be reviewed by the appropriate department."
    }


    recommendation = recommendations.get(
        data.category,
        "The complaint should be reviewed by the appropriate department."
    )


    # ------------------------------------
    # Analysis response
    # ------------------------------------

    return {

        "title": "Complaint Analysis",

        "summary": (
            f"Your complaint has been analysed under the "
            f"{data.category} category. "
            f"The submitted information indicates a "
            f"{priority.lower()} priority issue that should be reviewed."
        ),

        "priority": priority,

        "recommendation": recommendation
    }


# ========================================
# CREATE COMPLAINT
# ========================================

@app.post("/complaints")
def create_complaint(data: ComplaintCreate):

    new_id = max(
        [complaint["id"] for complaint in complaints],
        default=0
    ) + 1


    new_complaint = {

        "id": new_id,

        "name": data.name,

        "email": data.email,

        "category": data.category,

        "description": data.description,

        "status": "Submitted",

        "date": datetime.now().strftime("%d/%m/%Y")
    }


    complaints.append(new_complaint)


    return {

        "message": "Complaint submitted successfully",

        "complaint": new_complaint
    }


# ========================================
# UPDATE COMPLAINT STATUS
# ========================================

@app.put("/complaints/{complaint_id}")
def update_complaint(
    complaint_id: int,
    data: ComplaintUpdate
):

    for complaint in complaints:

        if complaint["id"] == complaint_id:

            complaint["status"] = data.status

            return {

                "message": "Complaint status updated successfully",

                "complaint": complaint
            }


    raise HTTPException(
        status_code=404,
        detail="Complaint not found"
    )


# ========================================
# DELETE COMPLAINT
# ========================================

@app.delete("/complaints/{complaint_id}")
def delete_complaint(complaint_id: int):

    for complaint in complaints:

        if complaint["id"] == complaint_id:

            complaints.remove(complaint)

            return {
                "message": "Complaint deleted successfully"
            }


    raise HTTPException(
        status_code=404,
        detail="Complaint not found"
    )