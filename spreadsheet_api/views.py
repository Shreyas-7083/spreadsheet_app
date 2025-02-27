from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Spreadsheet, Cell
from .serializers import SpreadsheetSerializer, CellSerializer

@api_view(['GET'])
def load_spreadsheet(request, spreadsheet_id):
    spreadsheet = Spreadsheet.objects.get(id=spreadsheet_id)
    cells = Cell.objects.filter(spreadsheet=spreadsheet)
    return Response({
        "spreadsheet": SpreadsheetSerializer(spreadsheet).data,
        "cells": CellSerializer(cells, many=True).data
    })

@api_view(['POST'])
def save_spreadsheet(request):
    spreadsheet = Spreadsheet.objects.create(name="New Spreadsheet")
    return Response({"spreadsheet_id": spreadsheet.id})
