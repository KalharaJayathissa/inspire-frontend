// ============================================================================
// TYPES & INTERFACES FOR SUBMISSION COMPONENTS
// ============================================================================

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  timestamp: number;
}

export interface UploadResponse {
  ok: boolean;
  message: string;
}

export interface StudentInfo {
  fullName?: string;
  nicNumber: string;
  mobileNumber: string;
  school: string;
}

export interface SubmissionFormData {
  nic: string;
  selectedSubject: string;
  selectedPart: string;
  file: File | null;
}

// Component Props Interfaces
export interface ToastSystemProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

export interface NicInputProps {
  nic: string;
  isValidatingNic: boolean;
  isNicValid: boolean | null;
  onNicChange: (value: string) => void;
}

export interface SubjectSelectionProps {
  isNicValid: boolean | null;
  selectedSubject: string;
  selectedPart: string;
  onSubjectChange: (subject: string) => void;
  onPartChange: (part: string) => void;
}

export interface FileUploadProps {
  file: File | null;
  isDragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export interface SubmitButtonProps {
  isSubmitDisabled: boolean;
  isUploading: boolean;
  file: File | null;
  isNicValid: boolean | null;
  isValidatingNic: boolean;
}

export interface StudentInfoCardProps {
  studentInfo: StudentInfo | null;
  isFetchingStudent: boolean;
  isNicValid: boolean | null;
}

export interface NicNotFoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTryAgain: () => void;
}

export interface DocumentSubmissionCardProps {
  // No props needed - static content card
}

export interface SubmissionStatusCardProps {
  isNicValid: boolean | null;
  selectedSubject: string;
  selectedPart: string;
  file: File | null;
  isUploading: boolean;
  isValidatingNic: boolean;
}

export interface FormProgressCardProps {
  isNicValid: boolean | null;
  selectedSubject: string;
  selectedPart: string;
  file: File | null;
  isValidatingNic: boolean;
}