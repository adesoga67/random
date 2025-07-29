// Transport Fare System - JavaScript Implementation (FIXED)

class TransportFareSystem {
  constructor() {
    // Initialize base fare rates (per km)
    this.baseFareRates = {
      Bus: 5.0,
      Taxi: 15.0,
      Truck: 25.0,
      Motorcycle: 8.0,
      Tricycle: 12.0,
    };

    // Initialize other values
    this.distance = 0.0;
    this.fuelPrice = 0.0;
    this.vehicleType = "Bus";
    this.roadConditionFactor = 1.0;
    this.timeOfDay = "Afternoon";
    this.trafficFactor = 1.0;
    this.unionLevy = 10.0; // Fixed levy per trip
    this.passengerCount = 1;

    // Fare calculation components
    this.baseFare = 0.0;
    this.fuelAdjustment = 0.0;
    this.roadAdjustment = 0.0;
    this.timeAdjustment = 0.0;
    this.trafficAdjustment = 0.0;
    this.totalFare = 0.0;
  }

  // Helper method to get time of day display text
  getTimeOfDayDisplay(timeOfDay) {
    const timeDisplayMap = {
      Morning_Peak: "Morning Peak (7-10 AM)",
      Afternoon: "Afternoon (10 AM - 4 PM)",
      Evening_Peak: "Evening Peak (4-8 PM)",
      Night: "Night (8 PM - 7 AM)",
    };
    return timeDisplayMap[timeOfDay] || "Unknown";
  }

  // Collect input details from form
  inputDetails() {
    this.distance = parseFloat(document.getElementById("distance").value) || 0;
    this.fuelPrice =
      parseFloat(document.getElementById("fuelPrice").value) || 0;
    this.vehicleType = document.getElementById("vehicleType").value || "Bus";

    // FIX 1: Correct the ID for roadCondition
    this.roadConditionFactor =
      parseFloat(document.getElementById("roadCondition").value) || 1.0;

    this.timeOfDay = document.getElementById("timeOfDay").value || "Afternoon";

    // FIX 2: Correct the ID for trafficFactor
    this.trafficFactor =
      parseFloat(document.getElementById("trafficFactor").value) || 1.0;

    this.passengerCount =
      parseInt(document.getElementById("passengerCount").value) || 1;
  }

  // Calculate base fare
  calculateBaseFare() {
    this.baseFare = this.distance * this.baseFareRates[this.vehicleType];
  }

  // Apply fuel price adjustment
  applyFuelAdjustment() {
    // Fuel adjustment: if fuel price > 100, add 10% per 50 units above 100
    if (this.fuelPrice > 100.0) {
      const fuelSurcharge = ((this.fuelPrice - 100.0) / 50.0) * 0.1;
      this.fuelAdjustment = this.baseFare * fuelSurcharge;
    } else {
      this.fuelAdjustment = 0.0;
    }
  }

  // Apply road condition adjustment
  applyRoadCondition() {
    this.roadAdjustment = this.baseFare * (this.roadConditionFactor - 1.0);
  }

  // Apply time of day factor
  applyTimeFactor() {
    let timeFactor = 1.0;

    switch (this.timeOfDay) {
      case "Morning_Peak":
        timeFactor = 1.25; // 25% surcharge
        break;
      case "Afternoon":
        timeFactor = 1.0; // No surcharge
        break;
      case "Evening_Peak":
        timeFactor = 1.3; // 30% surcharge
        break;
      case "Night":
        timeFactor = 1.15; // 15% surcharge
        break;
    }

    this.timeAdjustment = this.baseFare * (timeFactor - 1.0);
  }

  // Apply traffic factor
  applyTrafficFactor() {
    this.trafficAdjustment = this.baseFare * (this.trafficFactor - 1.0);
  }

  // Apply union levy (fixed amount per trip)
  applyUnionLevy() {
    // Union levy is already set as a fixed amount
    // No calculation needed, just use the fixed value
  }

  // Calculate total fare
  calculateTotalFare() {
    this.totalFare =
      this.baseFare +
      this.fuelAdjustment +
      this.roadAdjustment +
      this.timeAdjustment +
      this.trafficAdjustment +
      this.unionLevy;

    // If multiple passengers, apply per-passenger calculation
    if (this.passengerCount > 1) {
      this.totalFare *= this.passengerCount;
    }
  }

  // Display fare breakdown
  displayFareBreakdown() {
    // Update trip details
    document.getElementById("displayVehicleType").textContent =
      this.vehicleType;
    document.getElementById("displayDistance").textContent =
      this.distance.toFixed(1);
    document.getElementById("displayTimeOfDay").textContent =
      this.getTimeOfDayDisplay(this.timeOfDay);
    document.getElementById("displayPassengers").textContent =
      this.passengerCount;

    // Update fare components
    document.getElementById(
      "displayBaseFare"
    ).textContent = `₦${this.baseFare.toFixed(2)} (${this.distance.toFixed(
      1
    )} km × ₦${this.baseFareRates[this.vehicleType].toFixed(2)}/km)`;

    // Show/hide adjustments based on whether they apply
    this.updateAdjustmentDisplay("displayFuelAdjustment", this.fuelAdjustment);
    this.updateAdjustmentDisplay("displayRoadAdjustment", this.roadAdjustment);
    this.updateAdjustmentDisplay("displayTimeAdjustment", this.timeAdjustment);
    this.updateAdjustmentDisplay(
      "displayTrafficAdjustment",
      this.trafficAdjustment
    );

    document.getElementById(
      "displayUnionLevy"
    ).textContent = `₦${this.unionLevy.toFixed(2)}`;

    // Handle passenger calculation display
    const passengerSection = document.getElementById("passengerCalculation");
    if (this.passengerCount > 1) {
      const farePerPassenger =
        this.baseFare +
        this.fuelAdjustment +
        this.roadAdjustment +
        this.timeAdjustment +
        this.trafficAdjustment +
        this.unionLevy;
      document.getElementById(
        "displaySubtotal"
      ).textContent = `₦${farePerPassenger.toFixed(2)}`;
      document.getElementById("displayPassengerCount").textContent =
        this.passengerCount;
      passengerSection.style.display = "block";
    } else {
      passengerSection.style.display = "none";
    }

    // Display total fare
    document.getElementById(
      "displayTotalFare"
    ).textContent = `₦${this.totalFare.toFixed(2)}`;

    // Scroll to results
    document.getElementById("fareBreakdown").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Helper method to update adjustment displays
  updateAdjustmentDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (value > 0) {
      element.textContent = `₦${value.toFixed(2)}`;
      element.parentElement.style.display = "flex";
    } else {
      element.textContent = "₦0.00";
      // FIX 3: Don't hide elements with zero values, just show them as 0.00
      element.parentElement.style.display = "flex";
    }
  }

  // Validate form inputs
  validateInputs() {
    const errors = [];

    if (this.distance <= 0) {
      errors.push("Distance must be greater than 0");
    }

    if (this.fuelPrice <= 0) {
      errors.push("Fuel price must be greater than 0");
    }

    if (!this.vehicleType || this.vehicleType === "") {
      errors.push("Please select a vehicle type");
    }

    // FIX 4: Updated validation range for road condition factor
    if (this.roadConditionFactor < 1.0 || this.roadConditionFactor > 1.5) {
      errors.push("Please select a road condition");
    }

    if (!this.timeOfDay || this.timeOfDay === "") {
      errors.push("Please select a time of day");
    }

    // FIX 5: Updated validation range for traffic factor
    if (this.trafficFactor < 1.0 || this.trafficFactor > 1.6) {
      errors.push("Please select a traffic condition");
    }

    if (this.passengerCount <= 0) {
      errors.push("Number of passengers must be greater than 0");
    }

    return errors;
  }

  // Show error messages
  showErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll(".error-message");
    existingErrors.forEach((error) => error.remove());

    if (errors.length > 0) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.style.cssText = `
        background: #ffebee;
        border: 1px solid #f44336;
        border-radius: 8px;
        padding: 15px;
        margin: 20px 0;
        color: #c62828;
      `;

      const errorList = document.createElement("ul");
      errorList.style.margin = "0";
      errorList.style.paddingLeft = "20px";

      errors.forEach((error) => {
        const listItem = document.createElement("li");
        listItem.textContent = error;
        errorList.appendChild(listItem);
      });

      errorDiv.appendChild(
        document.createTextNode("Please fix the following errors:")
      );
      errorDiv.appendChild(errorList);

      const form = document.getElementById("fareForm");
      form.insertBefore(errorDiv, form.firstChild);

      // Scroll to top to show errors
      errorDiv.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  }

  // Main calculation process
  processCalculation() {
    // Collect inputs
    this.inputDetails();

    // FIX 6: Add debug logging
    console.log("Input values:", {
      distance: this.distance,
      fuelPrice: this.fuelPrice,
      vehicleType: this.vehicleType,
      roadConditionFactor: this.roadConditionFactor,
      timeOfDay: this.timeOfDay,
      trafficFactor: this.trafficFactor,
      passengerCount: this.passengerCount,
    });

    // Validate inputs
    const errors = this.validateInputs();
    if (!this.showErrors(errors)) {
      return false;
    }

    // Add loading animation
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = "Calculating...";
    submitButton.disabled = true;
    submitButton.classList.add("loading");

    // Simulate processing time for better UX
    setTimeout(() => {
      // Perform calculations
      this.calculateBaseFare();
      this.applyFuelAdjustment();
      this.applyRoadCondition();
      this.applyTimeFactor();
      this.applyTrafficFactor();
      this.applyUnionLevy();
      this.calculateTotalFare();

      // FIX 7: Add debug logging for calculations
      console.log("Calculation results:", {
        baseFare: this.baseFare,
        fuelAdjustment: this.fuelAdjustment,
        roadAdjustment: this.roadAdjustment,
        timeAdjustment: this.timeAdjustment,
        trafficAdjustment: this.trafficAdjustment,
        unionLevy: this.unionLevy,
        totalFare: this.totalFare,
      });

      // Display results
      this.displayFareBreakdown();

      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      submitButton.classList.remove("loading");
    }, 1000);

    return true;
  }

  setupExportButtons() {
    // Print functionality - Print only fare breakdown
    document.getElementById("printBtn").addEventListener("click", () => {
      const section = document.getElementById("fareBreakdown");
      if (
        section.innerHTML.trim() !== "" &&
        !section.innerHTML.includes('id="displayTotalFare">-<')
      ) {
        this.printFareBreakdown();
      } else {
        alert("Nothing to print. Please calculate fare first.");
      }
    });

    // PDF export functionality
    document.getElementById("pdfBtn").addEventListener("click", () => {
      const section = document.getElementById("fareBreakdown");
      if (
        section.innerHTML.trim() !== "" &&
        !section.innerHTML.includes('id="displayTotalFare">-<')
      ) {
        const opt = {
          margin: 0.5,
          filename: "atotoarere-fare-receipt.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };
        // Clone the section and remove buttons before export
        const clonedSection = section.cloneNode(true);
        const buttons = clonedSection.querySelector(".print_button");
        if (buttons) buttons.remove();

        html2pdf().from(clonedSection).set(opt).save();
      } else {
        alert("No fare summary to export. Please calculate fare first.");
      }
    });
  }

  // New method to handle printing only the fare breakdown
  printFareBreakdown() {
    // Get the fare breakdown section
    const fareBreakdown = document.getElementById("fareBreakdown");

    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600");

    // Create the print content with only the fare breakdown
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Atotoarere Transport Fare Receipt</title>
        <style>
          body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            color: #333;
            background: white;
          }
          .print-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4caf50;
            padding-bottom: 15px;
          }
          .print-header h1 {
            color: #4caf50;
            margin: 0;
            font-size: 1.8em;
          }
          .print-header p {
            margin: 5px 0 0 0;
            color: #666;
            font-size: 0.9em;
          }
          .breakdown-section {
            margin-bottom: 20px;
          }
          .breakdown-section p {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            margin: 5px 0;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 3px solid #4caf50;
          }
          .breakdown-section strong {
            color: #2e7d32;
          }
          .breakdown-section span {
            font-weight: 600;
            color: #1565c0;
          }
          .total-section {
            text-align: center;
            margin-top: 25px;
            padding: 20px;
            background: #4caf50;
            border-radius: 10px;
            color: white;
          }
          .total-section h3 {
            font-size: 1.5em;
            margin: 0;
          }
          .print-footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 0.9em;
          }
          .print_button {
            display: none !important;
          }
          @media print {
            body { margin: 0; }
            .print-header { page-break-after: avoid; }
            .total-section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>ATOTOARERE TRANSPORT FARE RECEIPT</h1>
          <p>Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
        </div>
        ${fareBreakdown.innerHTML}
        <div class="print-footer">
          <p>Thank you for using Atotoarere Transport Fare System</p>
          <p>Safe travels!</p>
        </div>
      </body>
      </html>
    `;

    // Write content to print window
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = function () {
      // Remove the print buttons from the print content
      const printButtons = printWindow.document.querySelector(".print_button");
      if (printButtons) {
        printButtons.style.display = "none";
      }

      // Print and close
      printWindow.print();
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };
  }
}

// Initialize the system when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const fareSystem = new TransportFareSystem();

  // Setup export buttons
  fareSystem.setupExportButtons();

  // Handle form submission
  document.getElementById("fareForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from submitting normally
    console.log("Form submitted!"); // Debug log
    fareSystem.processCalculation();
  });

  // Handle form reset
  document.getElementById("fareForm").addEventListener("reset", function (e) {
    setTimeout(() => {
      // Reset all display values after form resets
      const displayElements = [
        "displayVehicleType",
        "displayDistance",
        "displayTimeOfDay",
        "displayPassengers",
        "displayBaseFare",
        "displayFuelAdjustment",
        "displayRoadAdjustment",
        "displayTimeAdjustment",
        "displayTrafficAdjustment",
        "displayUnionLevy",
        "displaySubtotal",
        "displayPassengerCount",
        "displayTotalFare",
      ];

      displayElements.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = "-";
          if (element.parentElement) {
            element.parentElement.style.display = "flex";
          }
        }
      });

      // Hide passenger calculation section
      document.getElementById("passengerCalculation").style.display = "none";

      // Remove error messages
      const errorMessages = document.querySelectorAll(".error-message");
      errorMessages.forEach((error) => error.remove());
    }, 10);
  });

  // Add real-time validation feedback
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      this.style.borderColor = "";
      if (this.value && this.checkValidity()) {
        this.style.borderColor = "#4CAF50";
      } else if (this.value) {
        this.style.borderColor = "#f44336";
      }
    });
  });

  // Add input formatting
  const numberInputs = document.querySelectorAll('input[type="number"]');
  numberInputs.forEach((input) => {
    input.addEventListener("input", function () {
      // Remove any non-numeric characters except decimal point
      this.value = this.value.replace(/[^0-9.]/g, "");

      // Ensure only one decimal point
      const parts = this.value.split(".");
      if (parts.length > 2) {
        this.value = parts[0] + "." + parts.slice(1).join("");
      }
    });
  });

  console.log("Transport Fare System initialized successfully!");
});
