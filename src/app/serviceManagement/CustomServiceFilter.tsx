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
        donation: false,
        thirumanjanam: false,
        abhisekam: false,
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
            <strong className="mb-2">Service Name Filter</strong>
            <div className="flex items-center gap-x-2 mb-1">
                <input
                    type="checkbox"
                    name="donation"
                    checked={checkboxState.donation}
                    onChange={() => handleCheckboxChange("donation")}
                />
                <label>donation</label>
            </div>

            <div className="flex items-center gap-x-2 mb-1">
                <input
                    type="checkbox"
                    name="thirumanjanam"
                    checked={checkboxState.thirumanjanam}
                    onChange={() => handleCheckboxChange("thirumanjanam")}
                />
                <label>thirumanjanam</label>
            </div>

            <div className="flex items-center gap-x-2 mb-1">
                <input
                    type="checkbox"
                    name="abhisekam"
                    checked={checkboxState.abhisekam}
                    onChange={() => handleCheckboxChange("abhisekam")}
                />
                <label>abhisekam</label>
            </div>
        </div>
    );
};

export default CustomFilter;
