import React, { useEffect, useState } from "react";
import { updateCell } from "../../api";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Bar } from "react-chartjs-2";
import "../../styles/Spreadsheet.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ROWS = 10;
const COLS = 5;

// Helper to create an empty cell with default formatting
const createEmptyCell = (row, col, id) => ({
  id,
  row,
  col,
  value: "",
  formatting: {
    bold: false,
    italic: false,
    fontSize: 14,
    color: "#000000",
    backgroundColor: "#ffffff"
  }
});

// Helper: Convert column letters to index (e.g., A => 0, B => 1, AA => 26)
const letterToIndex = (letters) => {
  let col = 0;
  for (let i = 0; i < letters.length; i++) {
    col = col * 26 + (letters.charCodeAt(i) - 65 + 1);
  }
  return col - 1;
};

// Helper: Parse cell reference like "A1" into {row, col} (zero-indexed)
const parseCellRef = (ref) => {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  const letters = match[1];
  const row = parseInt(match[2], 10) - 1;
  const col = letterToIndex(letters);
  return { row, col };
};

const Spreadsheet = () => {
  // Initialize cells as a 2D array of cell objects
  const [cells, setCells] = useState(() => {
    let arr = [];
    let id = 1;
    for (let r = 0; r < ROWS; r++) {
      let row = [];
      for (let c = 0; c < COLS; c++) {
        row.push(createEmptyCell(r, c, id++));
      }
      arr.push(row);
    }
    return arr;
  });
  const [spreadsheetId, setSpreadsheetId] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null); // { row, col }
  const [formula, setFormula] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (spreadsheetId) {
      axios
        .get(`http://127.0.0.1:8000/api/load/${spreadsheetId}/`)
        .then((response) => setCells(response.data.cells));
    }
  }, [spreadsheetId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (spreadsheetId) {
        axios.post("http://127.0.0.1:8000/api/save/", { cells });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [cells, spreadsheetId]);

  // When a cell is clicked, mark it as selected and load its formula
  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
    setFormula(cells[row][col].value);
  };

  // Formula bar handlers
  const handleFormulaChange = (e) => {
    setFormula(e.target.value);
  };

  const handleFormulaBlur = () => {
    if (selectedCell) {
      updateCellValue(selectedCell.row, selectedCell.col, formula);
    }
  };

  // Update cell value and evaluate formula if needed
  const updateCellValue = (row, col, value) => {
    const newCells = cells.map((r) => r.slice());
    newCells[row][col].value = value;
    if (value.startsWith("=")) {
      newCells[row][col].value = evaluateFormula(value, newCells);
    }
    setCells(newCells);
  };

  // Advanced formula evaluation supporting cell references and ranges (e.g., A1:B2)
  const evaluateFormula = (value, cellsArray) => {
    try {
      // Remove leading '='
      const expr = value.slice(1);
      const handleFunction = (func, arg) => {
        let numbers = [];
        if (arg.includes(":")) {
          // Range reference
          const [startRef, endRef] = arg.split(":");
          const start = parseCellRef(startRef);
          const end = parseCellRef(endRef);
          if (start && end) {
            for (let r = start.row; r <= end.row; r++) {
              for (let c = start.col; c <= end.col; c++) {
                const cellVal = parseFloat(cellsArray[r][c].value);
                numbers.push(isNaN(cellVal) ? 0 : cellVal);
              }
            }
          }
        } else {
          // Comma-separated values or cell references
          const parts = arg.split(",");
          parts.forEach((part) => {
            part = part.trim();
            const ref = parseCellRef(part);
            if (ref) {
              const cellVal = parseFloat(cellsArray[ref.row][ref.col].value);
              numbers.push(isNaN(cellVal) ? 0 : cellVal);
            } else {
              const num = parseFloat(part);
              numbers.push(isNaN(num) ? 0 : num);
            }
          });
        }
        switch (func) {
          case "SUM":
            return numbers.reduce((a, b) => a + b, 0);
          case "AVERAGE":
            return (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2);
          case "MAX":
            return Math.max(...numbers);
          case "MIN":
            return Math.min(...numbers);
          case "COUNT":
            return numbers.length;
          default:
            return "Error!";
        }
      };

      const functionMatch = expr.match(/^(\w+)\((.+)\)$/);
      if (functionMatch) {
        const func = functionMatch[1].toUpperCase();
        const arg = functionMatch[2];
        if (["SUM", "AVERAGE", "MAX", "MIN", "COUNT"].includes(func)) {
          return handleFunction(func, arg);
        }
        if (func === "TRIM") return arg.trim();
        if (func === "UPPER") return arg.toUpperCase();
        if (func === "LOWER") return arg.toLowerCase();
      }
    } catch (error) {
      return "Error!";
    }
    return value;
  };

  // New handleCellChange that uses row and col indices
  const handleCellChange = (row, col, value) => {
    updateCellValue(row, col, value);
    // Optionally, you can call updateCell API here if you want instant persistence
    // updateCell(cells[row][col].id, { value });
  };

  // Find & Replace functionality
  const findAndReplace = (findText, replaceText) => {
    const newCells = cells.map((row) =>
      row.map((cell) => ({
        ...cell,
        value: cell.value.replace(new RegExp(findText, "g"), replaceText)
      }))
    );
    setCells(newCells);
  };

  // Save spreadsheet to backend
  const saveSpreadsheet = () => {
    axios
      .post("http://127.0.0.1:8000/api/save/")
      .then((response) => setSpreadsheetId(response.data.spreadsheet_id));
  };

  // Export spreadsheet data to Excel
  const exportToExcel = () => {
    // Flatten cells into a 2D array of values
    const exportData = cells.map((row) => row.map((cell) => cell.value));
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Spreadsheet");
    XLSX.writeFile(workbook, "spreadsheet.xlsx");
  };

  // Drag & drop reordering of rows
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newCells = Array.from(cells);
    const [removed] = newCells.splice(result.source.index, 1);
    newCells.splice(result.destination.index, 0, removed);
    setCells(newCells);
  };

  // Row and column operations
  const addRow = () => {
    const newRowIndex = cells.length;
    let maxId = 0;
    cells.forEach((row) =>
      row.forEach((cell) => {
        if (cell.id > maxId) maxId = cell.id;
      })
    );
    const newRow = [];
    for (let c = 0; c < COLS; c++) {
      newRow.push(createEmptyCell(newRowIndex, c, maxId + c + 1));
    }
    setCells([...cells, newRow]);
  };

  const deleteRow = () => {
    if (cells.length === 0) return;
    setCells(cells.slice(0, cells.length - 1));
  };

  const addColumn = () => {
    let maxId = 0;
    cells.forEach((row) =>
      row.forEach((cell) => {
        if (cell.id > maxId) maxId = cell.id;
      })
    );
    const newCells = cells.map((row, rowIndex) => [
      ...row,
      createEmptyCell(rowIndex, row.length, maxId + 1)
    ]);
    setCells(newCells);
  };

  const deleteColumn = () => {
    if (cells.length === 0 || cells[0].length === 0) return;
    const newCells = cells.map((row) => row.slice(0, row.length - 1));
    setCells(newCells);
  };

  // Remove duplicate rows
  const removeDuplicates = () => {
    const uniqueRows = [];
    const seen = new Set();
    for (let row of cells) {
      const rowString = row.map((cell) => cell.value).join("|");
      if (!seen.has(rowString)) {
        seen.add(rowString);
        uniqueRows.push(row);
      }
    }
    setCells(uniqueRows);
  };

  // Generate chart data: Sum of each row's numeric values
  const generateChartData = () => {
    const labels = cells.map((_, index) => `Row ${index + 1}`);
    const values = cells.map((row) =>
      row.reduce((sum, cell) => sum + (parseFloat(cell.value) || 0), 0)
    );
    return {
      labels,
      datasets: [{ label: "Row Totals", data: values, backgroundColor: "blue" }]
    };
  };

  // Basic formatting functions for selected cell
  const applyFormatting = (formatType) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const newCells = cells.map((r) => r.map((cell) => ({ ...cell })));
    switch (formatType) {
      case "bold":
        newCells[row][col].formatting.bold = !newCells[row][col].formatting.bold;
        break;
      case "italic":
        newCells[row][col].formatting.italic = !newCells[row][col].formatting.italic;
        break;
      case "increaseFont":
        newCells[row][col].formatting.fontSize += 2;
        break;
      case "decreaseFont":
        newCells[row][col].formatting.fontSize = Math.max(
          8,
          newCells[row][col].formatting.fontSize - 2
        );
        break;
      case "colorRed":
        newCells[row][col].formatting.color = "red";
        break;
      case "bgYellow":
        newCells[row][col].formatting.backgroundColor = "yellow";
        break;
      default:
        break;
    }
    setCells(newCells);
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "spreadsheet-container dark-mode" : "spreadsheet-container"}>
      <h2>📊 Advanced Spreadsheet</h2>
      <div className="toolbar">
        <button onClick={saveSpreadsheet}>💾 Save Spreadsheet</button>
        <button onClick={exportToExcel}>📤 Export to Excel</button>
        <button onClick={addRow}>➕ Add Row</button>
        <button onClick={deleteRow}>➖ Delete Row</button>
        <button onClick={addColumn}>➕ Add Column</button>
        <button onClick={deleteColumn}>➖ Delete Column</button>
        <button onClick={removeDuplicates}>Remove Duplicates</button>
        <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
        <button onClick={() => applyFormatting("bold")}>Bold</button>
        <button onClick={() => applyFormatting("italic")}>Italic</button>
        <button onClick={() => applyFormatting("increaseFont")}>Increase Font</button>
        <button onClick={() => applyFormatting("decreaseFont")}>Decrease Font</button>
        <button onClick={() => applyFormatting("colorRed")}>Red Text</button>
        <button onClick={() => applyFormatting("bgYellow")}>Yellow Background</button>
      </div>

      <div className="formula-bar">
        <input
          type="text"
          value={formula}
          onChange={handleFormulaChange}
          onBlur={handleFormulaBlur}
          placeholder="Enter formula (e.g., =SUM(A1:B2))"
        />
      </div>

      <div className="find-replace">
        <input type="text" placeholder="Find" id="findText" />
        <input type="text" placeholder="Replace" id="replaceText" />
        <button
          onClick={() =>
            findAndReplace(
              document.getElementById("findText").value,
              document.getElementById("replaceText").value
            )
          }
        >
          Find & Replace
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="spreadsheet">
          {(provided) => (
            <table
              className="spreadsheet-table"
              border="1"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <tbody>
                {cells.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        style={{
                          fontWeight: cell.formatting.bold ? "bold" : "normal",
                          fontStyle: cell.formatting.italic ? "italic" : "normal",
                          fontSize: cell.formatting.fontSize,
                          color: cell.formatting.color,
                          backgroundColor: cell.formatting.backgroundColor
                        }}
                      >
                        <input
                          type="text"
                          value={cell.value || ""}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>

      <div className="chart-container">
        <Bar data={generateChartData()} />
      </div>
    </div>
  );
};

export default Spreadsheet;
