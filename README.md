# Advanced Spreadsheet Web Application

This project is developed as part of the Zeotap Software Engineer Intern Assignment (Jan 2025). It mimics the core functionalities of Google Sheets by providing a dynamic, interactive spreadsheet interface with support for mathematical and data quality functions, data entry, and key UI interactions.

---

## Table of Contents

- [Objective](#objective)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Data Structures & Design](#data-structures--design)
- [Installation & Setup](#installation--setup)
- [Usage Instructions](#usage-instructions)
- [Bonus Features](#bonus-features)
- [Project Structure](#project-structure)
- [Additional Notes](#additional-notes)

---

## Objective

Develop a web application that closely mimics the user interface and core functionalities of Google Sheets. The focus is on implementing a spreadsheet interface with a toolbar, formula bar, and editable cells; providing mathematical functions and data quality functions; ensuring proper data entry and validation; and integrating bonus features like auto-save, export, and data visualization.

---

## Features

### Spreadsheet Interface
- **UI Mimicry:**  
  - A table-based layout with a dedicated toolbar and formula bar.
  - Editable cells that update dynamically.
- **Drag & Drop:**  
  - Implemented using `@hello-pangea/dnd` for reordering rows.
- **Cell Dependencies & Formula Evaluation:**  
  - Supports formulas starting with `=` (e.g., `=SUM(A1:B2)`, `=AVERAGE(A1:A5)`, etc.).
- **Basic Formatting:**  
  - Options to toggle bold, italic, adjust font size, text color, and background color via toolbar buttons.
- **Row/Column Management:**  
  - Buttons to add and delete rows and columns.
- **Find & Replace:**  
  - Functionality to search for and replace text within the spreadsheet.

### Mathematical Functions
- Implements functions including:
  - **SUM, AVERAGE, MAX, MIN, COUNT**

### Data Quality Functions
- Implements:
  - **TRIM, UPPER, LOWER**
  - **Remove Duplicates:** (Removes duplicate rows based on cell values)
  - **Find & Replace**

### Data Entry & Validation
- Supports input of numbers, text, and dates.
- Basic validation is performed in formula evaluation (non-numeric values are treated as 0 in calculations).

### Data Persistence & Visualization
- **Auto-save:**  
  - Automatically saves spreadsheet data to the backend every 5 seconds.
- **Export:**  
  - Exports spreadsheet data as an Excel file (`.xlsx`).
- **Chart Integration:**  
  - Displays a chart (using Chart.js via react-chartjs-2) that summarizes row totals.

### Bonus Features
- **Advanced Formula Parsing:**  
  - Supports cell references (e.g., A1) and ranges (e.g., A1:B2).
- **Dark Mode:**  
  - A toggle to switch between light and dark themes.
- **Additional Formatting:**  
  - Enhanced cell formatting options for text and background.

---

## Technologies Used

- **Frontend:**  
  - React.js  
  - Axios  
  - Chart.js & react-chartjs-2  
  - @hello-pangea/dnd  
  - XLSX & file-saver  
  - Custom CSS for styling

- **Backend:**  
  - Django with Django REST Framework (API endpoints for saving and loading spreadsheet data)  
  - Default configuration expects the API at `http://127.0.0.1:8000/api/` (update as needed)

---

## Data Structures & Design

- **Spreadsheet Data:**  
  The spreadsheet is represented as a 2D array (matrix) of cell objects. Each cell includes:
  - **id:** Unique identifier  
  - **row/col:** Position indices  
  - **value:** Cell content (plain text or formula)  
  - **formatting:** An object containing properties like bold, italic, fontSize, text color, and background color

- **Formula Evaluation:**  
  Formulas (prefixed with `=`) are parsed to identify functions and their arguments. Supported functions include SUM, AVERAGE, MAX, MIN, COUNT, TRIM, UPPER, and LOWER. Cell references (e.g., A1) and ranges (e.g., A1:B2) are supported.

- **UI Components:**  
  - **Cell Component:** Manages individual cell editing and formatting.  
  - **Spreadsheet Component:** Combines cells into a table, includes a toolbar, formula bar, find & replace section, and integrates data visualization.

---

## Installation & Setup

### Prerequisites
- Node.js and npm
- Python and Django (if running the full-stack version)

### Frontend Setup
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/Spreadsheet.git
