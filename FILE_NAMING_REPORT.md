# PDF File Naming Convention Report

## For Backend Developer - Document Submission System

### Overview

This document outlines the standardized file naming convention used for PDF document submissions in the KESS (Knowledge Education Support System) platform. The frontend generates structured filenames that the backend should expect and process accordingly.

---

## File Naming Pattern

### Format Structure

```
{nic}_{subject}_{part}_{timestamp}.pdf
```

### Pattern Components

- **NIC**: Student's National Identity Card number (as entered by user)
- **Subject**: Subject name (lowercase, spaces removed)
- **Part**: Paper part identifier (lowercase, spaces removed)
- **Timestamp**: ISO date in YYYY-MM-DD format
- **Extension**: Always `.pdf`

---

## Subject and Part Mapping

### 1. Physics

**Subject Code**: `physics`

**Parts Available**:

- **Part I** → `parti` (Theory/MCQ section)
- **Part II** → `partii` (Essay/Structured questions)

**Example Filenames**:

```
200123456789_physics_parti_2024-01-15.pdf
200123456789_physics_partii_2024-01-15.pdf
```

### 2. Chemistry

**Subject Code**: `chemistry`

**Parts Available**:

- **Part I** → `parti` (Theory/MCQ section)
- **Part II** → `partii` (Essay/Structured questions)

**Example Filenames**:

```
200123456789_chemistry_parti_2024-01-15.pdf
200123456789_chemistry_partii_2024-01-15.pdf
```

### 3. Mathematics

**Subject Code**: `mathematics`

**Parts Available**:

- **Part I** → `parti` (Pure Mathematics)
- **Part II** → `partii` (Applied Mathematics)

**Example Filenames**:

```
200123456789_mathematics_parti_2024-01-15.pdf
200123456789_mathematics_partii_2024-01-15.pdf
```

---

## Complete File Name Examples

### Sample Student: NIC `200123456789`, Submission Date: `2024-01-15`

| Subject     | Part    | Generated Filename                               |
| ----------- | ------- | ------------------------------------------------ |
| Physics     | Part I  | `200123456789_physics_parti_2024-01-15.pdf`      |
| Physics     | Part II | `200123456789_physics_partii_2024-01-15.pdf`     |
| Chemistry   | Part I  | `200123456789_chemistry_parti_2024-01-15.pdf`    |
| Chemistry   | Part II | `200123456789_chemistry_partii_2024-01-15.pdf`   |
| Mathematics | Part I  | `200123456789_mathematics_parti_2024-01-15.pdf`  |
| Mathematics | Part II | `200123456789_mathematics_partii_2024-01-15.pdf` |

---

## Frontend Implementation Details

### API Endpoint

```
POST /api/submissions/upload
```

### FormData Structure Sent to Backend

```javascript
{
  file: File, // Renamed PDF file with standardized name
  nic: string, // Student NIC number
  subject: string, // "Physics" | "Chemistry" | "Mathematics"
  part: string, // "Part I" | "Part II"
  studentName: string, // Optional
  mobileNumber: string, // Optional
  school: string, // Optional
  originalFileName: string, // Original file name before renaming
  generatedFileName: string // The standardized filename
}
```

### File Renaming Logic

```javascript
// Generate standardized filename
const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
const subjectCode = subject.replace(/\s+/g, "").toLowerCase(); // "Mathematics" → "mathematics"
const partCode = part.replace(/\s+/g, "").toLowerCase(); // "Part I" → "parti"
const newFileName = `${nic}_${subjectCode}_${partCode}_${timestamp}.pdf`;
```

---

## Backend Implementation Requirements

### 1. File Storage Structure

Recommended directory structure:

```
uploads/
├── 2024-01-15/
│   ├── physics/
│   │   ├── parti/
│   │   │   └── 200123456789_physics_parti_2024-01-15.pdf
│   │   └── partii/
│   │       └── 200123456789_physics_partii_2024-01-15.pdf
│   ├── chemistry/
│   │   ├── parti/
│   │   └── partii/
│   └── mathematics/
│       ├── parti/
│       └── partii/
```

### 2. Multer Configuration Example

```javascript
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { subject, part } = req.body;
    const date = new Date().toISOString().split("T")[0];
    const subjectCode = subject.replace(/\s+/g, "").toLowerCase();
    const partCode = part.replace(/\s+/g, "").toLowerCase();

    const uploadPath = `uploads/${date}/${subjectCode}/${partCode}`;

    // Create directory if it doesn't exist
    require("fs").mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // File already has the correct name from frontend
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
```

### 3. Database Schema Recommendation

```sql
CREATE TABLE submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nic VARCHAR(12) NOT NULL,
  student_name VARCHAR(255),
  mobile_number VARCHAR(15),
  school VARCHAR(255),
  subject ENUM('Physics', 'Chemistry', 'Mathematics') NOT NULL,
  part ENUM('Part I', 'Part II') NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  generated_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT,
  upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submission_date DATE NOT NULL,
  INDEX idx_nic (nic),
  INDEX idx_subject_part (subject, part),
  INDEX idx_submission_date (submission_date)
);
```

### 4. API Response Format

```javascript
// Success Response
{
  "success": true,
  "message": "Document submitted successfully",
  "data": {
    "submissionId": "12345",
    "nic": "200123456789",
    "subject": "Physics",
    "part": "Part I",
    "generatedFileName": "200123456789_physics_parti_2024-01-15.pdf",
    "filePath": "uploads/2024-01-15/physics/parti/200123456789_physics_parti_2024-01-15.pdf",
    "uploadTime": "2024-01-15T10:30:00.000Z"
  }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "Specific error details"
  }
}
```

---

## File Validation Requirements

### 1. File Type Validation

- Accept only PDF files
- Validate MIME type: `application/pdf`
- Check file extension: `.pdf`

### 2. File Size Limits

- Recommended maximum: 10MB per file
- Consider implementing compression if needed

### 3. Filename Validation

- Verify filename follows the pattern: `{nic}_{subject}_{part}_{date}.pdf`
- Validate NIC format (12 digits)
- Validate subject and part values

### 4. Duplicate Prevention

- Check if file with same NIC, subject, and part already exists for the day
- Implement appropriate handling (replace, reject, or version)

---

## Security Considerations

1. **File Sanitization**: Scan uploaded PDFs for malicious content
2. **Path Traversal Prevention**: Validate all file paths
3. **Access Control**: Implement proper authentication and authorization
4. **Virus Scanning**: Integrate with antivirus scanning if possible
5. **Storage Security**: Secure file storage with appropriate permissions

---

## Error Handling

### Common Error Scenarios

1. **Invalid file type**: Return 400 with clear message
2. **File too large**: Return 413 with size limit information
3. **Duplicate submission**: Return 409 with conflict details
4. **Storage failure**: Return 500 with retry suggestion
5. **Invalid form data**: Return 400 with validation errors

---

## Testing Checklist

- [ ] File upload with all subject/part combinations
- [ ] Duplicate file handling
- [ ] File size limit enforcement
- [ ] Invalid file type rejection
- [ ] Malformed filename handling
- [ ] Storage directory creation
- [ ] Database record creation
- [ ] Error response formatting
- [ ] Success response formatting

---

## Contact Information

For any questions regarding this file naming convention or implementation details, please contact the frontend development team.

**Last Updated**: January 2024  
**Version**: 1.0
