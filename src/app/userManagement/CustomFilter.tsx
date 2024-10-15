import { useGridFilter } from 'ag-grid-react';
import { useState, useEffect, useCallback } from 'react';

interface FilterModel {
    values: string[];
}

interface CustomFilterProps {
    model: FilterModel;
    onModelChange: (model: FilterModel) => void;
    getValue: (node: { data: { isApproved: string } }) => string;
}

const CustomFilter: React.FC<CustomFilterProps> = ({ model, onModelChange, getValue }) => {
    const [checkboxState, setCheckboxState] = useState({
        approved: false,
        rejected: false,
        pending: false,
    });

    useEffect(() => {
        onModelChange({ values: Object.keys(checkboxState).filter((key) => checkboxState[key as keyof typeof checkboxState]) });
    }, [checkboxState, onModelChange]);

    const doesFilterPass = useCallback(({ node }: { node: { data: { isApproved: string } } }) => {
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
                    name="Approved"
                    checked={checkboxState.approved}
                    onChange={() => handleCheckboxChange("approved")}
                />
                <label>Approved</label>
            </div>

            <div className="flex items-center gap-x-2 mb-1">
                <input
                    type="checkbox"
                    name="Rejected"
                    checked={checkboxState.rejected}
                    onChange={() => handleCheckboxChange("rejected")}
                />
                <label>Rejected</label>
            </div>

            <div className="flex items-center gap-x-2 mb-1">
                <input
                    type="checkbox"
                    name="Pending"
                    checked={checkboxState.pending}
                    onChange={() => handleCheckboxChange("pending")}
                />
                <label>Pending</label>
            </div>
        </div>
    );
};

export default CustomFilter;
