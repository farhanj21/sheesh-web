export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface ReviewFormData {
  reviewerName: string
  reviewerEmail: string
  rating: number
  reviewText: string
  images?: string[]
}

/**
 * Validate email format using regex
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize user input by trimming whitespace
 */
export function sanitizeInput(input: string): string {
  return input.trim()
}

/**
 * Validate review form data
 */
export function validateReviewForm(data: ReviewFormData): ValidationResult {
  const errors: Record<string, string> = {}

  // Validate reviewer name
  const name = sanitizeInput(data.reviewerName)
  if (!name || name.length < 2) {
    errors.reviewerName = 'Name must be at least 2 characters'
  } else if (name.length > 50) {
    errors.reviewerName = 'Name must be less than 50 characters'
  }

  // Validate email
  const email = sanitizeInput(data.reviewerEmail)
  if (!email) {
    errors.reviewerEmail = 'Email is required'
  } else if (!isValidEmail(email)) {
    errors.reviewerEmail = 'Please enter a valid email address'
  }

  // Validate rating
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Please select a rating between 1 and 5 stars'
  } else if (!Number.isInteger(data.rating)) {
    errors.rating = 'Rating must be a whole number'
  }

  // Validate review text
  const reviewText = sanitizeInput(data.reviewText)
  if (!reviewText || reviewText.length < 10) {
    errors.reviewText = 'Review must be at least 10 characters'
  } else if (reviewText.length > 1000) {
    errors.reviewText = 'Review must be less than 1000 characters'
  }

  // Validate images (optional)
  if (data.images && data.images.length > 5) {
    errors.images = 'Maximum 5 images allowed per review'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validate admin response
 */
export function validateAdminResponse(text: string): ValidationResult {
  const errors: Record<string, string> = {}

  const sanitized = sanitizeInput(text)
  if (!sanitized || sanitized.length < 5) {
    errors.text = 'Response must be at least 5 characters'
  } else if (sanitized.length > 500) {
    errors.text = 'Response must be less than 500 characters'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
