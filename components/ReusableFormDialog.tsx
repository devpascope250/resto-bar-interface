// components/ReusableFormDialog.tsx
import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";

// Import the provided UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ReactSelect from "react-select";
import {
Select as UiSelect,
SelectTrigger,
SelectValue,
SelectContent,
SelectItem,} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

// --- Type Definitions ---
type FormSize = "sm" | "md" | "lg" | "xl" | "xxl" | "full";

// Define the shape of an option for select and radio fields
interface Option {
  value: string;
  label: string;
}

// Define the shape of a single form field with expanded types
interface Field {
  name: string;
  label: string;
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "checkbox"
    | "select"
    | "radio"
    | "textarea"
    | "file"
    | "react-select"
    | "date"
    | "datetime";
  required?: boolean;
  colSpan?: 1 | 2;
  options?: Option[];
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  multiple?: boolean;
  onChange?: (value: any, formik: any) => void;
  isSearchable?: boolean;
  isMulti?: boolean;
  isClearable?: boolean;
  placeholder?: string;
  explanation?: string;
}

// Define the props for the ReusableFormDialog component
interface ReusableFormDialogProps<T extends object> {
  innerRef?: React.Ref<{ resetForm: () => void }>;
  fields: Field[];
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  layout?: "grid-2" | "vertical";
  gridGap?: string;
  size?: FormSize;
  className?: string;
  submitButtonText?: string;
  formTitle?: string;
  triggerButton?: React.ReactNode;
  dialogDescription?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  customFooter?: React.ReactNode;
}

// Helper component for rendering individual form fields with labels and error messages
interface FormFieldWrapperProps {
  name: string;
  label: string;
  colSpan?: 1 | 2;
  required?: boolean;
  layout?: "grid-2" | "vertical";
  error: string | false | undefined;
  children: React.ReactNode;
  type?: Field["type"];
  explanation?: string;
}

const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  name,
  label,
  colSpan,
  required,
  layout,
  error,
  children,
  type,
  explanation,
}) => {
  const fieldId = `field-${name}`;
  const [showExplanation, setShowExplanation] = React.useState(false);

  return (
    <div
      className={`relative ${
        layout !== "vertical" && colSpan === 2 ? "md:col-span-2" : ""
      }`}
    >
      {type !== "checkbox" && type !== "radio" && type !== "file" && (
        <div className="flex items-center mb-1.5">
          <Label htmlFor={fieldId} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          {explanation && (
            <div className="relative ml-1">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
                onMouseEnter={() => setShowExplanation(true)}
                onMouseLeave={() => setShowExplanation(false)}
                onClick={() => setShowExplanation(!showExplanation)}
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {showExplanation && (
                <div className="absolute z-10 w-64 p-2 mt-1 text-xs text-muted-foreground bg-popover border border-border rounded-md shadow-lg">
                  {explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-destructive flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {String(error)}
        </p>
      )}
    </div>
  );
};

// eslint-disable-next-line react/display-name
export const ReusableFormDialog = React.forwardRef(
  <T extends object>(
    props: ReusableFormDialogProps<T>,
    ref: React.Ref<{ resetForm: () => void }>
  ) => {
    const {
      fields,
      initialValues,
      onSubmit,
      layout = "grid-2",
      gridGap = "gap-4",
      size = "xl",
      className,
      submitButtonText = "Submit",
      formTitle,
      triggerButton,
      dialogDescription,
      open,
      onOpenChange,
      customFooter,
    } = props;

    const [internalOpen, setInternalOpen] = React.useState(false);
    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : internalOpen;
    const setCurrentOpen = isControlled ? onOpenChange : setInternalOpen;

    // Map FormSize to Tailwind max-width classes for dialog
    const sizeClasses: Record<FormSize, string> = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      xxl: "max-w-2xl",
      full: "max-w-[95vw]",
    };

    const validationSchema = Yup.object().shape(
      fields.reduce((schema, field) => {
        let validator: Yup.AnySchema = Yup.mixed().nullable();

        // Set up type-specific validators
        if (
          field.type === "text" ||
          field.type === "password" ||
          field.type === "textarea" ||
          field.type === "select" ||
          field.type === "react-select"
        ) {
          validator = Yup.string().nullable();
        } else if (field.type === "email") {
          validator = Yup.string().email("Invalid email address").nullable();
        } else if (field.type === "date") {
          validator = Yup.date().typeError("Must be a valid date").nullable();
          if (field.min) {
            validator = (validator as Yup.DateSchema<Date | null>).min(
              new Date(field.min),
              `Date must be after ${new Date(field.min).toLocaleDateString()}`
            );
          }
          if (field.max) {
            validator = (validator as Yup.DateSchema<Date | null>).max(
              new Date(field.max),
              `Date must be before ${new Date(field.max).toLocaleDateString()}`
            );
          }
        } else if (field.type === "datetime") {
          validator = Yup.date()
            .typeError("Must be a valid date and time")
            .nullable();

          if (field.min) {
            validator = (validator as Yup.DateSchema<Date | null>).min(
              new Date(field.min),
              `Date must be on or after ${new Date(field.min).toLocaleString()}`
            );
          }

          if (field.max) {
            validator = (validator as Yup.DateSchema<Date | null>).max(
              new Date(field.max),
              `Date must be on or before ${new Date(
                field.max
              ).toLocaleString()}`
            );
          }
        } else if (field.type === "number") {
          validator = Yup.number().typeError("Must be a number").nullable();
          if (field.min !== undefined)
            validator = (validator as Yup.NumberSchema).min(
              field.min,
              `Must be at least ${field.min}`
            );
          if (field.max !== undefined)
            validator = (validator as Yup.NumberSchema).max(
              field.max,
              `Must be at most ${field.max}`
            );
        } else if (field.type === "checkbox") {
          validator = Yup.boolean();
        } else if (field.type === "radio") {
          validator = Yup.string().nullable();
        } else if (field.type === "file") {
          validator = Yup.mixed().nullable();
          if (field.required) {
            validator = validator.test(
              "has-files",
              `${field.label} is required`,
              (value: any) => {
                if (value === null || value === undefined) return false;
                if (value instanceof FileList) return value.length > 0;
                return true;
              }
            );
          }
        }

        // Handle required fields
        if (
          field.required &&
          field.type !== "checkbox" &&
          field.type !== "file"
        ) {
          validator = validator.required(`${field.label} is required`);
        } else if (field.required && field.type === "checkbox") {
          validator = validator.oneOf([true], `${field.label} must be checked`);
        }

        // Transform empty strings to null for nullable fields
        if (
          !field.required &&
          (field.type === "text" ||
            field.type === "email" ||
            field.type === "password" ||
            field.type === "textarea" ||
            field.type === "select")
        ) {
          validator = validator.transform((value, originalValue) =>
            originalValue === "" ? null : value
          );
        }

        return {
          ...schema,
          [field.name]: validator,
        };
      }, {} as { [key: string]: Yup.AnySchema })
    );

    const formik = useFormik<T>({
      initialValues,
      validationSchema,
      onSubmit: async (values, formikHelpers) => {
        try {
          await onSubmit(values);
          formikHelpers.resetForm();
          setCurrentOpen?.(false);
        } catch (error) {
          formikHelpers.setSubmitting(false);
        }
      },
      enableReinitialize: true,
    });

    React.useImperativeHandle(ref, () => ({
      resetForm: () => {
        formik.resetForm();
      },
    }));

    // Reset form when dialog closes
    React.useEffect(() => {
      if (!currentOpen) {
        formik.resetForm();
      }
    }, [currentOpen]);

    const defaultTrigger = (
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add New
      </Button>
    );

    return (
      <Dialog open={currentOpen} onOpenChange={setCurrentOpen}>
        <DialogTrigger asChild>
          {triggerButton || defaultTrigger}
        </DialogTrigger>
        <DialogContent className={`${sizeClasses[size]} ${className}`}>
          <DialogHeader>
            <DialogTitle>{formTitle || "Form"}</DialogTitle>
            {dialogDescription && (
              <DialogDescription>{dialogDescription}</DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} autoComplete="off">
            <div className={`grid ${
              layout === "grid-2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            } ${gridGap} py-4 `}>
              {fields.map((field) => {
                const {
                  name,
                  label,
                  type = "text",
                  colSpan,
                  required,
                  options,
                  min,
                  max,
                  step,
                  accept,
                  multiple,
                } = field;
                const rawError =
                  formik.touched[name as keyof T] && formik.errors[name as keyof T];
                const error =
                  typeof rawError === "string"
                    ? rawError
                    : Array.isArray(rawError)
                    ? rawError.join(", ")
                    : undefined;
                const fieldId = `field-${name}`;

                return (
                  <FormFieldWrapper
                    key={name}
                    name={name}
                    label={label}
                    colSpan={colSpan}
                    required={required}
                    layout={layout}
                    error={error}
                    type={type}
                    explanation={field.explanation}
                  >
                    {type === "select" ? (
                      <UiSelect
                        value={String(formik.values[name as keyof T] ?? "")}
                        onValueChange={(value: string) => {
                         formik.setFieldValue(name, value === "" ? null : value);
                         field.onChange?.(value === "" ? null : value, formik);                        }}
                        onOpenChange={(open) => {
                          if (!open) formik.setFieldTouched(name, true);
                        }}
                      >
                        <SelectTrigger
                          id={fieldId}
                          className="h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                        >
                          <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </UiSelect>
                    ) : type === "date" ? (
                      <Input
                        id={fieldId}
                        name={name}
                        type="date"
                        onChange={(e) => {
                          formik.handleChange(e);
                          field.onChange?.(e.target.value, formik);
                        }}
                        onBlur={formik.handleBlur}
                        value={(formik.values[name as keyof T] as string) || ""}
                        min={min}
                        max={max}
                      />
                    ) : type === "datetime" ? (
                      <Input
                        id={fieldId}
                        name={name}
                        type="datetime-local"
                        onChange={(e) => {
                          formik.handleChange(e);
                          const value = e.target.value
                            ? new Date(e.target.value).toISOString()
                            : "";
                          field.onChange?.(value, formik);
                        }}
                        onBlur={formik.handleBlur}
                        value={
                          formik.values[name as keyof T]
                            ? new Date(formik.values[name as keyof T] as string)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        min={
                          min ? new Date(min).toISOString().slice(0, 16) : undefined
                        }
                        max={
                          max ? new Date(max).toISOString().slice(0, 16) : undefined
                        }
                      />
                    ) : type === "textarea" ? (
                      <Textarea
                        id={fieldId}
                        name={name}
                        onChange={(e) => {
                          formik.handleChange(e);
                          field.onChange?.(e.target.value, formik);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values[name as keyof T] as string}
                        className="min-h-[80px]"
                      />
                    ) : type === "checkbox" ? (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={fieldId}
                          name={name}
                          checked={formik.values[name as keyof T] as boolean}
                          onCheckedChange={(checked) => {
                            formik.setFieldValue(name, checked);
                            field.onChange?.(checked, formik);
                          }}
                        />
                        <Label
                          htmlFor={fieldId}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {label}
                          {required && (
                            <span className="text-destructive ml-0.5">*</span>
                          )}
                        </Label>
                      </div>
                    ) : type === "radio" ? (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          {label}
                          {required && (
                            <span className="text-destructive ml-0.5">*</span>
                          )}
                        </p>
                        {options?.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <input
                              id={`${fieldId}-${option.value}`}
                              name={name}
                              type="radio"
                              onChange={(e) => {
                                formik.handleChange(e);
                                field.onChange?.(e.target.checked, formik);
                              }}
                              onBlur={formik.handleBlur}
                              value={option.value}
                              checked={
                                formik.values[name as keyof T] === option.value
                              }
                              className="h-4 w-4 text-primary border-border focus:ring-primary"
                            />
                            <Label
                              htmlFor={`${fieldId}-${option.value}`}
                              className="text-sm font-normal"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : type === "react-select" ? (
                      <Select
                        id={fieldId}
                        name={name}
                        options={options}
                        isSearchable={field.isSearchable}
                        isMulti={field.isMulti}
                        isClearable={field.isClearable}
                        placeholder={field.placeholder || `Select ${label}`}
                        value={options?.find(
                          (option) =>
                            option.value === formik.values[name as keyof T]
                        )}
                        onChange={(selectedOption) => {
                          const value = field.isMulti
                            ? (selectedOption as Option[]).map((opt) => opt.value)
                            : (selectedOption as Option)?.value;
                          formik.setFieldValue(name, value);
                          field.onChange?.(value, formik);
                        }}
                        onBlur={() => formik.setFieldTouched(name, true)}
                        classNamePrefix="react-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: error
                              ? "hsl(var(--destructive))"
                              : "hsl(var(--input))",
                            minHeight: "36px",
                            fontSize: "14px",
                            "&:hover": {
                              borderColor: error
                                ? "hsl(var(--destructive))"
                                : "hsl(var(--input))",
                            },
                          }),
                        }}
                      />
                    ) : type === "file" ? (
                      <div>
                        <Label
                          htmlFor={fieldId}
                          className="text-sm font-medium mb-1.5 block"
                        >
                          {label}
                          {required && (
                            <span className="text-destructive ml-0.5">*</span>
                          )}
                        </Label>
                        <Input
                          id={fieldId}
                          name={name}
                          type="file"
                          onChange={(event) => {
                            formik.setFieldValue(
                              name,
                              multiple
                                ? event.currentTarget.files
                                : event.currentTarget.files?.[0]
                            );
                            field.onChange?.(event.currentTarget.files, formik);
                          }}
                          onBlur={formik.handleBlur}
                          accept={accept}
                          multiple={multiple}
                          className="cursor-pointer"
                        />
                        {formik.values[name as keyof T] && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Selected:{" "}
                            {multiple &&
                            formik.values[name as keyof T] instanceof FileList
                              ? Array.from(
                                  formik.values[name as keyof T] as FileList
                                )
                                  .map((file) => file.name)
                                  .join(", ")
                              : (formik.values[name as keyof T] as File)?.name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <Input
                        id={fieldId}
                        name={name}
                        type={type}
                        onChange={(e) => {
                          formik.handleChange(e);
                          field.onChange?.(e.target.value, formik);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values[name as keyof T] as string | number}
                        min={min}
                        max={max}
                        step={step}
                      />
                    )}
                  </FormFieldWrapper>
                );
              })}
            </div>

            <DialogFooter>
              {customFooter || (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentOpen?.(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="cursor-pointer"
                  >
                    {formik.isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        Processing...
                      </span>
                    ) : (
                      submitButtonText
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
) as <T extends object>(
  props: ReusableFormDialogProps<T> & { ref?: React.Ref<{ resetForm: () => void }> }
) => React.ReactElement;


// <ReusableFormDialog
//   fields={[
//     { name: "name", label: "Product Name", type: "text", required: true },
//     { name: "price", label: "Price", type: "number", required: true },
//     { name: "category", label: "Category", type: "select", options: [
//       { value: "electronics", label: "Electronics" },
//       { value: "clothing", label: "Clothing" }
//     ]}
//   ]}
//   initialValues={{ name: "", price: 0, category: "" }}
//   onSubmit={async (values) => {
//     console.log("Form submitted:", values);
//     // Your API call here
//   }}
//   formTitle="Add New Product"
//   dialogDescription="Create a new product in the catalog."
//   submitButtonText="Create Product"
// />