// ./components/ActionButtonsController.js
// (Ensure this file exists and is correctly defined as in the previous answer)
import React, { useState, useEffect } from "react";
import Buttons from "./buttons"; // Your actual buttons UI

const ActionButtonsController = ({
    optionValue,
    timeValue,
    onSearchClick,
    onTellPeopleClick,
    // You might want to pass isDisabled directly if buttons need to be disabled based on that
    // isDisabled,
}) => {
    const [showButton, setShowButton] = useState(false);
    const [tellButton, setTellButton] = useState(false);

    useEffect(() => {
        setShowButton(optionValue.trim() !== "");
    }, [optionValue]);

    useEffect(() => {
        if (timeValue.trim() !== "") {
            const timer = setTimeout(() => {
                setTellButton(true);
            }, 450);
            return () => clearTimeout(timer);
        } else {
            setTellButton(false);
        }
    }, [timeValue]);

    return (
        <Buttons
            showButton={showButton}
            tellButton={tellButton}
            handleFirstButton={onSearchClick}
            handleTellPeople={onTellPeopleClick}
            // Pass other props if your Buttons component needs them
        />
    );
};

export default ActionButtonsController;