import axios from "axios";
import React, { ChangeEvent, Dispatch, KeyboardEvent, useState } from "react";
import { Debts } from "../../types/types";

type ModalProps = {
  onClose: () => void;
  setDebts: Dispatch<React.SetStateAction<Debts[]>>;
};

const Modal: React.FC<ModalProps> = ({ onClose, setDebts }) => {
  const [percentage, setPercentage] = useState(0);
  const [showSpecifyInput, setShowSpecifyInput] = useState(false);
  const [otherTypeOfDebt, setOtherTypeOfDebt] = useState("");
  const [inputError, setInputError] = useState(false);
  const [error, setError] = useState({
    startDateError: false,
    maturityDateError: false,
    initialAmountError: false,
  });
  const [formData, setFormData] = useState({
    typeOfDebt: "Senior_secured",
    initialAmount: 0,
    startDate: "",
    maturityDate: "",
    interestRate: 0,
    currency: "USD",
  });

  const handleAddDebt = () => {
    let hasError = false;
    if (!formData.startDate) {
      setError((prevError) => ({ ...prevError, startDateError: true }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, startDateError: false }));
    }
    if (!formData.maturityDate) {
      setError((prevError) => ({ ...prevError, maturityDateError: true }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, maturityDateError: false }));
    }
    if (formData.initialAmount === 0) {
      setError((prevError) => ({ ...prevError, initialAmountError: true }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, initialAmountError: false }));
    }
    if (hasError) {
      return;
    }

    axios
      .post("http://localhost:8000/debts", formData)
      .then((response) => {
        console.log("Debt added successfully: ", response.data);
        onClose();
        setDebts((prevDebts) => [...prevDebts, response.data]);
      })
      .catch((error) => {
        console.error("Error adding debt: ", error);
      });
  };

  
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "Other") {
      setShowSpecifyInput(true);
    } else {
      setShowSpecifyInput(false);
      setFormData({ ...formData, typeOfDebt: value });
    }
  };
  const handleOtherTypeOfDebtChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtherTypeOfDebt(e.target.value);
    setFormData({ ...formData, typeOfDebt: e.target.value });
  };

  const handleInitialAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isNaN(parseFloat(value))) {
      setFormData({ ...formData, initialAmount: parseFloat(value) });
    }

    if (isNaN(parseFloat(value))) {
      setInputError(true);
    } else {
      setInputError(false);
    }
  };
  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, currency: value });
  };
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      startDate: value,
    }));
  };

  const handleMaturityDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      maturityDate: value,
    }));
  };

  

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      if (value > 100) {
        value = 100;
      }
      setPercentage(parseFloat(value.toFixed(1)));
      setFormData({ ...formData, interestRate: parseFloat(value.toFixed(1)) });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      setPercentage((prevPercentage) =>
        prevPercentage + 0.1 <= 100
          ? parseFloat((prevPercentage + 0.1).toFixed(1))
          : prevPercentage
      );
      setFormData({
        ...formData,
        interestRate: parseFloat((percentage + 0.1).toFixed(1)),
      });
    } else if (e.key === "ArrowDown" && percentage > 0) {
      setPercentage((prevPercentage) =>
        prevPercentage - 0.1 >= 0
          ? parseFloat((prevPercentage - 0.1).toFixed(1))
          : prevPercentage
      );
      setFormData({
        ...formData,
        interestRate: parseFloat((percentage - 0.1).toFixed(1)),
      });
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Debt</h2>
          <button
            onClick={onClose}
            className="text-gray-800 hover:text-black focus:outline-none"
          >
            X
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-left">Type of debt</p>
          <select
            className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            name="typeOfDebt"
            onChange={handleSelectChange}
          >
            <option value="Senior_secured">Senior secured</option>
            <option value="Senior_unsecured">Senior unsecured</option>
            <option value="Subordinated">Subordinated</option>
            <option value="Convertible">Convertible</option>
            <option value="Preferred">Preferred</option>
            <option value="Other">Other</option>
          </select>
          {showSpecifyInput && (
            <div>
              <p className="text-sm text-left">Please specify</p>
              <input
                type="text"
                placeholder=""
                className="border border-gray-300 rounded-md py-2 px-3 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={otherTypeOfDebt}
                onChange={handleOtherTypeOfDebtChange}
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <p className="text-sm text-left">Initial amount</p>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Enter amount"
              className={`border ${
                error.initialAmountError
                  ? "border-red-500"
                  : inputError
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md py-2 px-3 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              onChange={handleInitialAmountChange}
            />
            <select
              className="border border-gray-300 rounded-md py-2 px-3 mt-1 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleCurrencyChange}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GDP">GBP</option>
            </select>
          </div>
          {error.initialAmountError && (
            <p className="text-xs text-left text-red-500 mt-1">
              {formData.initialAmount === 0 ? "Amount cannot be 0." : ""}
            </p>
          )}
          {inputError && (
            <p className="text-xs text-left text-red-500 mt-1">
              Amount must be a number.
            </p>
          )}
        </div>
        <div className="mb-4">
          <p className="text-sm text-left">Start and Maturity date</p>
          <div className="flex items-center">
            <input
              type="date"
              className="border border-gray-300 rounded-md py-2 px-3 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleStartDateChange}
            />
            <input
              type="date"
              className="border border-gray-300 rounded-md py-2 px-3 mt-1 ml-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleMaturityDateChange}
            />
          </div>
          <div className="flex justify-around">
            {error.startDateError && (
              <p className="text-sm text-red-500">
                Please enter the start date.
              </p>
            )}
            {error.maturityDateError && (
              <p className="text-sm text-red-500 ml-2">
                Please enter the maturity date.
              </p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-left">Interest Rate</p>
          <div className="flex items-center">
            <input
              type="text"
              value={percentage}
              placeholder="Enter percentage"
              className="border border-gray-300 rounded-md py-2 px-3 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <span className="ml-2 text-gray-500">%</span>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-800 hover:text-black focus:outline-none mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAddDebt}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Debt
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
