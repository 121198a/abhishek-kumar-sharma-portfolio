// Focus ring comes from the global :focus-visible rule in index.css.
export default function Field({ id, label, icon: Icon, invalid, hint, trailing, ...input }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-semibold text-body">
        {label}
      </label>
      <div className="relative">
        <Icon
          aria-hidden="true"
          className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${invalid ? 'text-rose-500' : 'text-accent opacity-80'}`}
        />
        <input
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`field-input ${trailing ? 'pr-12' : 'pr-4'} ${invalid ? 'border-rose-500' : 'border-stone-300 dark:border-white/10'}`}
          {...input}
        />
        {trailing}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-rose-700 dark:text-rose-300">
          {hint}
        </p>
      )}
    </div>
  );
}
