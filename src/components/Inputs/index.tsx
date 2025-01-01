import React from "react";
import styles from "./Inputs.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, value, onChange, ...props }: InputProps) {
  return (
    <label className={styles.label}>
      {label}
      <input
        type="number"
        value={value}
        onChange={onChange}
        className={styles.input}
        {...props}
      />
    </label>
  );
}

export function Range({ label, value, min, max, step, onChange }: InputProps) {
  return (
    <label className={styles.label}>
      {label}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        className={styles.range}
      />
    </label>
  );
}

export function Switch(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className={styles.switch} {...props} />;
}

interface TypeaheadProps<T>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  label?: string;
  options: T[];
  renderOption?: (option: T) => React.ReactNode;
  renderLabel?: (option: T) => string;
  onChange: (option: T) => void;
}

export function Typeahead<T>({
  label = "",
  options,
  renderLabel,
  renderOption,
  onChange,
  ...props
}: TypeaheadProps<T>) {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const getLabel = React.useCallback(
    (option: T) =>
      renderLabel
        ? renderLabel(option)
        : renderOption
        ? (renderOption(option) as string)
        : String(option),
    [renderLabel, renderOption]
  );

  const filtered = React.useMemo(
    () =>
      options.filter((o) =>
        getLabel(o).toLowerCase().includes(inputValue.toLowerCase())
      ),
    [options, inputValue, getLabel]
  );

  const handleSelect = (option: T) => {
    setInputValue(getLabel(option));
    onChange(option);
    setIsOpen(false);
  };

  return (
    <label className={styles.label} style={{ position: "relative" }}>
      {label}
      <input
        {...props}
        value={inputValue}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => setIsOpen(false)}
        className={styles.input}
      />
      {isOpen && filtered.length > 0 && inputValue && (
        <ul className={styles.dropdown}>
          {filtered.map((option, i) => (
            <li
              key={i}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(option);
              }}
              className={styles.option}
            >
              {renderOption ? renderOption(option) : String(option)}
            </li>
          ))}
        </ul>
      )}
    </label>
  );
}
