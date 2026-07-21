export function sanitizeHtml(str) {
    if (!str) return '';
    // Strip HTML tags entirely
    return str.replace(/<[^>]*>?/gm, '');
}

export function validateString(str, minLen, maxLen, fieldName) {
    if (typeof str !== 'string') {
        return `${fieldName} must be a string`;
    }
    
    const trimmed = str.trim();
    if (trimmed.length < minLen) {
        return `${fieldName} must be at least ${minLen} characters`;
    }
    
    if (trimmed.length > maxLen) {
        return `${fieldName} must be at most ${maxLen} characters`;
    }
    
    return null;
}

export function validateContactForm(data) {
    const errors = [];
    
    const nameError = validateString(data.name, 2, 100, 'Name');
    if (nameError) errors.push(nameError);
    
    const subjectError = validateString(data.subject, 5, 200, 'Subject');
    if (subjectError) errors.push(subjectError);
    
    const messageError = validateString(data.message, 10, 5000, 'Message');
    if (messageError) errors.push(messageError);
    
    if (!data.email || typeof data.email !== 'string') {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Invalid email format');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateLoginForm(data) {
    const errors = [];
    
    if (!data.email || typeof data.email !== 'string') {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Invalid email format');
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateCourseEnrollment(data) {
    const errors = [];
    
    if (!data.courseId) {
        errors.push('Course ID is required');
    }
    
    if (!data.userId) {
        errors.push('User ID is required');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}
