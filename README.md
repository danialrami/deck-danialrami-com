# Deck Website

An interactive, visually dynamic deck featuring audio visualizations and a clean, modern aesthetic.

## Features

- Responsive design with animated transitions
- Interactive audio visualizations (waveforms, bars, circular patterns)
- Slide-based navigation structure
- Case study presentation format
- Animated glitch effects and subtle texture backgrounds
- Printable to PDF (using the included Python utility)

## Demo

[Live Demo](https://deck.danialrami.com) - Add your deployed URL here

## Structure

The project consists of:

- `index.html` - Main HTML structure
- `css/styles.css` - Styling and animations
- `js/script.js` - Interactive elements and audio visualizations
- `website-printer.py` - Python utility to generate PDFs from the website

## Audio Visualizations

The website features several types of audio visualizations:
- Animated waveforms using canvas
- Reactive audio bars with color transitions
- Circular audio visualization
These are all generated programmatically in JavaScript without requiring audio input.

## Getting Started

### Prerequisites

- A modern web browser
- Basic understanding of HTML, CSS, and JavaScript
- (Optional) Python 3.6+ with Selenium for PDF generation

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/sound-designer-portfolio.git
cd sound-designer-portfolio
```

2. Open `index.html` in your browser to view the site locally.

### PDF Generation (Optional)

The included `website-printer.py` script can generate a high-quality PDF of your portfolio:

1. Install the required Python packages:
```
pip install selenium webdriver-manager pillow reportlab
```

2. Run the script:
```
python website-printer.py
```

3. Find the generated PDF in the same directory.

## Customization

### Changing Colors

The color scheme is defined using CSS variables in the `:root` selector in `styles.css`:

```css
:root {
    --teal: #78BEBA;
    --red: #D35233;
    --yellow: #E7B225;
    --blue: #2C5AA0;
    --dark: #111111;
    --light: #fbf9e2;
}
```

### Adding New Slides

1. Create a new `<div>` with the class `slide` and a unique ID
2. Add your content within a `<div class="slide-content">` element
3. Add a new audio visualization element if desired
4. Update the JavaScript to include any new audio visualizations

## Accessibility

This template includes:
- Keyboard navigation support
- Semantic HTML structure
- High contrast between text and backgrounds

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE) - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for social media icons
- Inspired by modern audio visualization techniques