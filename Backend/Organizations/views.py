# API/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Organization, Candidate, CandidateScore

# Check if organization exists
@api_view(['POST'])
def get_org(request):
    email = request.data.get("email")
    try:
        org = Organization.objects.get(email=email)
        # Build a simple dict for response
        data = {
            "email": org.email,
            "name": org.name,
            "tokens": org.tokens,
            "org_size": org.org_size,
        }
        print("get_org called.. Status: exists")
        return Response({"status": "exists", "data": data})
    except Organization.DoesNotExist:
        print("get_org called.. Status: not_found")
        return Response({"status": "not_found"})

# Create new organization record
@api_view(['POST'])
def create_org(request):
    email = request.data.get("email")
    if Organization.objects.filter(email=email).exists():
        print("creat_org called.. Status: exists")
        return Response({"status": "exists"}, status=200)
    org = Organization.objects.create(
        email=email,
        name=request.data.get("name", ""),
        tokens=int(request.data.get("tokens", 0)),
        org_size=request.data.get("org_size","")
    )
    print("creat_org called.. Status: created")
    return Response({"status": "created", "id": org.id}, status=201)

# Update token count (+ or -)
@api_view(['PUT'])
def update_tokens(request):
    email = request.data.get("email")
    tokens = int(request.data.get("tokens", 0))
    try:
        org = Organization.objects.get(email=email)
        org.tokens += tokens
        org.save()
        print("update_tokens called.. Status: updated")
        return Response({"status": "updated", "tokens": org.tokens})
    except Organization.DoesNotExist:
        print("update_tokens called.. Status: Org not found")
        return Response({"error": "Org not found"}, status=404)

# Update candidate records (names, resumes, scores)
@api_view(['PUT'])
def update_batch(request):
    email = request.data.get("email")
    cand_names = request.data.get("cand_names", [])
    cand_resumes = request.data.get("resume_infos", [])
    cand_scores = request.data.get("cand_scores", [])

    try:
        org = Organization.objects.get(email=email)

        for i, name in enumerate(cand_names):
            resume_info = cand_resumes[i] if i < len(cand_resumes) else ""
            scores = cand_scores[i] if i < len(cand_scores) else []

            # Create Candidate
            candidate = Candidate.objects.create(
                organization=org,
                name=name,
                resume_info=resume_info
            )

            # Create CandidateScores
            for score in scores:
                CandidateScore.objects.create(candidate=candidate, score=score)

        print("update_batch called.. Status: batch_updated")
        return Response({"status": "batch_updated"})
    except Organization.DoesNotExist:
        print("update_batch called.. Status: Org not found")
        return Response({"error": "Org not found"}, status=404)
