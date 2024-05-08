import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CategoryScale, LinearScale, BarElement, Chart } from "chart.js";
import { Bar } from "react-chartjs-2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);

export default function Calendar({ loads }) {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // Initialize with current day
  const [busyTimesData, setBusyTimesData] = useState(null);

  useEffect(() => {
    const generateChartData = () => {
      const loadCountByHour = Array(24).fill(0);
      const filteredLoads = loads.filter((load) => {
        const startTime = new Date(load.Start);
        return startTime.getDay() === selectedDay;
      });

      filteredLoads.forEach((load) => {
        const startTime = new Date(load.Start);
        const startHour = startTime.getHours();
        loadCountByHour[startHour] += 1;
      });

      const chartData = {
        labels: Array.from({ length: 24 }, (_, i) => {
          if (i === 0) return "12am"; // Label "0am" as "12am"
          // Display labels every 3 hours
          if (i % 3 === 0) {
            // Convert to am/pm notation
            const hours = i > 12 ? i - 12 : i;
            const amPm = i >= 12 ? "pm" : "am";
            return hours === 0 ? `${hours + 12}${amPm}` : `${hours}${amPm}`;
          }
          return ""; // Hide other labels
        }),
        datasets: [
          {
            label: "Load Count",
            backgroundColor: "#AEC6CF",
            hoverBackgroundColor: "#779ECB",
            barPercentage: 1.2,
            data: loadCountByHour,
          },
        ],
      };

      setBusyTimesData(chartData);
    };

    if (loads.length > 0) generateChartData();
  }, [loads, selectedDay]);

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        // Remove the x-axis grid
        ticks: {
          display: true,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      // Remove y-axis
      y: {
        display: false,
      },
    },
  };

  return (
    <Box
      style={{
        width: window.innerWidth > 1000 ? "40%" : "90%",
        margin: "auto",
      }}
    >
      {/* Day selection buttons */}
      <Box display="flex" justifyContent="center" marginBottom={3}>
        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
          <Button
            key={day}
            onClick={() => handleDayChange(day)}
            variant={selectedDay === day ? "contained" : "outlined"}
            color="primary"
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
          </Button>
        ))}
      </Box>
      {/* Display chart */}
      {busyTimesData && (
        <Box style={{ height: "20%" }}>
          <Bar data={busyTimesData} options={chartOptions} />
        </Box>
      )}
    </Box>
  );
}

Calendar.propTypes = {
  loads: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      MachineID: PropTypes.number,
      Duration: PropTypes.number,
      Start: PropTypes.string,
      End: PropTypes.string,
    }),
  ),
};
