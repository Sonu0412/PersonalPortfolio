# Portfolio Website - Replit.md

## Overview

This is a personal portfolio website for Sonu C., a Software Engineer. The project is a static website built with vanilla HTML, CSS, and JavaScript, featuring a modern, responsive design with dark/light theme support, interactive particles animation, and a contact form with email integration.

## System Architecture

### Frontend Architecture
- **Static Website**: Built using vanilla HTML5, CSS3, and JavaScript (ES6+)
- **Single Page Application (SPA)**: Navigation uses smooth scrolling between sections rather than page loads
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Theme System**: Dynamic light/dark mode switching with localStorage persistence
- **Loading Screen**: Custom loading animation for enhanced user experience

### Styling Architecture
- **CSS Custom Properties**: Extensive use of CSS variables for theme management
- **Component-Based CSS**: Modular styling approach with clear separation of concerns
- **Typography**: Google Fonts (Poppins) integration for consistent typography
- **Icons**: Font Awesome integration for scalable vector icons

### Interactive Features
- **Particle System**: Advanced canvas-based particle animation with mouse interaction
- **Theme Toggle**: Persistent theme switching between light and dark modes
- **Navigation**: Smooth scrolling navigation with hamburger menu for mobile
- **Contact Form**: EmailJS integration for client-side email functionality

## Key Components

### 1. Navigation System
- Responsive navbar with logo and navigation links
- Mobile hamburger menu implementation
- Theme toggle button with icon switching
- Smooth scrolling to page sections

### 2. Theme Management
- CSS custom properties for color scheme management
- JavaScript theme controller with localStorage persistence
- Dynamic icon switching for theme toggle button
- Seamless transition between light and dark modes

### 3. Particle Animation System
- Canvas-based particle rendering
- Mouse interaction with particles
- Configurable particle properties (count, size, speed, color)
- Connection lines between nearby particles
- Performance-optimized animation loop

### 4. Loading Screen
- Custom loading animation with code-style branding
- Timed reveal of main content
- Smooth transition effects

## Data Flow

1. **Initial Load**: Loading screen displays while assets load
2. **Theme Initialization**: Retrieves saved theme from localStorage or defaults to light
3. **Particle System**: Initializes canvas and begins animation loop
4. **Navigation**: Event listeners attached for smooth scrolling and mobile menu
5. **User Interactions**: Theme toggle, navigation clicks, and contact form submissions

## External Dependencies

### CDN Dependencies
- **Google Fonts**: Poppins font family for typography
- **Font Awesome**: Version 6.0.0 for scalable vector icons
- **EmailJS**: Version 3 for client-side email functionality

### Development Dependencies
- **Python HTTP Server**: Used for local development and deployment (port 5000)
- **Node.js 20**: Available but not actively used in current implementation

## Deployment Strategy

### Development Environment
- Python HTTP server on port 5000
- Hot reloading through browser refresh
- Static file serving from root directory

### Production Deployment
- Static hosting compatible (no server-side processing required)
- All assets served from CDN or local files
- Environment-agnostic design

### Hosting Requirements
- Static file hosting capability
- HTTPS support recommended for EmailJS functionality
- No database or server-side processing required

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 17, 2025. Initial setup

## Development Notes

### Code Organization
- **index.html**: Main HTML structure with semantic sections
- **styles.css**: Complete styling with CSS custom properties and responsive design
- **script.js**: Core JavaScript functionality for interactivity
- **assets/particles.js**: Advanced particle animation system

### Performance Considerations
- Particle system includes performance optimization
- CSS animations use transform and opacity for hardware acceleration
- Minimal JavaScript for fast load times
- CDN resources for improved caching

### Browser Compatibility
- Modern browser features used (CSS Grid, Custom Properties, ES6+)
- Graceful degradation for older browsers
- Mobile-responsive design tested across devices

### Future Enhancement Opportunities
- Add database integration for dynamic content management
- Implement blog functionality
- Add more interactive animations
- Integrate analytics tracking
- Add progressive web app (PWA) capabilities