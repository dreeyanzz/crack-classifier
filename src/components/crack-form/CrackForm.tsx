import { useCrackForm } from '../../hooks/useCrackForm';
import { ImageUpload } from './ImageUpload';
import { ImageNameField } from './ImageNameField';
import { ExifInfo } from './ExifInfo';
import { ClassificationSelect } from './ClassificationSelect';
import { LocationSelect } from './LocationSelect';
import { FormField } from './FormField';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export function CrackForm() {
  const {
    formData,
    imagePreview,
    fileExtension,
    errors,
    isSubmitting,
    isExtracting,
    submitSuccess,
    submitError,
    exifData,
    updateField,
    handleFileSelect,
    handleSubmit,
    setSubmitSuccess,
    setSubmitError,
    updateClassification,
    updateLocation,
  } = useCrackForm();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Submit Crack Record</h2>
          <p className="text-sm text-gray-500">Upload a photo and fill in the details below.</p>
        </div>
      </div>

      {submitSuccess && (
        <Alert
          type="success"
          message="Record submitted successfully!"
          onDismiss={() => setSubmitSuccess(false)}
        />
      )}

      {submitError && (
        <Alert
          type="error"
          message={submitError}
          onDismiss={() => setSubmitError(null)}
        />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Section 1: Photo */}
        <div className="rounded-xl border border-gray-200 bg-white p-3.5 sm:p-5 shadow-sm">
          <div className="mb-3 sm:mb-4 flex items-center gap-2 text-sm font-medium text-gray-700">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            Photo Upload
          </div>
          <ImageUpload
            preview={imagePreview}
            onFileSelect={handleFileSelect}
            isExtracting={isExtracting}
            error={errors.image}
          />
          <ExifInfo exifData={exifData} isExtracting={isExtracting} />
        </div>

        {/* Section 2: Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-3.5 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            Record Details
          </div>

          <ImageNameField
            value={formData.imageName}
            extension={fileExtension}
            onChange={(v) => updateField('imageName', v)}
            error={errors.imageName}
          />

          <FormField label="Label" required error={errors.label} icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
          }>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => updateField('label', e.target.value)}
              placeholder="e.g. Wall crack - Building A"
              className={`w-full rounded-lg border px-3 py-3 text-sm min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.label ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ClassificationSelect
              value={formData.classification}
              onChange={updateClassification}
              error={errors.classification}
            />

            <LocationSelect
              value={formData.location}
              onChange={updateLocation}
              error={errors.location}
            />
          </div>

          <FormField label="Description" required error={errors.description} icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the crack condition, size, and surrounding area..."
              rows={4}
              className={`w-full rounded-lg border px-3 py-3 text-sm min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
          </FormField>

          <FormField label="Date & Time" required error={errors.datetime} icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          }>
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => updateField('datetime', e.target.value)}
              className={`w-full rounded-lg border px-3 py-3 text-sm min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.datetime ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
          </FormField>
        </div>

        {/* Submit */}
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {isSubmitting ? 'Uploading...' : 'Submit Record'}
        </Button>
      </form>
    </div>
  );
}
