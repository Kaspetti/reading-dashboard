export default function FieldError({
  name,
  errors,
}: {
  name: string;
  errors?: Record<string, string[]>;
}) {
  if (!errors?.[name]) return null;
  return <p className="text-red-500">{errors[name][0]}</p>;
}
