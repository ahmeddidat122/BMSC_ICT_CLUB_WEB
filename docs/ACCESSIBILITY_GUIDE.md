# Accessibility Testing Guide (WCAG 2.2 AA)

This guide outlines the accessibility requirements for the BMSC ICT Club website and how to verify them.

## WCAG 2.2 AA Checklist

- [ ] **1.1.1 Non-text Content:** All images have appropriate `alt` attributes.
- [ ] **1.3.1 Info and Relationships:** Proper semantic HTML (headings, lists, forms).
- [ ] **1.4.3 Contrast (Minimum):** Text has a contrast ratio of at least 4.5:1.
- [ ] **1.4.11 Non-text Contrast:** UI components have a contrast ratio of at least 3:1.
- [ ] **2.1.1 Keyboard:** All functionality is operable via keyboard.
- [ ] **2.1.2 No Keyboard Trap:** Keyboard focus can be moved into and out of components.
- [ ] **2.4.1 Skip Blocks:** A "Skip to main content" link is provided.
- [ ] **2.4.3 Focus Order:** Focus order makes sense and follows the DOM.
- [ ] **2.4.7 Focus Visible:** Focus ring is highly visible.
- [ ] **2.4.11 Focus Not Obscured (Minimum) (2.2):** Focused items are not entirely hidden by other content.
- [ ] **2.5.8 Target Size (Minimum) (2.2):** Interactive elements are at least 24x24 CSS pixels.
- [ ] **3.3.1 Error Identification:** Errors are clearly identified in text.
- [ ] **3.3.2 Labels or Instructions:** Inputs have accessible labels.
- [ ] **4.1.2 Name, Role, Value:** Custom components use proper ARIA roles and attributes.
- [ ] **4.1.3 Status Messages:** Screen readers announce dynamic updates (using ARIA live regions).

## Testing Methodologies

### 1. axe DevTools (Automated)
1. Install the axe DevTools browser extension.
2. Open Chrome Developer Tools, go to the "axe DevTools" tab.
3. Click "Scan ALL of my page".
4. Review and fix all reported issues. Note that automated tools only catch ~30% of accessibility issues.

### 2. Keyboard Only (Manual)
1. Unplug or ignore your mouse.
2. Use `Tab` to move forward, `Shift + Tab` to move backward.
3. Use `Enter` or `Space` to activate buttons and links.
4. Use arrow keys for custom widgets (tabs, radio groups, sliders).
5. Verify:
   - You can reach all interactive elements.
   - The focus ring is clearly visible at all times.
   - You never get trapped in a component.
   - The skip link appears on the first tab.

### 3. Screen Reader Testing
#### NVDA (Windows)
- Turn on NVDA (`Ctrl + Alt + N` or via shortcut).
- Use `Caps Lock + Up/Down` to read lines.
- Use `H` to jump through headings, `F` for form fields, `K` for links.
- Verify that dynamic toast messages are announced.

#### VoiceOver (macOS)
- Turn on VoiceOver (`Cmd + F5`).
- Use `VO (Control + Option) + Right/Left Arrow` to navigate.
- Use the Rotor (`VO + U`) to navigate by headings, links, or landmarks.
- Ensure forms are announced with their associated labels and error messages.

### 4. Color Contrast Verification
The site uses the following primary palette. Ensure these combinations are respected:
- Text (`#111827`, `#374151`, `#4b5563`) on White (`#ffffff`): Pass (4.5:1+)
- White Text (`#ffffff`) on Primary Blue (`#2563eb`): Pass (5.1:1)
- Danger Red (`#dc2626`) on White (`#ffffff`): Pass (5.2:1)
