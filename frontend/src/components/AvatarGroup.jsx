import React from "react"

const AvatarGroup = ({ avatars = [], maxVisible = 3 }) => {
  return (
    <div className="flex items-center">

      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <div
          key={index}
          className={`relative w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm ${
            index !== 0 ? "-ml-3" : ""
          }`}
        >
          <img
            src={avatar}
            alt={`Avatar-${index}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/*  Extra Count */}
      {avatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-semibold rounded-full border-2 border-white -ml-3 shadow-sm">
          +{avatars.length - maxVisible}
        </div>
      )}

    </div>
  )
}

export default AvatarGroup