import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "fa";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<Language, Record<string, string>>;
  t: (key: string) => string;
}

// Default translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    builder: "Builder",
    responses: "Responses",
    settings: "Settings",
    respond: "Respond",

    // Language Switcher
    switchToFarsi: "Persian",
    switchToEnglish: "English",

    // Common
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    submit: "Submit",

    // Form builder
    formTitle: "Form Title",
    addField: "Add Field",
    preview: "Preview",
    text: "Text",
    textarea: "Paragraph",
    number: "Number",
    select: "Dropdown",
    checkbox: "Checkbox",
    formBuilder: "FormBuilder",

    // Form Builder
    editForm: "Edit Form",
    createForm: "Create Form",
    hidePreview: "Hide Preview",
    showPreview: "Show Preview",
    saveAsNew: "Save as New",
    cancelUpdate: "Cancel Update",
    saving: "Saving...",
    updateForm: "Update Form",
    saveForm: "Save Form",
    description: "Description",
    descriptionOptional: "Description (optional)",
    enterFormTitle: "Enter form title",
    enterFormDescription: "Enter form description",
    addText: "Add Text",
    addQuestion: "Add Question",
    noFieldsAdded: "No fields added yet",
    formPreview: "Form Preview",
    saveAsNewForm: "Save as New Form",
    doSaveAsNew: "Save as New",
    doUpdateForm: "Update",
    doSaveForm: "Save",
    pleaseEnterTitle: "Please enter a title",
    failedToSave: "Failed to save form",
    formSaved: "Form saved successfully!",
    errorSavingForm: "Error saving form",

    // Form Fields
    required: "Required",
    optional: "Optional",
    width: "Width",
    front: "Front",
    below: "Below",
    row: "Row",
    column: "Column",
    fullWidth: "Full Width",
    halfWidth: "Half Width",
    thirdWidth: "Third Width",
    questionType: "Question Type",
    descriptive: "Descriptive",
    multiLine: "Multi Line",
    singleChoice: "Single Choice",
    multipleChoice: "Multiple Choice",
    showInSummary: "Show in Summary",
    options: "Options",
    optionLayout: "Option Layout",
    answerPlacement: "Answer Placement",
    addOption: "+ Add Option",
    enterOptionText: "Option Text",
    enterQuestionText: "Question Text",
    enterAnswer: "Enter Answer",
    confirmDelete: "Are you sure you want to delete this field?",

    // Form Responses
    noResponses: "No responses yet",
    viewResponses: "View Responses",
    responseId: "Response ID",
    submittedAt: "Submitted At",
    noAnswer: "No Answer",
    responseDetails: "Response Details",

    // Form Settings
    noForms: "No forms created yet",
    createNewForm: "Create New Form",
    fields: "Fields",

    // Form Response Page
    submitResponse: "Submit Response",
    responseSubmitted: "Your response has been submitted.",
    respondToForm: "Respond to a Form",
    selectFormAndRespond: "Select a form and share your responses",
    selectForm: "Select a form",
    pleaseFillRequired: "Please fill out the required fields",
    notification: "Notification",

    // New translations
    formSettings: "Form Settings",
    deleteForm: "Delete Form",
    confirmDeleteForm: "Are you sure you want to delete this form?",
    formResponses: "Form Responses",
    viewSummary: "View Summary",
    hideSummary: "Hide Summary",
    responseSummary: "Response Summary",
    totalResponses: "Total Responses",
    latestResponses: "Latest responses",
    viewDetails: "View Details",
    close: "Close",
    noResponsesYet: "No responses yet",
    shareForm: "Share your form to start collecting responses.",
    selectFormToViewResponses: "Choose a form to view its responses.",
    copyForm: "Copy Form",
    createdAt: "Created At",
    fieldsCount: "Fields Count",
    actions: "Actions",
  },
  fa: {
    // Navigation
    builder: "فرم ساز",
    responses: "پاسخ ها",
    settings: "تنظیمات",
    respond: "پاسخ دادن",

    // Language Switcher
    switchToFarsi: "فارسی",
    switchToEnglish: "انگلیسی",

    // Common
    cancel: "لغو",
    confirm: "تایید",
    save: "ذخیره",
    delete: "حذف",
    edit: "ویرایش",
    add: "افزودن",
    submit: "ارسال",

    // Form builder
    formTitle: "عنوان فرم",
    addField: "افزودن فیلد",
    preview: "پیش‌ نمایش",
    text: "متن",
    textarea: "پاراگراف",
    number: "عدد",
    select: "منوی کشویی",
    checkbox: "چک باکس",
    formBuilder: "فرم ساز",

    // Form Builder
    editForm: "ویرایش فرم",
    createForm: "ایجاد فرم",
    hidePreview: "مخفی کردن پیش‌ نمایش",
    showPreview: "نمایش پیش‌ نمایش",
    saveAsNew: "ذخیره به عنوان جدید",
    cancelUpdate: "لغو بروزرسانی",
    saving: "در حال ذخیره...",
    updateForm: "بروزرسانی فرم",
    saveForm: "ذخیره فرم",
    description: "توضیحات",
    descriptionOptional: "توضیحات (اختیاری)",
    enterFormTitle: "عنوان فرم را وارد کنید",
    enterFormDescription: "توضیحات فرم را وارد کنید",
    addText: "افزودن متن",
    addQuestion: "افزودن سوال",
    noFieldsAdded: "هنوز فیلدی اضافه نشده است",
    formPreview: "پیش‌نمایش فرم",
    saveAsNewForm: "ذخیره به عنوان فرم جدید",
    doSaveAsNew: "ذخیره به عنوان جدید",
    doUpdateForm: "به‌روزرسانی",
    doSaveForm: "ذخیره",
    pleaseEnterTitle: "لطفا یک عنوان وارد کنید",
    failedToSave: "خطا در ذخیره فرم",
    formSaved: "فرم با موفقیت ذخیره شد!",
    errorSavingForm: "خطا در ذخیره فرم",

    // Form Fields
    required: "اجباری",
    optional: "اختیاری",
    width: "عرض",
    front: "جلوی سوال",
    below: "پایین سوال",
    row: "سطری",
    column: "ستونی",
    fullWidth: "تمام عرض",
    halfWidth: "نیم عرض",
    thirdWidth: "یک سوم عرض",
    questionType: "نوع سوال",
    descriptive: "تشریحی",
    multiLine: "چند خطی",
    singleChoice: "تک انتخابی",
    multipleChoice: "چند انتخابی",
    showInSummary: "نمایش در خلاصه",
    options: "گزینه‌ها",
    optionLayout: "نحوه نمایش گزینه‌ها",
    answerPlacement: "نحوه نمایش پاسخ",
    addOption: "+ افزودن گزینه",
    enterOptionText: "متن گزینه",
    enterQuestionText: "متن سوال",
    enterAnswer: "پاسخ",
    confirmDelete: "آیا مطمئن هستید که می‌خواهید این فیلد را حذف کنید؟",

    // Form Responses
    noResponses: "هنوز پاسخی وجود ندارد",
    viewResponses: "مشاهده پاسخ‌ها",
    responseId: "آیدی پاسخ",
    submittedAt: "تاریخ ثبت",
    noAnswer: "پاسخی وجود ندارد",
    responseDetails: "جزئیات پاسخ",

    // Form Settings
    noForms: "هنوز فرمی ایجاد نشده است",
    createNewForm: "ایجاد فرم جدید",
    fields: "فیلد",

    // Form Response Page
    submitResponse: "ارسال پاسخ",
    responseSubmitted: "پاسخ شما ثبت شد.",
    respondToForm: "پاسخ به یک فرم",
    selectFormAndRespond: "یک فرم را انتخاب کنید و پاسخ خود را به اشتراک بگذارید",
    selectForm: "یک فرم انتخاب کنید",
    pleaseFillRequired: "لطفا فیلدهای ضروری را پر کنید",
    notification: "اطلاعیه",

    // New translations
    formSettings: "تنظیمات فرم",
    deleteForm: "حذف فرم",
    confirmDeleteForm: "آیا مطمئن هستید که می‌خواهید این فرم را حذف کنید؟",
    formResponses: "پاسخ‌های فرم",
    viewSummary: "مشاهده خلاصه",
    hideSummary: "مخفی کردن خلاصه",
    responseSummary: "خلاصه پاسخ‌ها",
    totalResponses: "کل پاسخ‌ها",
    latestResponses: "آخرین پاسخ‌ها",
    viewDetails: "مشاهده جزئیات",
    close: "بستن",
    noResponsesYet: "هنوز پاسخی وجود ندارد",
    shareForm: "فرم خود را به اشتراک بگذارید تا پاسخ‌ها را جمع‌آوری کنید.",
    selectFormToViewResponses: "یک فرم را انتخاب کنید تا پاسخ‌های آن را مشاهده کنید.",
    copyForm: "کپی از فرم",
    createdAt: "تاریخ ایجاد",
    fieldsCount: "تعداد فیلدها",
    actions: "عملیات",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    return savedLanguage === "en" || savedLanguage === "fa"
      ? savedLanguage
      : "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);

    // Set document direction based on language
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";

    // Add appropriate font class to body
    if (language === "fa") {
      document.body.classList.add("font-shabnam");
      document.body.classList.remove("font-sans");
    } else {
      document.body.classList.add("font-sans");
      document.body.classList.remove("font-shabnam");
    }
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, translations, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
