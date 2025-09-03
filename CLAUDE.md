# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based medical report generation system for Hospital Central's gastroenterology department. The application allows medical professionals to create, customize, and export endoscopy reports as PDFs using html2pdf.js.

## Commands

### Development
- `npm run dev` - Start development server with Vite
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

### Deployment
- `npm run predeploy` - Builds the project before deployment
- `npm run deploy` - Deploy to GitHub Pages using gh-pages

## Architecture

### Core Structure
- **Single Page Application**: Built with React 19 and Vite
- **Component-Based**: Main functionality in `MedicalReportForm.jsx`
- **PDF Generation**: Uses html2pdf.js for client-side PDF export
- **Styling**: Bootstrap 5 + custom CSS in `src/styles/report.css`

### Key Components
- `App.jsx` - Main app container with hospital branding and layout
- `MedicalReportForm.jsx` - Core medical report form component with:
  - Doctor selection with predefined list and signatures
  - Patient information fields
  - Endoscopy procedure details
  - Dynamic content sections
  - PDF export functionality

### Medical Data
The application includes a hardcoded `MEDICOS` array with doctor information including:
- Names and medical license numbers (matricula)
- Digital signature images located in `public/images/rubricas/`

### Deployment Configuration
- **GitHub Pages**: Configured for deployment to `ArielOCarvajal.github.io/endoscopia_gastro`
- **Base Path**: Set to `/endoscopia_gastro/` in vite.config.js
- **CI/CD**: GitHub Actions workflow for Node.js testing on multiple versions

### Asset Management
- Hospital logo: `Logo_HC.png` in root and public directories
- Doctor signatures: `public/images/rubricas/[DoctorName].png`
- Assets referenced using `import.meta.env.BASE_URL` for proper deployment paths

## Development Notes

### Adding New Doctors
To add new medical professionals, update the `MEDICOS` array in `MedicalReportForm.jsx` and add their signature image to `public/images/rubricas/`.

### PDF Styling
Print-specific styles are defined in `report.css` with `@media print` queries. Elements with `.d-print-none` class are hidden in PDF exports.

### Form State Management
The form uses React useState hooks for managing form data, with automatic PDF generation capabilities.