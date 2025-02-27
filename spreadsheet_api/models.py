from django.db import models

class Spreadsheet(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class Cell(models.Model):
    spreadsheet = models.ForeignKey(Spreadsheet, on_delete=models.CASCADE, related_name='cells')
    row = models.IntegerField()
    column = models.IntegerField()
    value = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = ('spreadsheet', 'row', 'column')
