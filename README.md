# Advanced Spreadsheet Web Application

This project is developed as part of the Zeotap Software Engineer Intern Assignment (Jan 2025). It mimics the core functionalities of Google Sheets by providing a dynamic, interactive spreadsheet interface that supports mathematical and data quality functions, data entry, and key UI interactions.

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

Develop a web application that closely mimics Google Sheets. The focus is on:
- A spreadsheet interface with a toolbar, formula bar, and editable cells.
- Implementing mathematical functions and data quality functions.
- Supporting data entry and basic validation.
- Enabling drag & drop for cell content and row reordering.
- Allowing users to test the functionalities with real data.

---

## Features

### Spreadsheet Interface
- **Google Sheets–like UI:**  
  - Clean, table-based layout with a dedicated toolbar and formula bar.
  - Editable cells that update dynamically.
- **Drag Functions:**  
  - Drag & drop support (using `@hello-pangea/dnd`) for reordering rows.
- **Cell Dependencies & Formula Evaluation:**  
  - Cells support formulas (prefixed with `=`) to compute functions such as:
    - **SUM, AVERAGE, MAX, MIN, COUNT**  
    - Data quality functions: **TRIM, UPPER, LOWER**
- **Basic Cell Formatting:**  
  - Options to format cell text (bold, italic, font size, text color, background color) via toolbar buttons.
- **Add/Delete/Resize:**  
  - Buttons to add and delete rows and columns dynamically.
- **Find & Replace:**  
  - Input fields to find and replace text within the spreadsheet.

### Mathematical Functions
- Implements core functions:
  - **SUM:** Calculates the sum of a range of cells.
  - **AVERAGE:** Calculates the average of cell values.
  - **MAX:** Returns the maximum value.
  - **MIN:** Returns the minimum value.
  - **COUNT:** Counts numeric values.

### Data Quality Functions
- Supports:
  - **TRIM:** Removes leading/trailing whitespace.
  - **UPPER / LOWER:** Converts text to uppercase or lowercase.
  - **REMOVE_DUPLICATES:** Removes duplicate rows (by comparing cell values).
  - **FIND_AND_REPLACE:** Allows users to search and replace text.

### Data Entry & Validation
- Allows users to enter numbers, text, and dates.
- Implements basic validation within formula evaluations (treating non-numeric values as zero).

### Data Persistence & Visualization
- **Auto-save:** Automatically saves data every 5 seconds via backend API.
- **Export to Excel:** Exports spreadsheet data as a `.xlsx` file.
- **Chart Integration:** Displays a chart (using Chart.js) summarizing row totals.

### Bonus Features
- **Advanced Formula Parsing:**  
  - Supports cell references (e.g., A1) and ranges (e.g., A1:B2) in formulas.
- **Dark Mode:**  
  - Toggle between light and dark themes for better usability.
- **Additional Formatting Options:**  
  - Options for adjusting font size and background color.

---

## Technologies Used

- **Frontend:**  
  - **React.js** for building the UI.
  - **Axios** for API communication.
  - **Chart.js** and **react-chartjs-2** for data visualization.
  - **@hello-pangea/dnd** for drag & drop.
  - **XLSX** and **file-saver** for exporting data to Excel.
  - **Custom CSS** for styling (see `Spreadsheet.css`).

- **Backend:**  
  - **Django** with **Django REST Framework** to provide API endpoints for saving and loading spreadsheet data.
  - The backend is configured to run at `http://127.0.0.1:8000/api/` (update as necessary).

---

## Data Structures & Design

- **Spreadsheet Data:**  
  The spreadsheet is modeled as a two-dimensional array (matrix) of cell objects. Each cell contains:
  - **id:** A unique identifier.
  - **row/col:** Indices for its position.
  - **value:** The cell content (plain text or a formula).
  - **formatting:** An object containing formatting options (bold, italic, fontSize, text color, background color).

- **Formula Evaluation:**  
  Formulas (strings beginning with `=`) are parsed to identify functions and arguments. Cell references (e.g., "A1") and ranges (e.g., "A1:B2") are supported, with non-numeric values treated as zero during calculations.

- **UI Components:**  
  - **Cell Component:** Handles individual cell editing and formatting.
  - **Spreadsheet Component:** Integrates cells into a table, includes the toolbar, formula bar, find & replace section, and a chart for visualization.

---

## Installation & Setup

### Prerequisites
- **Node.js** and **npm** for the frontend.
- **Python** and **Django** for the backend (if using the full-stack version).

### Frontend Setup
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/Spreadsheet.git
