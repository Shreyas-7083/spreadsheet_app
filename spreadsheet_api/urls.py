from django.urls import path
from .views import load_spreadsheet, save_spreadsheet

urlpatterns += [
    path('save/', save_spreadsheet, name='save_spreadsheet'),
    path('load/<int:spreadsheet_id>/', load_spreadsheet, name='load_spreadsheet'),
]
