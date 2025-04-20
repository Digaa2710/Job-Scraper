from django.urls import path
from .views import JobListView, ScrapeJobsView,JobDetailView,JobSummaryView

urlpatterns = [
    path('jobs/', JobListView.as_view(), name='job-list'),
    path('scrape-jobs/', ScrapeJobsView.as_view(), name='scrape-jobs'),
    path('jobs/<int:id>/', JobDetailView.as_view(), name='job-detail'),
     path('jobs/<int:id>/summary/', JobSummaryView.as_view(), name='job-summary'),
]
