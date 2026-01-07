# API/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student, Candidate

# ------------------------
# Create Student
# ------------------------
@api_view(['POST'])
def create_student(request):
    email = request.data.get("StudentMail")
    if not email:
        return Response({"status": "error", "message": "StudentMail is required"}, status=400)

    # Check if student already exists
    if Student.objects.filter(StudentMail=email).exists():
        return Response({"status": "exists"}, status=200)

    student = Student.objects.create(
        StudentMail=email,
        StudentName=request.data.get("StudentName", ""),
        Tokens=int(request.data.get("Tokens", 0)),
        ExpectedPosition=request.data.get("ExpectedPosition", ""),
        Designation=request.data.get("Designation", ""),
        Resume=request.data.get("Resume", ""),
        OurFeedback=request.data.get("OurFeedback", ""),
        ImprovementsNeeded=request.data.get("ImprovementsNeeded", "")
    )

    # Build response
    data = {
        "id": student.id,
        "StudentMail": student.StudentMail,
        "StudentName": student.StudentName,
        "Tokens": student.Tokens,
        "ExpectedPosition": student.ExpectedPosition,
        "Designation": student.Designation,
        "Resume": student.Resume,
        "OurFeedback": student.OurFeedback,
        "ImprovementsNeeded": student.ImprovementsNeeded
    }
    return Response({"status": "created", "data": data}, status=201)


# ------------------------
# Get Student by email
# ------------------------
@api_view(['POST'])
def get_student(request):
    email = request.data.get("email")
    try:
        student = Student.objects.get(StudentMail=email)
        data = {
            "id": student.id,
            "StudentMail": student.StudentMail,
            "StudentName": student.StudentName,
            "Tokens": student.Tokens,
            "ExpectedPosition": student.ExpectedPosition,
            "Designation": student.Designation,
            "Resume": student.Resume,
            "OurFeedback": student.OurFeedback,
            "ImprovementsNeeded": student.ImprovementsNeeded,
        }
        print("get_student called.. Status: exists")
        return Response({"status": "exists", "data": data})
    except Student.DoesNotExist:
        print("get_student called.. Status: not_found")
        return Response({"status": "not_found"})


# ------------------------
# Update Tokens
# ------------------------
@api_view(['PUT'])
def update_tokens(request):
    email = request.data.get("email")
    tokens = int(request.data.get("tokens", 0))
    try:
        student = Student.objects.get(StudentMail=email)
        student.Tokens += tokens
        student.save()
        print("update_tokens called.. Status: tokens_updated")
        return Response({"status": "tokens_updated", "tokens": student.Tokens})
    except Student.DoesNotExist:
        print("update_tokens called.. Status: Student not found")
        return Response({"error": "Student not found"}, status=404)


# ------------------------
# Update Resume text
# ------------------------
@api_view(['POST'])
def update_resume(request):
    email = request.data.get("email")
    new_resume = request.data.get("resume")
    if not email or new_resume is None:
        print("update_resume called.. Status: error")
        return Response({"status": "error", "message": "Email and resume content required"}, status=400)

    try:
        student = Student.objects.get(StudentMail=email)
        if student.Resume == new_resume:
            print("update_resume called.. Status: no_change")
            return Response({"status": "no_change", "message": "Resume is the same as before"})
        student.Resume = new_resume
        print("update_resume called.. Status: success")
        student.save()
        return Response({"status": "success", "message": "Resume updated successfully"})
    except Student.DoesNotExist:
        print("update_resume called.. Status: not_found")
        return Response({"status": "not_found", "message": "Student not found"}, status=404)


# ------------------------
# Update Scores after Interview
# ------------------------
@api_view(['PUT'])
def update_scores(request):
    email = request.data.get("email")
    new_scores = request.data.get("Scores", [])  # expects list of integers
    feedback = request.data.get("OurFeedback", "")
    improvements = request.data.get("ImprovementsNeeded", "")

    try:
        student = Student.objects.get(StudentMail=email)

        # Update Candidate Scores JSONField
        candidate, _ = Candidate.objects.get_or_create(student=student)
        if not candidate.Scores:
            candidate.Scores = []

        # Append new scores
        if new_scores:
            candidate.Scores.append(new_scores)  # store as a list of lists, like MongoDB
        candidate.save()

        # Update feedback fields on Student model
        student.OurFeedback = feedback
        student.ImprovementsNeeded = improvements
        student.save()

        print("update_scores called.. Status: scores_updated")
        return Response({"status": "scores_updated"})
    except Student.DoesNotExist:
        print("update_scores called.. Status: Student not found")
        return Response({"error": "Student not found"}, status=404)
