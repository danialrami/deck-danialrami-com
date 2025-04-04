import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from PIL import Image
import io
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.units import inch

def capture_website_as_pdf(url, output_pdf, slides_selector='.slide', wait_time=2, target_dpi=150):
    """
    Captures a website with slides as a PDF with optimal resolution and aspect ratio
    
    Args:
        url: URL of the website to capture
        output_pdf: Output PDF file path
        slides_selector: CSS selector to identify slides
        wait_time: Time to wait for animations to complete
        target_dpi: Target resolution (higher = better quality but smaller text)
    """
    # Letter paper aspect ratio is 8.5:11 = 1:1.29 in portrait
    # In landscape, it's 11:8.5 = 1.29:1
    paper_ratio = 11 / 8.5  # Landscape letter aspect ratio
    
    # Calculate window size based on the target DPI and letter size aspect ratio
    # Use a reasonable base size that's not too large to avoid browser limitations
    window_width = 1920
    window_height = int(window_width / paper_ratio)
    
    print(f"Using window size: {window_width}x{window_height} for letter paper aspect ratio (1.29:1)")
    
    # Set up Chrome options for headless operation
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument(f"--window-size={window_width},{window_height}")
    chrome_options.add_argument("--hide-scrollbars")
    
    # Set device scale factor for high-DPI rendering
    # Use a moderate value to keep text at a readable size
    device_scale_factor = target_dpi / 96  # 96 DPI is standard web resolution
    chrome_options.add_argument(f"--force-device-scale-factor={device_scale_factor}")
    
    # Initialize Chrome driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    try:
        # Navigate to the website
        driver.get(url)
        print(f"Loaded website: {url}")
        
        # Wait for the page to load completely
        time.sleep(3)
        
        # Find all slides
        slides = driver.find_elements(By.CSS_SELECTOR, slides_selector)
        print(f"Found {len(slides)} slides")
        
        # Set up PDF with letter landscape dimensions
        pdf_width, pdf_height = landscape(letter)
        c = canvas.Canvas(output_pdf, pagesize=(pdf_width, pdf_height))
        
        # For each slide
        for i, slide in enumerate(slides):
            print(f"Processing slide {i+1}/{len(slides)}")
            
            # Apply custom CSS to optimize for both quality and readability
            driver.execute_script("""
                // Add print-optimized styles
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = `
                    * {
                        text-rendering: geometricPrecision !important;
                        -webkit-font-smoothing: antialiased !important;
                    }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Scale text appropriately for PDF output */
                    h1 { font-size: 2.5em !important; }
                    h2 { font-size: 2em !important; }
                    h3 { font-size: 1.5em !important; }
                    p, li { font-size: 1.2em !important; }
                `;
                document.head.appendChild(style);
            """)
            
            # Show only the current slide
            for j, s in enumerate(slides):
                driver.execute_script(
                    "arguments[0].style.display = arguments[1];", 
                    s, 
                    'flex' if j == i else 'none'
                )
            
            # Add active class to current slide
            driver.execute_script("arguments[0].classList.add('active');", slide)
            
            # Wait for transitions
            time.sleep(wait_time)
            
            # Hide navigation buttons
            try:
                nav_buttons = driver.find_elements(By.CSS_SELECTOR, '.navigation, .nav-btn')
                for btn in nav_buttons:
                    driver.execute_script("arguments[0].style.display = 'none';", btn)
            except:
                pass
            
            # Ensure the slide fills the viewport properly
            driver.execute_script("""
                var slide = arguments[0];
                slide.style.width = '100vw';
                slide.style.height = '100vh';
                slide.style.margin = '0';
                slide.style.padding = '0';
                
                // Ensure all fonts are loaded
                document.fonts.ready.then(function() {
                    console.log('All fonts loaded');
                });
            """, slide)
            
            # Wait for rendering
            time.sleep(wait_time)
            
            # Take screenshot
            screenshot = driver.get_screenshot_as_png()
            image = Image.open(io.BytesIO(screenshot))
            
            # Calculate scaling to match PDF dimensions while preserving aspect ratio
            img_ratio = image.width / image.height
            pdf_ratio = pdf_width / pdf_height
            
            if abs(img_ratio - pdf_ratio) > 0.05:  # If ratios differ significantly
                print(f"Adjusting image from ratio {img_ratio:.2f} to match PDF ratio {pdf_ratio:.2f}")
                # Crop the image to match PDF aspect ratio
                if img_ratio > pdf_ratio:
                    # Image is wider than PDF
                    new_width = int(image.height * pdf_ratio)
                    left = (image.width - new_width) // 2
                    image = image.crop((left, 0, left + new_width, image.height))
                else:
                    # Image is taller than PDF
                    new_height = int(image.width / pdf_ratio)
                    top = (image.height - new_height) // 2
                    image = image.crop((0, top, image.width, top + new_height))
            
            # Add to PDF
            c.drawImage(ImageReader(image), 0, 0, pdf_width, pdf_height)
            c.showPage()
        
        # Save the PDF
        c.save()
        print(f"PDF created successfully at {output_pdf}")
        
    finally:
        # Close the browser
        driver.quit()

def capture_local_website_as_pdf(html_path, output_pdf, slides_selector='.slide', wait_time=2, target_dpi=150):
    """
    Captures a local HTML file as a PDF
    
    Args:
        html_path: Path to the local HTML file
        output_pdf: Output PDF file path
        slides_selector: CSS selector to identify slides
        wait_time: Time to wait for animations to complete
        target_dpi: Target resolution (higher = better quality but smaller text)
    """
    # Convert local path to file URL
    absolute_path = os.path.abspath(html_path)
    url = f"file://{absolute_path}"
    
    # Capture the website
    capture_website_as_pdf(url, output_pdf, slides_selector, wait_time, target_dpi)

if __name__ == "__main__":
    # For a local HTML file
    html_file = "index.html"  # Path to your HTML file
    output_file = "Daniel_Ramirez_Sound_Designer.pdf"
    
    # Use a moderate DPI that balances quality and readability
    # 150 DPI is good for web-to-print (higher than screen but not too small text)
    capture_local_website_as_pdf(html_file, output_file, target_dpi=150)