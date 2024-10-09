export const isOptionEqualToValue = (
  option: { value: string; label: string },
  value: { value: string; label: string }
) => option.value === value.value;
