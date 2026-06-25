import { IoMdStar } from "react-icons/io";
const StarRating = ({ value, onChange, readOnly = false }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readOnly && onChange(star)}
          className={`text-3xl transition-colors
            ${star <= value ? 'text-yellow-400' : 'text-gray-300'}
            ${!readOnly ? 'cursor-pointer hover:text-yellow-300' : ''}
          `}
        >
          <IoMdStar/>
        </span>
      ))}
    </div>
  );
};

export default StarRating;