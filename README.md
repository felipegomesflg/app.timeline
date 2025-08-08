# Airtable Timeline

A React-based timeline component that visualizes project items in horizontal lanes with efficient space utilization.

## Features

- **Compact Lane Layout**: Items are arranged in horizontal lanes to maximize space efficiency
- **Zoom Functionality**: Zoom in/out to view timeline details
- **Inline Editing**: Double-click to edit item names
- **Drag & Drop**: Drag items to modify their dates (visual feedback)
- **Responsive Design**: Modern UI with smooth animations

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

This will start the development server and open the application in your default browser.

## Project Structure

```
src/
├── components/
│   ├── Timeline.js          # Main timeline component
│   ├── TimelineItem.js      # Individual timeline item
│   ├── Timeline.css         # Timeline styles
│   └── TimelineItem.css     # Item styles
├── utils/
│   ├── laneAssigner.js      # Lane assignment algorithm
│   └── dateUtils.js         # Date calculation utilities
├── timelineItems.js         # Sample timeline data
├── index.js                 # App entry point
├── index.html               # HTML template
└── app.css                  # Global styles
```

## Technologies Used

- React 18
- CSS3 with modern features
- Parcel bundler
- Vanilla JavaScript utilities

## Development

The project uses Parcel for bundling and development. The timeline component is built with React hooks and modern CSS features for optimal performance and user experience.
