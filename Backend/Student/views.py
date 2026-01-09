# API/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
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
    tokens = int(request.data.get("TokensToAdd", 0))
    try:
        student = Student.objects.get(StudentMail=email)
        student.Tokens += tokens
        student.save()
        print("update_tokens called.. Status: tokens_updated")
        return Response({"status": "tokens_updated", "tokens": student.Tokens})
    except Student.DoesNotExist:
        print("update_tokens called.. Status: Student not found")
        return Response({"error": "Student not found"}, status=404)


# Update Std Details
@api_view(['PUT'])
def update_info(request):
    email = request.data.get("StudentMail")

    if not email:
        return Response(
            {"status": "email_required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        std = Student.objects.get(StudentMail=email)
    except Student.DoesNotExist:
        return Response(
            {"status": "not_found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # Update only provided fields
    std.StudentName = request.data.get("StudentName", std.StudentName)
    std.Designation = request.data.get("Designation", std.Designation)
    std.ExpectedPosition = request.data.get("ExpectedPosition", std.ExpectedPosition)
    std.Resume = request.data.get("Resume", std.Resume)

    std.save()

    print("update_org called.. Status: updated")
    return Response(
        {
            "status": "updated",
            "data": {
                "StudentMail": std.StudentMail,
                "StudentName": std.StudentName,
                "Designation": std.Designation,
                "ExpectedPosition": std.ExpectedPosition,
                "Resume": std.Resume,
            }
        },
        status=status.HTTP_200_OK
    )


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
