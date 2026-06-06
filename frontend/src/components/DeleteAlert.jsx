import React from "react"

const DeleteAlert = ({ content, onDelete, onCancel }) => {
  return (
    <div className="space-y-4">

      {/* Message */}
      <p className="text-sm text-gray-600">
        {content}
      </p>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">

        {/* Cancel */}
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm transition"
        >
          Delete
        </button>

      </div>
    </div>
  )
}

export default DeleteAlert