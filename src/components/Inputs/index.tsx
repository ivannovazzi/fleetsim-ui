import React, { useEffect } from "react";
import styles from "./Inputs.module.css";
import classNames from "classnames";

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={styles.button} {...props} />;
}

interface SquaredButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

export function SquaredButton({ icon, ...props }: SquaredButtonProps) {
  return (
    <button type="button" {...props} className={classNames([styles.squaredButton, props.className])}>
      <div className={styles.squaredButtonIcon}>
        {icon}
      </div>
    </button>
  );
}

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
  value?: T;
  options: T[];
  renderOption?: (option: T) => React.ReactNode;
  renderLabel?: (option: T) => string;
  onChange: (option: T) => void;
  onOptionHover?: (option: T | null) => void;
}

export function Typeahead<T>({
  label = "",
  options,
  renderLabel,
  renderOption,
  value,
  onChange,
  onOptionHover = () => {},
  ...props
}: TypeaheadProps<T>) {
  const getLabel = React.useCallback(
    (option: T) =>
      renderLabel
        ? renderLabel(option)
        : renderOption
        ? (renderOption(option) as string)
        : String(option),
    [renderLabel, renderOption]
  );
  const [inputValue, setInputValue] = React.useState(value ? getLabel(value) : "");
  const [isOpen, setIsOpen] = React.useState(false);
  
  useEffect(() => {
    if (!value)
      setInputValue("");
  }, [value]);

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
        className={classNames([styles.input, props.className])}
      />
      {isOpen && filtered.length > 0 && (
        <ul className={styles.dropdown}>
          {filtered.map((option, i) => (
            <li
              key={i}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(option);
              }}
              onMouseEnter={() => onOptionHover(option)}
              onMouseLeave={() => onOptionHover(null)}
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
