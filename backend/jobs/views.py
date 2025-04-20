from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Job
from .serializers import JobSerializer
from .scraper import job_find_main
from .chatbot import summarize_text  # 🚀 Import your summarize_text function

class JobListView(APIView):
    def get(self, request):
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

class ScrapeJobsView(APIView):
    def post(self, request):
        scraped_jobs = job_find_main()
        print(f"Scraped {len(scraped_jobs)} jobs")

        new_jobs = []

        for job in scraped_jobs:
            new_job = Job.objects.create(
                title=job['title'],
                location=job['location'],
                salary=job['salary'],
                experience=job['experience'],
                openings=job['openings'],
                link=job['link']
            )
            new_jobs.append(new_job)

        serializer = JobSerializer(new_jobs, many=True)
        return Response({
            "saved_jobs_count": len(new_jobs),
            "saved_jobs": serializer.data
        })

class JobDetailView(APIView):
    def get(self, request, id):
        try:
            job = Job.objects.get(pk=id)
            serializer = JobSerializer(job)
            return Response(serializer.data)
        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

# 🚀 NEW: Summarize a Job Description by ID
class JobSummaryView(APIView):
    def get(self, request, id):
        try:
            job = Job.objects.get(pk=id)

            # You can summarize the title + location + salary + experience together
            text_to_summarize = f"""
            Job Title: {job.title}
            Location: {job.location}
            Salary: {job.salary}
            Experience: {job.experience}
            Openings: {job.openings}

            """

            summary = summarize_text(text_to_summarize)

            if summary:
                return Response({"summary": summary})
            else:
                return Response({"error": "Failed to generate summary."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
