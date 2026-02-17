//generate code for Edit/Save/Cancel buttons to toggle between edit and view mode in React using TypeScript and react-hook-form and make sure it is responsive and mobile-friendly and follows best practices for accessibility and user experience as well strictly follow the frontend-spec.md guidelines for styling and component structure.
import React from "react";

interface EditModeToggleProps {
  isEditMode: boolean;
  onToggle: () => void;
}
const EditModeToggle: React.FC<EditModeToggleProps> = ({
  isEditMode,
  onToggle,
}) => {
  return (
    <div className="flex gap-2">
      {isEditMode ? (
        <button
          onClick={onToggle}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          {" "}
          Cancel{" "}
        </button>
      ) : (
        <button
          onClick={onToggle}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {" "}
          Edit{" "}
        </button>
      )}{" "}
    </div>
  );
};
export default EditModeToggle;
