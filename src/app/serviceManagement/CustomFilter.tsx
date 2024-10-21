import React, { useState, useEffect, useCallback } from 'react';
import { useGridFilter } from 'ag-grid-react';

interface FilterModel {
    values: string[];
}

interface CustomFilterProps {
    model: FilterModel;
    onModelChange: (model: FilterModel) => void;
    getValue: (node: { data: { status: string } }) => string;
}

const CustomFilter: React.FC<CustomFilterProps> = ({ model, onModelChange, getValue }) => {
    const [checkboxState, setCheckboxState] = useState({
        APPROVED: false,
        REJECTED: false,
        PENDING: false,
    });

    useEffect(() => {
        onModelChange({ values: Object.keys(checkboxState).filter((key) => checkboxState[key as keyof typeof checkboxState]) });
    }, [checkboxState, onModelChange]);

    const doesFilterPass = useCallback(({ node }: { node: { data: { status: string } } }) => {
        const selectedStatuses = model?.values || [];
        if (selectedStatuses.length === 0) {
            return true;
        }
        return selectedStatuses.includes(getValue(node));
    }, [model, getValue]);

    useGridFilter({ doesFilterPass });

    const handleCheckboxChange = (status: keyof typeof checkboxState) => {
        setCheckboxState((prevState) => {
            const newState = { ...prevState, [status]: !prevState[status] };
            onModelChange({ values: Object.keys(newState).filter((key) => newState[key as keyof typeof newState]) });
            return newState;
        });
    };

    return (
        <div className="flex flex-col m-2">
            <strong className="mb-2">Status Filter</strong>
            <div className="flex items-center gap-x-2 mb-1">
                <input
                    type="checkbox"
                    name="APPROVED"
                    checked={checkboxState.APPROVED}
                    onChange={() => handleCheckboxChange("APPROVED")}
                />
                <label>APPROVED</label>
            </div>

            <div className="flex items-center gap-x-2 mb-1">
                <input
                    type="checkbox"
                    name="REJECTED"
                    checked={checkboxState.REJECTED}
                    onChange={() => handleCheckboxChange("REJECTED")}
                />
                <label>REJECTED</label>
            </div>

            <div className="flex items-center gap-x-2 mb-1">
                <input
                    type="checkbox"
                    name="PENDING"
                    checked={checkboxState.PENDING}
                    onChange={() => handleCheckboxChange("PENDING")}
                />
                <label>PENDING</label>
            </div>
        </div>
    );
};

export default CustomFilter;
