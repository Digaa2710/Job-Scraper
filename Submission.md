# Startup Jobs Listing Web Scraper

## Concise Overview of Work
This is a job posting web scraper that retrieves job details (job title, company, location, job description, and apply link) from Zepto. The scraped information is rendered as cards on the frontend (React.js), with an option to show the job description summary when a card is clicked. The backend is developed with Django and performs the web scraping and communication through GET and POST requests. The job descriptions are summarized using DeepSeek AI prior to being presented to the user.


## Tech Choices and Architecture
- **Frontend**:
  - **React.js**:Responsible for managing the user interface and presenting the job offers as cards. Responsible for the user interactions such as submitting URLs and viewing brief descriptions.
  - **TailwindCSS**:Used to quickly design and style the website with pre-defined classes, making it look clean and responsive.

- **Backend**:
  - **Django**: Handles the web scraping logic and API requests. It scrapes job data from provided URLs and processes the information.
  - **Selenium**: Used for scraping job data from the web.
  - **DeepSeek AI**: Summarizes job descriptions into concise text.
  - **REST API**: Facilitates communication between the frontend and backend using POST and GET requests.

- **Architecture**:
  - **Frontend (React.js)**: Displays job listings in a card format and handles user interaction.
  - **Backend (Django)**: Scrapes and processes the job data and communicates with DeepSeek AI for summarization.
  - **Communication**: Data is exchanged between the frontend and backend via POST and GET API requests.

## Local Setup and Run Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Digaa2710/Job-Scraper
   cd Job-Scraper

2. **Backend Setup (Django)**:
    ```bash
    cd backend
    pip install -r requirements.txt
    python manage.py makemigrations jobs
    python manage.py migrate
    python manage.py runserver

3. **Frontend Setup (React.js)**:
    ```bash
    cd frontend
    npm install
    npm run dev

## Notes on What You'd Improve or Add with More Time
1. **Additional Control Over Summaries**
    - Give users the option to control how short or lengthy the summaries are.

2. **Support More Sites**
    - Refine the scraper to accommodate more job portals and address complex pages.

3. **Optimize Selenium for Better Deployment**
    - Improve the Selenium scraping logic to make it more lightweight and efficient, especially for deployment on cloud platforms. This could include using headless mode, handling timeouts better, and minimizing resource usage to ensure smoother and more reliable performance in production.
