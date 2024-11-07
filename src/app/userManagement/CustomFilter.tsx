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
        <div className="flex flex-col p-4 bg-white rounded-xl shadow-sm">
            <strong className="text-[#663399] text-sm font-semibold mb-4">Filter by Status</strong>
            
            <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-2 border-[#663399]/30 
                                 text-[#663399] focus:ring-[#663399]/20 cursor-pointer"
                        checked={checkboxState.approved}
                        onChange={() => handleCheckboxChange("approved")}
                    />
                    <span className="text-gray-700">Approved</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-2 border-[#663399]/30 
                                 text-[#663399] focus:ring-[#663399]/20 cursor-pointer"
                        checked={checkboxState.rejected}
                        onChange={() => handleCheckboxChange("rejected")}
                    />
                    <span className="text-gray-700">Rejected</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-2 border-[#663399]/30 
                                 text-[#663399] focus:ring-[#663399]/20 cursor-pointer"
                        checked={checkboxState.pending}
                        onChange={() => handleCheckboxChange("pending")}
                    />
                    <span className="text-gray-700">Pending</span>
                </label>
            </div>
        </div>
    );
};

export default CustomFilter;
