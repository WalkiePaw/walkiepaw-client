import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'NEXON Lv1 Gothic OTF', sans-serif;

  &:focus {
    outline: none;
    border-color: #E8C5A5;
    box-shadow: 0 0 0 2px rgba(232, 197, 165, 0.2);
  }
`;

const CustomHeader = styled.div`
  background-color: #E8C5A5;
  padding: 10px;
  color: #43312A;
  text-align: center;
  font-weight: bold;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  color: #43312A;
  font-size: 18px;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(67, 49, 42, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const CustomSelect = styled.select`
  background-color: transparent;
  border: 1px solid #43312A;
  padding: 2px 5px;
  border-radius: 4px;
  color: #43312A;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(67, 49, 42, 0.2);
  }
`;

const CustomDayButton = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #E8C5A5;
    color: #43312A;
  }
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.8rem;
  margin-top: 4px;
  display: block;
`;

const BirthDatePicker = ({ selected, onChange, error }) => {
  const CustomDatePickerHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
      <CustomHeader>
        <HeaderButton onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
          {"<"}
        </HeaderButton>
        <SelectWrapper>
          <CustomSelect
              value={date.getFullYear()}
              onChange={({ target: { value } }) => changeYear(value)}
          >
            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(
                (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                )
            )}
          </CustomSelect>
          <CustomSelect
              value={date.getMonth()}
              onChange={({ target: { value } }) => changeMonth(value)}
          >
            {[
              "1월", "2월", "3월", "4월", "5월", "6월",
              "7월", "8월", "9월", "10월", "11월", "12월"
            ].map((month, i) => (
                <option key={month} value={i}>
                  {month}
                </option>
            ))}
          </CustomSelect>
        </SelectWrapper>
        <HeaderButton onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
          {">"}
        </HeaderButton>
      </CustomHeader>
  );

  return (
      <>
        <StyledDatePicker
            selected={selected}
            onChange={onChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="생년월일 선택"
            maxDate={new Date()}
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            renderCustomHeader={CustomDatePickerHeader}
            dayClassName={() => "custom-day"}
            renderDayContents={(day, date) => (
                <CustomDayButton>{day}</CustomDayButton>
            )}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </>
  );
};

export default BirthDatePicker;