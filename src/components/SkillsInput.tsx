"use client";

import { useState } from "react";
import { X } from "lucide-react";

type SkillInputProps = {
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  label?: string;
  maxSkills?: number; // optional limit
};

function SkillInput({
  skills = [],
  onChange,
  placeholder = "Add a skill (Press Enter)",
  label,
  maxSkills,
}: SkillInputProps) {
  const [input, setInput] = useState("");

  const handleAddSkill = () => {
    const trimmedInput = input.trim();
    if (
      trimmedInput &&
      !skills.includes(trimmedInput) &&
      (!maxSkills || skills.length < maxSkills)
    ) {
      onChange([...skills, trimmedInput]);
      setInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleBlur = () => {
    if (input.trim()) {
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
          {label}
        </label>
      )}

      {/* Input Field */}
      <div className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full border-none bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={!!maxSkills && skills.length >= maxSkills}
        />
      </div>

      {/* Skill Tags */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
  {skills.map((skill, index) => (
    <span
      key={index}
      className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-600 text-amber-900 dark:text-white text-sm px-3 py-1 rounded-full"
    >
      {skill}
      <button
        type="button"
        onClick={() => handleRemoveSkill(skill)}
        className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  ))}
</div>

      )}

      {/* Optional helper or warning */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Press Enter or comma to add a skill{maxSkills ? ` (max ${maxSkills})` : ""}.
      </p>
      {maxSkills && skills.length >= maxSkills && (
        <p className="text-xs text-red-500 font-medium">Skill limit reached.</p>
      )}
    </div>
  );
}

export default SkillInput;
